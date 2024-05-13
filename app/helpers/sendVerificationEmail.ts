import { resend } from '../lib/resendEmail';
import VerificationEmail from '../components/emailTemplates/verifyEmailTemplate';
import { ApiResponse } from '../types/apiResponse';

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: 'Dark-Knight <onboarding@resend.dev>',
      to: email,
      subject: 'Verification Code | Simply Message',
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    return { success: true, message: 'Verification email sent' };
  } catch (errorEmail) {
    console.error('Error sending verification email');
    return { success: false, message: 'Verification email failed' };
  }
}
