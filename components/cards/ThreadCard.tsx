

import Image from "next/image";
import Link from "next/link";

import { Button } from "../ui/button";
import OptionButton from "../button/OptionButton";

interface Props {
    id: string;
    currentUserId: string;
    parentId: string| null;
    content: string,
    author: {
        name: string;
        image: string;
        id: string;
    };
    community: {
        id: string;
        name: string;
        image: string;
    } | null;
    createdAt: string;
    comments: {
        author: {
            image: string;
        }
    }[]
    isComment?: boolean;
}

const ThreadCard = ({
    id,
    currentUserId,
    parentId,
    content,
    author,
    community,
    createdAt,
    comments,
    isComment
}: Props) => {
    return (
        <article className={`flex w-full flex-col bg-white rounded-xl ${isComment ? 'px-0 xs:px-7' : 'p-7'}`}>
            <div className="flex items-start justify-between">
                <div className="flex w-full flex-1 flex-row gap-4">
                    <div className="flex flex-col items-center">
                        <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
                            <Image 
                                src={author.image}
                                alt="Profile photo"
                                fill
                                className="cursor-pointer rounded-full"
                            />
                        </Link>
                        <div className="thread-card_bar"/>
                    </div>
                    <div className="flex flex-col w-full">
                        <div className="relative flex flex-row justify-between">
                            <Link href={`/profile/${author.id}`} className="w-fit">
                                <h4 className="cursor-pointer">{author.name}</h4>
                            </Link>
                            <OptionButton threadId={id}/>
                        </div>

                        <p className="mt-2 text-small-regular">{content}</p>

                        <div className={`${isComment && 'mb-10'} mt-5 flex flex-col gap-3`}>
                            <div className="flex py-2 border-y border-y-gray-2">
                                <div className="flex flex-1 justify-center hover:bg-gray-2 rounded-xl custom-hover">
                                    <Image src={"/assets/heart-gray.svg"} alt="heart" width={24} 
                                    height={24} className="cursor-pointer object-contain"
                                    />
                                </div>
                                <div className="flex justify-center flex-1 hover:bg-gray-2 rounded-xl custom-hover">
                                    <Link href={`/thread/${id}`} className="flex flex-1 justify-center">
                                        <Image src={"/assets/reply.svg"} alt="reply" width={24} 
                                        height={24} className="cursor-pointer object-contain"
                                        />                                       
                                    </Link>
                                </div>
                                <div className="flex justify-center flex-1 hover:bg-gray-2 rounded-xl custom-hover">
                                    <Image src={"/assets/repost.svg"} alt="repost" width={24} 
                                    height={24} className="cursor-pointer object-contain"
                                    />
                                </div>
                                <div className="flex justify-center flex-1 hover:bg-gray-2 rounded-xl custom-hover">
                                    <Image src={"/assets/share.svg"} alt="share" width={24} 
                                    height={24} className="cursor-pointer object-contain"
                                    />
                                </div>
                            </div>

                            {isComment && comments.length > 0 && (
                                <Link href={`/thread/${id}`}>
                                    <p className="mt-1 text-subtle-medium">
                                        {comments.length} reply
                                    </p>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </article>
    )
}

export default ThreadCard