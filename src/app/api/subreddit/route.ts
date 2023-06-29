import { z } from 'zod';
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubredditValidator } from "@/lib/validators/subreddit";


export async function POST(request: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response('Unauthorize', { status: 401 });
    }

    const body = await request.json();

    const { name } = SubredditValidator.parse(body);

    const subredditExists = await db.subreddit.findFirst({
      where: {
        name,
      }
    });

    if (subredditExists) {
      return new Response('Subreddit already exist', { status: 409 });
    }

    const subreddit = await db.subreddit.create({
      data: {
        name,
        creatorId: session.user.id,
      }
    });

    await db.subscription.create({
      data: {
        userId: session.user.id,
        subredditId: subreddit.id,
      }
    });

    return new Response(subreddit.name);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }
  }
}