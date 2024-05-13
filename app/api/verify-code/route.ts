import { dbConnect } from '@/app/lib/dbConnect';
import { User } from '@/app/model/userModel';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code } = await request.json();

    const decodedUsername = decodeURIComponent(username);

    const user = await User.findOne({ username: decodedUsername });

    if (!user) {
      return Response.json({ success: false, message: 'User not found' }, { status: 500 });
    }

    const isCodeMatching = code === user.verifyCode;
    const isCodeValid = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeMatching && isCodeValid) {
      user.isVerified = true;
      await user.save();

      return Response.json(
        {
          success: true,
          message: 'User verified successfully',
        },
        { status: 200 }
      );
    } else if (!isCodeMatching) {
      return Response.json(
        {
          success: false,
          message: 'You have entered incorrect code. Please check the code again.',
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: 'Verification Code has expired. Please Sign Up again.',
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.log(error, 'Error verifying user');
    return Response.json({ success: false, message: 'Error verifying user' }, { status: 500 });
  }
}
