import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import ProfileViewModel from "@/model/ProfileView";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username } = await request.json();

    if (!username) {
      return Response.json(
        { success: false, message: "Username is required" },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({ username }).select("_id").lean();

    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Fire-and-forget: create a profile view record
    await ProfileViewModel.create({ userId: user._id });

    return Response.json(
      { success: true, message: "View tracked" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error tracking view:", error);
    // Return success anyway to not block the client
    return Response.json(
      { success: true, message: "View tracked" },
      { status: 200 }
    );
  }
}
