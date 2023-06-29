import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SettingValidator } from "@/lib/validators/setting";
import { z } from "zod";


export async function PATCH(request: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response('Unauthorize', { status: 401 });
    }

    const body = await request.json();

    const { name } = SettingValidator.parse(body);

    const username = await db.user.findFirst({
      where: {
        username: name,
      }
    });

    if (username) {
      return new Response('Username already exist', { status: 409 });
    }

    await db.user.update({
      where: {
        id: session?.user.id,
      },
      data: {
        username: name,
      }
    });

    return new Response('Success');
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid data passed', { status: 422 });
    }
  
    return new Response('Could not create subreddit', { status: 500 });
  }
}