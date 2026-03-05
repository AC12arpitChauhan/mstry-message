import UserModel from "@/model/User";
import MessageModel from "@/model/Message";
import dbConnect from "@/lib/dbConnect";
import { messageSchema } from "@/schemas/messageSchema";
import { checkRateLimit, checkDuplicateMessage, hashContent, checkBlockList } from "@/lib/messageGuards";
import { checkKeywordFilter } from "@/lib/bannedWords";
import { incrementEvent } from "@/model/Metric";
import { headers } from "next/headers";
import mongoose from "mongoose";

export async function POST(request: Request) {
  await dbConnect();

  const body = await request.json();
  const { username } = body;

  // ── Step 1: Zod validation (Stage 1) ──────────────────
  const validation = messageSchema.safeParse(body);
  if (!validation.success) {
    return Response.json(
      {
        success: false,
        message: "Invalid message content",
        errors: validation.error.format(),
      },
      { status: 400 }
    );
  }

  const { content } = validation.data;

  // ── Step 2: Rate limit check (Stage 2) ────────────────
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  const rateResult = await checkRateLimit(ip);
  if (!rateResult.allowed) {
    incrementEvent("rate_limited"); // fire-and-forget
    return Response.json(
      { success: false, message: rateResult.message },
      { status: rateResult.status }
    );
  }

  // ── Step 3: Global keyword filter (Stage 3) ───────────
  const keywordResult = checkKeywordFilter(content);
  if (keywordResult.blocked) {
    incrementEvent("keyword_blocked");
    return Response.json(
      { success: false, message: keywordResult.reason },
      { status: 400 }
    );
  }

  try {
    // ── Step 4: User lookup ─────────────────────────────
    const user = await UserModel.findOne({ username })
      .select("_id isAcceptingMessage blockedKeywords blockedIPs")
      .exec();

    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (!user.isAcceptingMessage) {
      return Response.json(
        { success: false, message: "User is not accepting messages" },
        { status: 403 }
      );
    }

    // ── Step 5: Recipient block list (Stage 4) ──────────
    const blockResult = checkBlockList(user, ip, content);
    if (!blockResult.allowed) {
      incrementEvent("blocklist_blocked");
      return Response.json(
        { success: false, message: blockResult.message },
        { status: blockResult.status }
      );
    }

    // ── Step 6: Duplicate check (Stage 2) ───────────────
    const dupeResult = await checkDuplicateMessage(user._id as mongoose.Types.ObjectId, content);
    if (!dupeResult.allowed) {
      incrementEvent("duplicate_blocked");
      return Response.json(
        { success: false, message: dupeResult.message },
        { status: dupeResult.status }
      );
    }

    // ── Step 7: Create message ──────────────────────────
    await MessageModel.create({
      recipientId: user._id,
      content,
      contentHash: hashContent(content),
    });

    // ── Step 8: Track metric (Stage 6) ──────────────────
    incrementEvent("message_sent");

    return Response.json(
      { success: true, message: "Message sent successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding message:", error);
    return Response.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}