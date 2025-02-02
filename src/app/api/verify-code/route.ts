import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request:Request) {
    await dbConnect();

    try {
      const { username = '', code = '' } = await request.json();

        const decodedUsername = decodeURIComponent(username)
        console.log('Decoded username:', decodedUsername);
        const user = await UserModel.findOne({ username: decodedUsername });
        console.log('User found:', user);


        if (!user) {
            return Response.json(
                {
                  success: false,
                  message: "user not found",
                },
                {
                  status: 500,
                }
              );
        }

        const isCodeValid = code === user.verifyCode
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true;
            await user.save()
            console.log("User successfully verified and updated:", user);
            return Response.json(
                {
                  success: true,
                  message: "User Verified Successfully",
                },
                {
                  status: 200,
                }
              );
        }
        else if(!isCodeNotExpired){
            return Response.json(
                {
                  success: false,
                  message: "Verification Code expired, Please Sign-in again",
                },
                {
                  status: 400,
                }
              );
        }
        else{
            return Response.json(
                {
                  success: false,
                  message: "Incorrect Verification Code",
                },
                {
                  status: 400,
                }
              );
        }

    } catch (error) {
      console.error("Error verifying user:", error);
      return Response.json(
        {
          success: false,
          message: "Internal server error",
        },
        {
          status: 500,
        }
      );
  }
  
}