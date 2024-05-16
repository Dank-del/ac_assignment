"use client";
import PostCard from "@/components/post-card";
import { client } from "@/lib/queryclient";

export default function Home() {
  const { data } = client.posts.useQuery(['posts'])
  return (
    <main className="min-h-screen md:px-24 px-9">
      <h1 className="text-2xl py-6">All Posts</h1>
      <div className="flex min-h-screen flex-wrap items-center gap-4">
      {data?.body?.map((post) => (
        <PostCard id={post.id} createdAt={post.createdAt} title={post.title} authorId={post.authorId} content={post.content} key={post.id} />
      ))}
      </div>
    </main>
  );
}
