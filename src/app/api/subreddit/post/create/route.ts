import { getAuthSession } from '@/lib/auth';
import { z } from 'zod';
import { db } from '@/lib/db';
import { PostValidator } from '@/lib/validators/post';

export async function POST(request: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 });
    }
    
    const body = await request.json();

    const { title, content, subredditId } = PostValidator.parse(body);

    const subscriptionExists = await db.subscription.findFirst({
      where: {
        subredditId,
        userId: session?.user.id,
      }
    });

    if (!subscriptionExists) {
      return new Response('You must be subscribe to do that', { status: 400 });
    }

    await db.post.create({
      data: {
        title,
        content,
        subredditId,
        authorId: session.user.id
      }
    });

    return new Response('OK');
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid data passed', { status: 422 });
    }

    return new Response('Something went wrong, Please try again later', { status: 500 });
  }
}