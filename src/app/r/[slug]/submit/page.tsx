import Editor from '@/components/editor';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import React from 'react'

interface PageProps {
  params: {
    slug: string;
  }
}

async function page({ params }: PageProps) {
  const subreddit = await db.subreddit.findFirst({
    where: {
      name: params.slug,
    },
  });

  if (!subreddit) notFound();

  return (
    <div className='flex flex-col items-start gap-6'>
      <div className="border-b border-gray-100 pb-5">
        <div className="-ml-2 -mt-2 flex flex-wrap items-baseline">
          <div className="ml-2 mt-2 font-semibold text-base leading-6 text-gray-600">
            Create Post
          </div>
          <p className='ml-2 mt-1 truncate text-sm text-gray-500'>in r/{params.slug}</p>
        </div>
      </div>

      <Editor subredditId={subreddit.id} />
    </div>
  )
}

export default page