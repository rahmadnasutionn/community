"use client";

import usePrevious from "@/hooks/use-previous";
import { VoteType } from "@prisma/client";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { PostVoteRequest } from "@/lib/validators/vote";
import axios, { AxiosError } from "axios";
import Spinner from "../ui/spinner";
import { toast } from "@/hooks/use-toast";

interface PostVoteClientType {
  postId: string;
  initialVotesAmt: number;
  initialVote?: VoteType | null;
};

function PostVoteClient({
  postId,
  initialVotesAmt,
  initialVote
}: PostVoteClientType) {

  const [votesAmt, setVotesAmt] = useState<number>(initialVotesAmt);
  const [currentVote, setCurrentVote] = useState(initialVote);
  const prevVote = usePrevious(currentVote);

  useEffect(() => {
    setCurrentVote(initialVote);
  }, [initialVote]);

  const { mutate: vote, isLoading } = useMutation({
    mutationFn: async (voteType: VoteType) => {
      const payload: PostVoteRequest = {
        postId,
        voteType,
      };

      await axios.patch('/api/subreddit/post/vote', payload);
    },
    onError: (err, voteType) => {
      if (voteType === 'UP') {
        setVotesAmt((prev) => prev + 1);
      } else {
        setVotesAmt((prev) => prev - 1);
      }

      setCurrentVote(prevVote);

      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return toast({
            title: 'Login required',
            description:
              'you must be login to do that',
            variant: 'destructive',
          });
        }
      }

      return toast({
        title: 'Something went wrong',
        description:
          'You vote cannot be save',
        variant: 'destructive',
      });
    },
    onMutate: (type: VoteType) => {
      if (currentVote === type) {
        setCurrentVote(undefined);
        if (type === 'UP') {
          setVotesAmt((prev) => prev - 1);
        } else if (type === 'DOWN') {
          setVotesAmt((prev) => prev + 1);
        } else {
          if (type === 'UP') {
            setVotesAmt((prev) => prev + (currentVote ? 2 : 1))
          } else if (type === 'DOWN') {
            setVotesAmt((prev) => prev - (currentVote ? 2 : 1))
          }
        }
      }
    }
  });
  
  return (
    <div className="flex sm:flex-col gap-4 sm:gap-0 pr-6 sm:w-20 pb-4 sm:pb-0">
      <Button
        size={'sm'}
        variant={'ghost'}
        aria-label="upvote"
        onClick={() => vote('UP')}
        disabled={isLoading}
      >
        {isLoading ? <Spinner className="bg-black" /> : 
        <ArrowBigUp 
          className={cn('w-5 h-5 text-zinc-700', {
            'text-emerald-500 fill-emerald-500': currentVote === 'UP'
          })} 
        />
        }
      </Button>

      <p className="text-center py-2 font-medium text-sm text-zinc-900">
        {votesAmt}
      </p>

      <Button
        size={'sm'}
        variant={'ghost'}
        aria-label="downvote"
        onClick={() => vote('DOWN')}
        disabled={isLoading}
      >
        {isLoading ? <Spinner className="bg-black" /> : 
        <ArrowBigDown
          className={cn('w-5 h-5 text-zinc-700', {
            'text-emerald-500 fill-emerald-500': currentVote === 'DOWN'
          })} 
        />
        }
      </Button>
    </div>
  );
};

export default PostVoteClient