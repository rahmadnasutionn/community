import PageHead from "@/components/page-head";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

export default async function Head({ params }: { params: { slug: string } }) {
  const slug = params.slug;

  if (!slug) notFound();

  const subreddit = await db.subreddit.findUnique({
    where: {
      name: slug,
    }
  });

  const pathname = `/r/${slug}`;

  return (
    <PageHead 
      title={subreddit?.name}
      description={subreddit?.name}
      pathname={pathname}
    />
  )
}