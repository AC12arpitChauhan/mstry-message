import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import MessageModel from "@/model/Message";

export async function GET(request: Request) {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username) {
    return Response.json(
      { success: false, message: "Username is required" },
      { status: 400 }
    );
  }

  try {
    const user = await UserModel.findOne({ username })
      .select("username bio profilePicture themeColor isAcceptingMessage")
      .lean();

    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Fetch pinned replied messages
    const pinnedMessages = await MessageModel.find({
      recipientId: user._id,
      isPinned: true,
      status: "replied",
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return Response.json(
      {
        success: true,
        data: {
          username: user.username,
          bio: user.bio || null,
          profilePicture: user.profilePicture || null,
          themeColor: user.themeColor || "#06b6d4",
          isAcceptingMessage: user.isAcceptingMessage,
          pinnedMessages,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching public profile:", error);
    return Response.json(
      { success: false, message: "Error fetching profile" },
      { status: 500 }
    );
  }
}
