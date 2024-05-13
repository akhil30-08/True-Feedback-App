'use client';

import { useToast } from '@/components/ui/use-toast';
import { useParams, useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { verifySchema } from '@/app/schemas/verifySchema';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

const VerifyCode = () => {
  const router = useRouter();
  const { username } = useParams();
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: '',
    },
  });

  async function onSubmit(values: z.infer<typeof verifySchema>) {
    try {
      setIsSubmitting(true);
      const result = await axios.post(`/api/verify-code`, { username, code: values.code });

      toast({
        title: 'Success',
        description: result.data.message,
      });

      router.replace('/sign-in');
    } catch (error: any) {
      setIsSubmitting(false);
      toast({
        title: 'Invalid Code',
        description: error.response.data.message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section>
      <div className='flex justify-center items-center min-h-screen bg-gray-800'>
        <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md mt-3'>
          <div className='text-center'>
            <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>
              Join True Feedback
            </h1>
            <p className='mb-4'>Sign up to start your anonymous adventure</p>
          </div>

          <div className='flex md:justify-center'>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='w-2/3 space-y-5'>
                <FormField
                  control={form.control}
                  name='code'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verification Code.</FormLabel>
                      <FormControl>
                        <InputOTP maxLength={6} {...field}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormDescription>
                        Please enter the Verification Code sent to your E-mail.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type='submit' disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className=' w-11 animate-spin' /> : 'Submit'}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VerifyCode;
