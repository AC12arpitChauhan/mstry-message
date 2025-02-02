import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    // Check if the username is already taken by a verified user
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    console.log("Existing User Verified By Username:", existingUserVerifiedByUsername);

    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        {
          status: 400,
        }
      );
    }

    // Check if the email already exists
    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    console.log("Existing User By Email:", existingUserByEmail);

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        // Email belongs to a verified user; block signup
        return Response.json(
          {
            success: false,
            message: "User already exists with this email",
          },
          { status: 400 }
        );
      }

      // Ensure the username is consistent for unverified users
      if (existingUserByEmail.username !== username) {
        return Response.json(
          {
            success: false,
            message:
              "Email already in use by a different username. Please use the same username or another email.",
          },
          { status: 400 }
        );
      }

      // Update unverified user with new password and verification details
      const hashedPassword = await bcrypt.hash(password, 10);
      existingUserByEmail.password = hashedPassword;
      existingUserByEmail.verifyCode = verifyCode;
      existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);

      console.log("Updating existing unverified user:", existingUserByEmail);

      await existingUserByEmail.save();
    } else {
      // Create a new user
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });

      console.log("Creating new user:", newUser);

      await newUser.save();
    }

    // Send verification email
    const emailResponse = await sendVerificationEmail(username, email, verifyCode);

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully, please verify your email",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering user", error);
    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      {
        status: 500,
      }
    );
  }
}
