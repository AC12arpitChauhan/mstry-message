import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username = "", code = "" } = await request.json();

    const decodedUsername = decodeURIComponent(username);
    console.log("Decoded username:", decodedUsername);

    const user = await UserModel.findOne({ username: decodedUsername });
    console.log("User found:", user);

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const isCodeValid = code === user.verifyCode;
    const isCodeNotExpired =
      user.verifyCodeExpiry && new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      user.verifyCode = undefined; // optional cleanup
      user.verifyCodeExpiry = undefined; // optional cleanup
      await user.save();

      console.log("User successfully verified and updated:", user);

      return Response.json(
        {
          success: true,
          message: "User verified successfully",
        },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message: "Verification code expired. Please sign in again.",
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Incorrect verification code.",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error verifying user:", error);
    return Response.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}