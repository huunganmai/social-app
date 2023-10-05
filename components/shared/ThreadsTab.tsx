

import { fetchUserPost } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";

import ThreadCard from "../cards/ThreadCard";
import MapThreadCard from "../cards/MapThreadCard";

interface Props {
    currentUserId: string;
    accountId: string;
    accountType: string;
    user: any
}

const ThreadsTab = async ({currentUserId, accountId, accountType, user} : Props) => {


    let result = await fetchUserPost(accountId);
    if(!result) redirect('/')


    // useEffect(() => {
    //     if(deletedThreadId) {
    //         set
    //     }
    // })

    const handleOnDeleted = () => {
        result = fetchUserPost(accountId)
    }

    return (
        <section className="mt-9 flex flex-col gap-10">
            {result.threads.map((thread: any) => (
                <ThreadCard 
                key={thread._id}
                id={thread._id}
                currentUserId={currentUserId}
                parentId={thread.parentId}
                content={thread.text}
                author = {accountType === "Author"
                    ? { name: result.name, image: result.image, id: result.id}
                    : {name: thread.author.name, image: thread.author.image, id: thread.author.id}
                }
                community={thread.community}
                createdAt={thread.createdAt}
                comments={thread.children}
                isComment
                accountType={accountType}
                />
            ))}

            
        </section>
    )
}

export default ThreadsTab