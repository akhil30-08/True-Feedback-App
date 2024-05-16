'use client';

import { Message } from '@/app/model/userModel';
import MessageCard from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, RefreshCcw } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { acceptMessageSchema } from '@/app/schemas/acceptMessageSchema';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [isAcceptingMessage, setIsAcceptingMessage] = useState(user?.isAcceptingMessage);

  const { toast } = useToast();

  console.log(user);
  console.log(isAcceptingMessage);

  // const baseURL = `${window.location.protocol}/${window.location.host}`;
  // const profileURL = `${baseURL}/u/${user?.username}`;

  // const copyToClipboard = () => {
  //   navigator.clipboard.writeText(profileURL);

  //   toast({
  //     title: 'URL Copied!',
  //     description: 'Profile URL has been copied to clipboard.',
  //   });
  // };

  const form = useForm<z.infer<typeof acceptMessageSchema>>({
    resolver: zodResolver(acceptMessageSchema),
    defaultValues: {
      acceptMessages: user?.isAcceptingMessage,
    },
  });

  async function onSubmit(data: z.infer<typeof acceptMessageSchema>) {
    try {
      setIsSwitchLoading(true);

      const result = await axios.post(`/api/accept-messages`, {
        acceptMessages: data,
      });

      console.log(result);
      setIsSwitchLoading(false);
      setIsAcceptingMessage(!isAcceptingMessage);
      toast({
        title: 'Success!',
        description: result.data.message,
      });
      router.refresh();
    } catch (error) {
      console.log(error);
      setIsSwitchLoading(false);
    }
  }

  return (
    <div className='my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl'>
      <h1 className='text-4xl font-bold mb-4'>User Dashboard</h1>

      <div className='mb-4'>
        <h2 className='text-lg font-semibold mb-2'>Copy Your Unique Link</h2>{' '}
        {/* <div className='flex items-center'>
          <input
            type='text'
            value={profileURL}
            disabled
            className='input input-bordered w-full p-2 mr-3'
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div> */}
      </div>

      <div className='mb-4'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-6'>
            <div>
              <div className='space-y-4'>
                <FormField
                  control={form.control}
                  name='acceptMessages'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-center rounded-lg gap-5 p-4'>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          disabled={isSwitchLoading}
                          onCheckedChange={(e: any) => {
                            field.onChange(e);
                            onSubmit(e.valueOf());
                          }}
                        />
                      </FormControl>
                      <div className='space-y-0.5'>
                        <FormLabel className=' text-2xl font-bold'>Accept Messages</FormLabel>
                        <FormDescription className='text-lg'>
                          {isAcceptingMessage ? 'ON' : 'OFF'}
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </form>
        </Form>

        {/* <span className='ml-2'>Accept Messages: {acceptMessages ? 'On' : 'Off'}</span> */}
      </div>
      <Separator />

      <Button
        className='mt-4'
        variant='outline'
        onClick={(e) => {
          e.preventDefault();
          // fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className='h-4 w-4 animate-spin' />
        ) : (
          <RefreshCcw className='h-4 w-4' />
        )}
      </Button>
      {/* <div className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-6'>
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={message._id}
              message={message}
              // onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div> */}
    </div>
  );
};

export default Dashboard;
