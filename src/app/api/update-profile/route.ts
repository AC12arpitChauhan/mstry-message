import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";

const updateProfileSchema = z.object({
  bio: z.string().max(200, "Bio must be 200 characters or less").optional(),
  themeColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Invalid hex color")
    .optional(),
  profilePicture: z.string().url("Invalid URL").optional(),
});

export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const result = updateProfileSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        {
          success: false,
          message: "Invalid profile data",
          errors: result.error.format(),
        },
        { status: 400 }
      );
    }

    const updateData: Record<string, string> = {};
    if (result.data.bio !== undefined) updateData.bio = result.data.bio;
    if (result.data.themeColor !== undefined)
      updateData.themeColor = result.data.themeColor;
    if (result.data.profilePicture !== undefined)
      updateData.profilePicture = result.data.profilePicture;

    const updatedUser = await UserModel.findByIdAndUpdate(
      session.user._id,
      updateData,
      { new: true }
    ).select("username bio themeColor profilePicture");

    if (!updatedUser) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Profile updated successfully",
        data: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating profile:", error);
    return Response.json(
      { success: false, message: "Error updating profile" },
      { status: 500 }
    );
  }
}
