import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { VoteValidator } from "@/lib/validators/vote";
import type { CachedPost } from "@/types/redis";
import { z } from "zod";

const CACHE_AFTER_UPVOTES = 1;

export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    const { postId, voteType } = VoteValidator.parse(body);

    const session = await getAuthSession();

    if (!session) {
      return new Response('Unatuhorize', { status: 401 });
    }

    const voteAlreadyExist = await db.vote.findFirst({
      where: {
        userId: session.user.id,
        postId,
      }
    });
 
    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        author: true,
        votes: true,
      }
    });

    if (!post) {
      return new Response('Post not found', { status: 404 });
    }

    if (voteAlreadyExist) {
      if (voteAlreadyExist.type === voteType) {
        await db.vote.delete({
          where: {
            userId_postId: {
              postId,
              userId: session.user.id,
            }
          }
        })
      }
    }

    await db.vote.update({
      where: {
        userId_postId: {
          postId,
          userId: session.user.id
        }
      },
      data: {
        type: voteType,
      }
    });

    const votesAmt = 
      post.votes.reduce((acc, vote) => {
        if (vote.type === 'UP') acc + 1;
        if (vote.type === 'DOWN') acc - 1;

        return acc;
      }, 0);

    if (votesAmt >= CACHE_AFTER_UPVOTES) {
      const cachedPayload: CachedPost = {
        authorName: post.author.username || '',
        content: JSON.stringify(post.content),
        id: post.id,
        title: post.title,
        currentVote: voteType,
        createdAt: post.createdAt
      };

      await redis.hset(`post:${postId}`, cachedPayload)
    }

    await db.vote.create({
      data: {
        type: voteType,
        userId: session.user.id,
        postId,
      },
    });

    return new Response('Success');
  } catch (error) {
      if (error instanceof z.ZodError) {
        return new Response('Invalid passed data', { status: 422 });
      }

      return new Response('Internal server error', { status: 500 });
  }
}