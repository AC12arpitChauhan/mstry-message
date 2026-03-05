import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import MessageModel from "@/model/Message";
import { messageStatusSchema } from "@/schemas/messageStatusSchema";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
  const url = new URL(request.url);
  const messageid = url.pathname.split("/").at(-2); // Extract messageid from /messages/[messageid]/status

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
    const result = messageStatusSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid status value",
          errors: result.error.format(),
        },
        { status: 400 }
      );
    }

    const { status } = result.data;
    const userId = new mongoose.Types.ObjectId(session.user._id!.toString());

    const updatedMessage = await MessageModel.findOneAndUpdate(
      { _id: messageid, recipientId: userId },
      { status },
      { new: true }
    );

    if (!updatedMessage) {
      return NextResponse.json(
        { success: false, message: "Message not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Message status updated", data: updatedMessage },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating message status:", error);
    return NextResponse.json(
      { success: false, message: "Error updating message status" },
      { status: 500 }
    );
  }
}
