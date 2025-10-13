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
      from: 'no-reply@arpitchauhan.me',
      to: email, // Ensure this is the actual email address
      subject: 'True Feedback | Verification code',
      react: VerificationEmail({ username, otp: verifyCode }), // Pass username correctly
    });

    console.log('Resend Email Response:', response);

    return { success: true, message: 'Verification email sent successfully' };
  } catch (emailError) {
    console.error("Error sending verification email:", emailError);
    return { success: false, message: 'Failed to send verification email' };
  }
}
