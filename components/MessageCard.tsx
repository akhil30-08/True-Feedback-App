import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Message } from '@/app/model/userModel';
import { useToast } from './ui/use-toast';
import axios from 'axios';

type MessageCardProps = {
   message: Message;
   onMessageDelete: (messageId: string) => void;
};

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
   const { toast } = useToast();

   const handleDeleteConfirm = async () => {
      try {
         const result = await axios.delete(`/api/delete-message/${message._id}`);

         toast({
            title: result.data.message,
         });

         onMessageDelete(message._id);
      } catch (error: any) {
         toast({
            title: error.response.data.message,
         });
      }
   };

   return (
      <Card className='max-h-fit'>
         <CardContent className='flex justify-between items-center'>
            <p className='leading-relaxed rounded-md p-4 mt-2 whitespace-pre-wrap text-sm break-words'>{message.content}</p>

            <div>
               <AlertDialog>
                  <AlertDialogTrigger asChild>
                     <Button
                        variant='destructive'
                        size={'sm'}
                        className='p-1'
                     >
                        <X className='w-4 h-4' />
                     </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                     <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>This action cannot be undone. This will permanently delete this message.</AlertDialogDescription>
                     </AlertDialogHeader>
                     <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                     </AlertDialogFooter>
                  </AlertDialogContent>
               </AlertDialog>
            </div>

            {/* <div className='text-sm'>{dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}</div> */}
         </CardContent>
      </Card>
   );
};

export default MessageCard;
