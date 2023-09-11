//app/page.tsx
import { UserButton, currentUser } from "@clerk/nextjs";

import { fetchPosts } from "@/lib/actions/thread.actions";
import ThreadCard from "@/components/cards/ThreadCard";

export default async function Home() {
  const result = await fetchPosts(1, 30);
  const user = await currentUser();

  return (
    <>
      <h1 className="head-text">Home</h1>

      <section>
        {result.posts.map((post) => (
          <ThreadCard 
            key={post._id}
            id={post._id}
            currentUserId={user?.id || ""}
            parentId={post.parentId}
            content={post.text}
            author = {post.author}
            community={post.community}
            createdAt={post.createdAt}
            comments={post.children}
          />
        ))}
      </section>
    </>
  )
}