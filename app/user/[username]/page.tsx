'use client';

import { messageSchema } from '@/app/schemas/messageSchema';
import { useParams } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { suggestMessages } from '@/app/helpers';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { toast } from '@/components/ui/use-toast';
import axios from 'axios';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

const SendMessagePage = () => {
  const { username } = useParams();

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: '',
    },
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  //TODO: submit not working as expected

  async function onSubmit(values: z.infer<typeof messageSchema>) {
    try {
      setIsLoading(true);

      const response = await axios.post('/api/send-message', { username, content: values.content });

      toast({
        title: 'Message sent successfully',
      });
    } catch (error: any) {
      console.log(error);

      toast({
        title: 'Error Occured',
        description: error.response.data.message,
      });
    } finally {
      setIsLoading(false);
      form.reset();
    }
  }

  const handleClickSuggest = (message: string) => {
    form.setValue('content', message);
  };

  return (
    <section className='w-full flex flex-col items-center p-4'>
      <div className='mt-4 w-full'>
        <h1 className='text-3xl md:text-4xl font-semibold text-center'>Public Profile Link</h1>
        {/* form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 max-w-2xl mx-auto mt-3'>
            <FormField
              control={form.control}
              name='content'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Send your anonymous message to @ {username}</FormLabel>
                  <FormControl>
                    <Input placeholder='Hi.. Who is your crush? ' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex justify-center'>
              <Button type='submit' disabled={!form.watch('content')} className='w-20'>
                {isLoading ? <Loader2 className='w-9 animate-spin' /> : 'Send'}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      <div className='w-full flex flex-col flex-1 my-7 md:my-9 gap-4 items-start max-w-2xl'>
        <Button className='max-w-44' variant={'outline'}>
          Suggested Messages
        </Button>

        <p className='text-slate-600 text-base'>Click on any message Below to select it.</p>

        <Card className='max-w-2xl w-full'>
          <CardHeader>
            <h3 className='text-lg font-medium'>Messages</h3>
          </CardHeader>

          <CardContent className='flex flex-col gap-3'>
            {suggestMessages.map((message) => (
              <Button
                key={message.id}
                variant='outline'
                onClick={() => handleClickSuggest(message.content)}
              >
                {message.content}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      <Separator className='w-full max-w-2xl h-1' />
      <div className='my-4 flex flex-col gap-3'>
        <p>Get your Message Board.</p>

        <Link href='/sign-up'>
          <Button>Create your Account</Button>
        </Link>
      </div>
    </section>
  );
};

export default SendMessagePage;
