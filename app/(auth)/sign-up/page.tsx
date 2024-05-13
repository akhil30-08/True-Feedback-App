'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema } from '@/app/schemas/signUpSchema';
import { z } from 'zod';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { useDebounce } from '@/app/helpers/useDebounce';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debouncedUsername = useDebounce(username, 1300);
  const { toast } = useToast();
  const router = useRouter();

  // define form
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    const checkIsUsernameUnique = async () => {
      if (!debouncedUsername) {
        setUsernameMessage('');
      }

      if (debouncedUsername.length > 1) {
        setIsCheckingUsername(true);
        setUsernameMessage('');

        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${debouncedUsername}`
          );

          console.log(response);
          setUsernameMessage(response.data.message);
        } catch (error: any) {
          console.log(error.response);
          setUsernameMessage(error.response.data.message);
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkIsUsernameUnique();
  }, [debouncedUsername]);

  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    setIsSubmitting(true);
    const { username, email, password } = values;

    try {
      const response = await axios.post(`/api/sign-up`, { username, email, password });

      toast({
        title: 'Success!',
        description: response.data.message,
      });

      router.replace(`/verify/${username}`);
      setIsSubmitting(false);
    } catch (error) {
      console.log(error);
      toast({
        title: 'Sign Up Failed',
        description: 'An error occurred. Please try again',
        variant: 'destructive',
      });
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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <FormField
                name='username'
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <Input
                      placeholder='johndoe'
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setUsername(e.target.value);
                      }}
                    />
                    {isCheckingUsername && <Loader2 className='animate-spin' />}
                    {!isCheckingUsername && usernameMessage && (
                      <p
                        className={`text-sm ${
                          usernameMessage === 'Username is unique'
                            ? 'text-green-500'
                            : 'text-red-500'
                        }`}
                      >
                        {usernameMessage}
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name='email'
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <Input {...field} name='email' placeholder='johndoe@example.com' />
                    <p className='text-sm text-slate-400'>We will send you a verification code</p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name='password'
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <Input type='password' {...field} name='password' />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type='submit' className='w-full' disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Please wait
                  </>
                ) : (
                  'Sign Up'
                )}
              </Button>
            </form>
          </Form>
          <div className='text-center mt-4'>
            <p>
              Already a member?{' '}
              <Link href='/sign-in' className='text-blue-600 hover:text-blue-800'>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
