"use client";
import PostCard from "@/components/post-card";
import { client } from "@/lib/queryclient";

export default function Home() {
  const { data } = client.posts.useQuery(['posts'])
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {data?.body?.map((post) => (
        <PostCard id={post.id} createdAt={post.createdAt} title={post.title} authorId={post.authorId} content={post.content} key={post.id} />
      ))}
    </main>
  );
}
