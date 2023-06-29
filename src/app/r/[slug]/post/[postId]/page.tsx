import EditorOutput from '@/components/editor-output';
import { db } from '@/lib/db';
import { formatTimeToNow } from '@/lib/utils';
import { notFound } from 'next/navigation';
import React from 'react'

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

async function page({ params }: { params: { postId: string } }) {
  const id = params.postId

  if (!id) return notFound();

  const post = await db.post.findFirst({
    where: {
      id,
    },
    include: {
      votes: true,
      author: true,
    }
  });

  if (!post) return notFound();
  return (
    <div>
      <div className="h-full flex flex-col sm:flex-row items-center sm:items-start justify-between">
        <div className="sm:w-0 w-full flex-1 bg-white p-4 rounded-sm">
          <p className="max-h-40 mt-1 truncate text-xs text-gray-500">
            Posted by u/{post?.author.name}
            {formatTimeToNow(new Date(post.createdAt))}
          </p>
          <h1 className="text-xl font-semibold py-2 leading-6 text-gray-900">
            {post.title}
          </h1>

          <EditorOutput content={post.content} />
        </div>
      </div>
    </div>
  );
};

export default page;