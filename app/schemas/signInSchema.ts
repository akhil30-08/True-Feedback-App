import { z } from 'zod';

export const signInSchema = z.object({
  // identifier is production term for username/email while signin process
  identifier: z.string(),
  password: z.string(),
});
