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

    if (subscriptionExist) {
      return new Response('you already subscribed', { status: 400 });
    }

    await db.subscription.create({
      data: {
        subredditId,
        userId: session?.user.id,
      },
    });

    return new Response(subredditId);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid data passed', { status: 422 });
    }

    return new Response('Could not create subreddit', { status: 500 });
  }
}