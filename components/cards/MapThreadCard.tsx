 

import ThreadCard from "./ThreadCard"

const MapThreadCard = ({result, user} : {result: any, user: any}) => {
    return (
        <>
            {result.posts.map((post: any) => (
                <div className="flex flex-col">
                
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
                    accountType={user.id === post.author.id ? "Author" : "User"}
                    />
                </div>
            
            ))}
        </>
    )
}

export default MapThreadCard;