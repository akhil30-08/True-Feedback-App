import { dbConnect } from '@/app/lib/dbConnect';
import { User } from '@/app/model/userModel';
import { Message } from '@/app/model/userModel';

export async function POST(request: Request) {
  await dbConnect();

  const { username, content } = await request.json();

  try {
    const user = await User.findOne({ username: username });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: 'User not found',
        },
        { status: 404 }
      );
    }

    // is User accepting Message
    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          success: false,
          message: 'User is not accepting Messages',
        },
        { status: 403 }
      );
    }

    const newMessage = { content, createdAt: new Date() };

    if (content.length > 0) {
      user.messages.push(newMessage as Message);
      await user.save();

      return Response.json(
        {
          success: true,
          message: 'message was successfully sent.',
        },
        { status: 200 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: 'message cannot be empty',
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.log(error);

    return Response.json(
      {
        success: false,
        message: error.message,
      },
      { status: 400 }
    );
  }
}
