import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();

  try {
    // Get session and user
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return Response.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const userId = new mongoose.Types.ObjectId(session.user._id.toString());
    console.log("Fetching messages for user ID:", userId);

    // Aggregate query
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $project: { messages: { $reverseArray: "$messages" } } }, // Reverse array
    ]);

    if (!user || user.length === 0) {
      console.error("User not found for ID:", userId);
      return Response.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, messages: user[0].messages || [] },
      { status: 200 }
    );
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return Response.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
