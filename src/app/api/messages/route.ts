import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import MessageModel from "@/model/Message";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return Response.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const userId = new mongoose.Types.ObjectId(session.user._id!.toString());
    const { searchParams } = new URL(request.url);

    const cursor = searchParams.get("cursor");
    const limit = Math.min(parseInt(searchParams.get("limit") || "5"), 50);
    const filter = searchParams.get("filter") || "all";
    const search = searchParams.get("search")?.trim();

    // Build query
    const query: Record<string, unknown> = { recipientId: userId };

    // Apply status filter
    if (filter === "unread") {
      query.status = "unread";
    } else if (filter === "replied") {
      query.status = "replied";
    } else if (filter === "archived") {
      query.status = "archived";
    } else {
      // "all" filter excludes archived messages
      query.status = { $ne: "archived" };
    }

    // ── Search mode (Stage 5) ───────────────────────────
    if (search && search.length > 0) {
      // Text search mode: use $text for relevance-based results
      query.$text = { $search: search };

      // In search mode, use offset pagination (cursor doesn't work with $text sort)
      const page = parseInt(searchParams.get("page") || "0");

      const messages = await MessageModel.find(query)
        .sort({ score: { $meta: "textScore" }, createdAt: -1 })
        .skip(page * limit)
        .limit(limit + 1)
        .lean();

      const hasMore = messages.length > limit;
      const resultMessages = hasMore ? messages.slice(0, limit) : messages;

      return Response.json(
        {
          success: true,
          messages: resultMessages,
          nextCursor: null, // no cursor in search mode
          hasMore,
          searchMode: true,
        },
        { status: 200 }
      );
    }

    // ── Normal mode: cursor pagination ──────────────────
    if (cursor) {
      query._id = { $lt: new mongoose.Types.ObjectId(cursor) };
    }

    const messages = await MessageModel.find(query)
      .sort({ createdAt: -1 })
      .limit(limit + 1)
      .lean();

    const hasMore = messages.length > limit;
    const resultMessages = hasMore ? messages.slice(0, limit) : messages;
    const nextCursor = hasMore
      ? (resultMessages[resultMessages.length - 1]._id as string).toString()
      : null;

    return Response.json(
      {
        success: true,
        messages: resultMessages,
        nextCursor,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching messages:", error);
    return Response.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
