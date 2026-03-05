import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";

const blockSettingsSchema = z.object({
  blockedKeywords: z
    .array(z.string().max(100))
    .max(50, "Maximum 50 blocked keywords")
    .optional(),
  blockedIPs: z
    .array(z.string().max(45)) // IPv6 max length
    .max(100, "Maximum 100 blocked IPs")
    .optional(),
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
    const result = blockSettingsSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        {
          success: false,
          message: "Invalid block settings",
          errors: result.error.format(),
        },
        { status: 400 }
      );
    }

    const updateData: Record<string, string[]> = {};
    if (result.data.blockedKeywords !== undefined) {
      updateData.blockedKeywords = result.data.blockedKeywords;
    }
    if (result.data.blockedIPs !== undefined) {
      updateData.blockedIPs = result.data.blockedIPs;
    }

    await UserModel.findByIdAndUpdate(session.user._id, updateData);

    return Response.json(
      { success: true, message: "Block settings updated" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating block settings:", error);
    return Response.json(
      { success: false, message: "Error updating block settings" },
      { status: 500 }
    );
  }
}

export async function GET() {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  try {
    const user = await UserModel.findById(session.user._id)
      .select("blockedKeywords blockedIPs")
      .lean();

    return Response.json(
      {
        success: true,
        data: {
          blockedKeywords: user?.blockedKeywords || [],
          blockedIPs: user?.blockedIPs || [],
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching block settings:", error);
    return Response.json(
      { success: false, message: "Error fetching block settings" },
      { status: 500 }
    );
  }
}
