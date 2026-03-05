import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import MessageModel from "@/model/Message";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
  const url = new URL(request.url);
  // URL pattern: /api/messages/[messageid]/pin
  const segments = url.pathname.split("/");
  const messageid = segments[segments.length - 2];

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
    const userId = new mongoose.Types.ObjectId(session.user._id!.toString());

    const message = await MessageModel.findOne({
      _id: messageid,
      recipientId: userId,
    });

    if (!message) {
      return NextResponse.json(
        { success: false, message: "Message not found" },
        { status: 404 }
      );
    }

    // Toggle pin status
    message.isPinned = !message.isPinned;
    await message.save();

    return NextResponse.json(
      {
        success: true,
        message: message.isPinned ? "Message pinned" : "Message unpinned",
        data: message,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error toggling pin:", error);
    return NextResponse.json(
      { success: false, message: "Error toggling pin status" },
      { status: 500 }
    );
  }
}
