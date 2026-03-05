import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import MessageModel from "@/model/Message";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const replySchema = z.object({
  reply: z
    .string()
    .min(1, { message: "Reply cannot be empty" })
    .max(500, { message: "Reply must be no longer than 500 characters" }),
});

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  // URL pattern: /api/messages/[messageid]/reply
  const segments = url.pathname.split("/");
  const messageid = segments[segments.length - 2]; // second to last segment

  if (!messageid) {
    return NextResponse.json(
      { success: false, message: "Message ID is required" },
      { status: 400 }
    );
  }

  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const result = replySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid reply",
          errors: result.error.format(),
        },
        { status: 400 }
      );
    }

    const { reply } = result.data;
    const userId = new mongoose.Types.ObjectId(session.user._id!.toString());

    const updatedMessage = await MessageModel.findOneAndUpdate(
      { _id: messageid, recipientId: userId },
      {
        reply,
        repliedAt: new Date(),
        status: "replied",
      },
      { new: true }
    );

    if (!updatedMessage) {
      return NextResponse.json(
        { success: false, message: "Message not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Reply saved successfully",
        data: updatedMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving reply:", error);
    return NextResponse.json(
      { success: false, message: "Error saving reply" },
      { status: 500 }
    );
  }
}
