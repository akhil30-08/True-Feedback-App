import { dbConnect } from '@/app/lib/dbConnect';
import { User } from '@/app/model/userModel';
import { z } from 'zod';
import { usernameValidation } from '@/app/schemas/signUpSchema';

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);

    const queryParam = {
      username: searchParams.get('username'),
    };

    //validate with zod

    const result = UsernameQuerySchema.safeParse(queryParam);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];

      return Response.json(
        {
          success: false,
          message:
            usernameErrors.length > 0 ? usernameErrors.join(',') : 'Invalid query parameters',
        },
        { status: 400 }
      );
    }

    const { username } = result.data;

    const existingVerifiedUser = await User.findOne({ username: username, isVerified: true });

    if (existingVerifiedUser) {
      console.log('verified user');
      return Response.json(
        {
          success: false,
          message: 'Username is already taken',
        },
        { status: 401 }
      );
    }

    return Response.json(
      {
        success: true,
        message: 'Username is unique',
      },
      { status: 201 }
    );
  } catch (error) {
    console.log('Error checking username', error);
    return Response.json(
      {
        success: false,
        message: 'Error checking username',
      },
      { status: 500 }
    );
  }
}
