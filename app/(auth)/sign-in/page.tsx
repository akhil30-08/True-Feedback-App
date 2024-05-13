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
import { signInSchema } from '@/app/schemas/signInSchema';
import { signIn } from 'next-auth/react';

const SignIn = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  // define form
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof signInSchema>) {
    const { identifier, password } = values;

    setIsSubmitting(true);
    const response = await signIn('credentials', { identifier, password, redirect: false });

    console.log(response);

    if (response?.error) {
      setIsSubmitting(false);
      toast({
        title: 'Login Failed',
        description: 'Incorect username or password',
        variant: 'destructive',
      });
    }

    if (response?.url) {
      setIsSubmitting(false);
      router.replace('/dashboard');
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
            <p className='mb-4'>Sign In to start your anonymous adventure</p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <FormField
                name='identifier'
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email/Username</FormLabel>
                    <Input {...field} />
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
                  'Sign In'
                )}
              </Button>
            </form>
          </Form>
          <div className='text-center mt-4'>
            <p>
              Not a member?{' '}
              <Link href='/sign-up' className='text-blue-600 hover:text-blue-800'>
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignIn;
