"use client";

import { useMutation } from '@tanstack/react-query';
import { Button } from './ui/button';
import { SubscribeToSubredditPayload } from '@/lib/validators/subreddit';
import axios, { AxiosError } from 'axios';
import { toast } from '@/hooks/use-toast';
import { startTransition } from 'react';
import { useRouter } from 'next/navigation';

interface SubscribeLeaveToggleProps {
  subredditId: string;
  subredditName: string;
  isSubscribed: boolean;
} 

function SubscribeLeaveToggle({ subredditId, subredditName, isSubscribed }: SubscribeLeaveToggleProps) {
  const router = useRouter();

  const { mutate: subscribe, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        subredditId,
      };

      const { data } = await axios.post('/api/subreddit/subscribe', payload);
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return toast({
            title: 'Login required',
            description:
              'you must be login to do that',
            variant: 'destructive'
          })
        }

        return toast({
          title: 'There was an error',
          description: 
            'Someting went wrong, please try again later',
          variant: 'destructive',
        });
      }
    },
    onSuccess: () => {
      startTransition(() => router.refresh());

      return toast({
        title: 'Subscribed',
        description:
          `You are now subscribed to r/${subredditName}`
      })

    }
  });

  const { mutate: unsubscribe, isLoading: isUnsubscribeLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        subredditId,
      };

      const { data } = await axios.post('/api/subreddit/unsubscribe', payload);

      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return toast({
            title: 'Login required',
            description:
              'you must be login to do that',
            variant: 'destructive',
          })
        }

        return toast({
          title: 'There was an error',
          description:
            'Something went wrong, Please try again later',
          variant: 'destructive',
        })
      }
    },
    onSuccess: () => {
      startTransition(() => router.refresh());
      return toast({
        title: 'Unsubscribe',
        description:
          `you are now unsubscribe to r/${subredditName}`
      })
    }
  })

  return isSubscribed ? (
    <Button 
      className='w-full mt-1 mb-4'
      isLoading={isUnsubscribeLoading}
      onClick={() => unsubscribe()}
    >
      Leave community
    </Button>
  ) : (
    <Button 
      className='w-full mt-1 mb-4'
      isLoading={isLoading}
      onClick={() => subscribe()}
    >
      Join to post
    </Button>
  )
};

export default SubscribeLeaveToggle;