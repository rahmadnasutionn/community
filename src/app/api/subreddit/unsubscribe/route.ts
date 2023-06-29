import { getAuthSession } from "@/lib/auth";
import { z } from 'zod';
import { db } from "@/lib/db";
import { SubredditSubscriptionValidator } from "@/lib/validators/subreddit";


export async function POST(request: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const body = await request.json();

    const { subredditId } = SubredditSubscriptionValidator.parse(body);

    const subscriptionExist = await db.subscription.findFirst({
      where: {
        subredditId,
        userId: session?.user.id,
      },
    });

    if (!subscriptionExist) {
      return new Response('you are not subscribed to this subreddit', { status: 400 });
    }

    const subredditCreator = await db.subreddit.findFirst({
      where: {
        id: subredditId,
        creatorId: session.user.id,
      },
    });

    if (subredditCreator) {
      return new Response('you cant unsubscribe from your own subreddit', { status: 400 });
    }

    await db.subscription.delete({
      where: {
        userId_subredditId: {
          subredditId,
          userId: session.user.id
        }
      }
    });

    return new Response(subredditId);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid data passed', { status: 422 });
    }

    return new Response('Could not create subreddit', { status: 500 });
  }
}