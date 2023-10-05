import { UserButton, currentUser } from "@clerk/nextjs";

import { addLikeDislike, fetchPosts } from "@/lib/actions/thread.actions";
import ThreadCard from "@/components/cards/ThreadCard";
import { redirect } from "next/navigation";
import ClientWrapper from "@/components/wrapper/ClientWrapper";
import { fetchUser } from "@/lib/actions/user.actions";

export default async function Home() {
  const result = await fetchPosts(1, 30);

  const user = await currentUser();
  if(!user) redirect("/sign-in");
  
  const userInfo = await fetchUser(user.id)
  if(!userInfo.onboarded) redirect("/onboarding")


  return (
    <ClientWrapper>
      <h1 className="head-text">Home</h1>

      <section className="flex flex-col mt-9 gap-4">
        {result.posts.map((post) => (
          <div className="flex flex-col">
              <ThreadCard 
                key={post._id}
                id={post._id}
                currentUserId={userInfo?._id || ""}
                parentId={post.parentId}
                content={post.text}
                author = {post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children}
                accountType={user.id === post.author.id ? "Author" : "User"}
                likes= {post.likes}
                dislikes = {post.dislikes}
              />
          </div>
          
        ))}
      </section>
    </ClientWrapper>
  )
}