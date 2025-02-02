// // import { resend } from '@/lib/resend.js';
// import { resend } from '../lib/resend';
// import VerificationEmail from '../../emails/VerificationEmail';
// import { apiResponse } from '@/types/apiResponse';

// export async function sendVerificationEmail(
//     email: string,
//     username: string,
//     verifyCode: string
// ): Promise<apiResponse>{
//     try {

//         const response = await resend.emails.send({
//             from: 'onboarding@resend.dev',
//             to: email,
//             subject: 'MstryMessage | Verification code',
//             react: VerificationEmail({username, otp: verifyCode}),
//           });
//           console.log("Username:", username);
//           console.log("Email:", email);
//           console.log("Verification Code:", verifyCode);

//         //   console.log("Email to send verification to:", email);
//           console.log('Resend Email Response:', response);


//         return {success: true, message: 'Verifiaction email send Successfully'}
//     } catch (emailError) {
//         console.error("error sending verification email")
//         return {success: false, message: 'failed to send verifiaction mail'}
//     }
// }

import { resend } from '../lib/resend';
import VerificationEmail from '../../emails/VerificationEmail';
import { apiResponse } from '@/types/apiResponse';

export async function sendVerificationEmail(
  username: string,
  email: string,
  verifyCode: string
): Promise<apiResponse> {
  try {
    console.log("Username:", username);
    console.log("Email:", email);
    console.log("Verification Code:", verifyCode);

    const response = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email, // Ensure this is the actual email address
      subject: 'MstryMessage | Verification code',
      react: VerificationEmail({ username, otp: verifyCode }), // Pass username correctly
    });

    console.log('Resend Email Response:', response);

    return { success: true, message: 'Verification email sent successfully' };
  } catch (emailError) {
    console.error("Error sending verification email:", emailError);
    return { success: false, message: 'Failed to send verification email' };
  }
}
