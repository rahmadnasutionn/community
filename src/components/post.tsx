"use client";

import { formatTimeToNow } from '@/lib/utils';
import { Post, User, Vote } from '@prisma/client';
import { MessageSquare } from 'lucide-react';
import { useRef } from 'react'
import EditorOutput from './editor-output';
import PostVoteClient from './post-vote/post-vote-client';

type PartialVote = Pick<Vote, 'type'>

interface PostProps {
  subredditName: string;
  post: Post & {
    author: User
    votes: Vote[]
  },
  commentAmt: number;
  votesAmt: number;
  currentVote?: PartialVote;
};

function Post({ subredditName, post, commentAmt, votesAmt, currentVote }: PostProps) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div className='rounded-md bg-white shadow'>
      <div className="px-6 py-5 flex justify-between">
        <PostVoteClient 
          postId={post.id}
          initialVote={currentVote?.type}
          initialVotesAmt={votesAmt} 
        />
        <div className="w-0 flex-1">
          <div className="max-h-40 mt-1 text-xs text-gray-500">
            {subredditName ? (
              <a href={`/r/${subredditName}`} className='underline text-zinc-800 text-sm underline-offset-2'>
                r/{subredditName}
              </a>
            ) : null}
            <span className='px-2'>Posted by u/{post.author.name}</span>
            {formatTimeToNow(new Date(post.createdAt))}
          </div>
          <a href={`/r/${subredditName}/post/${post.id}`}>
            <h1 className="text-lg font-semibold py-2 leading-6 text-gray-900">
              {post.title}
            </h1>
          </a>

          <div 
            className="relative max-h-40 w-full overflow-clip text-sm"
            ref={ref}
          >
            <EditorOutput content={post.content} />
            {ref.current?.clientHeight === 160 ? (
              <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent" />
            ) : null}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 z-20 text-sm p-4 sm:px-6">
        <a href={`/r/${subredditName}/post/${post.id}`} className="w-fit flex items-center gap-2">
          <MessageSquare className='w-4 h-4' /> {commentAmt} comments
        </a>
      </div>
    </div>
  );
};

export default Post;