

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Button } from "../ui/button";
import OptionButton from "../button/OptionButton";
import ReactionButton from "../button/ReactionButton";
import FollowButton from "../button/FollowButton";

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
    accountType?: string;
    onDelete?: () => void;
    likes?: string[];
    dislikes?: string[];
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
    isComment,
    accountType,
    likes,
    dislikes
}: Props) => {

    return (
        <article className={`flex w-full flex-col bg-white rounded-xl ${isComment ? 'px-0 xs:px-7' : 'p-7'}`}>
            <div className="flex items-start justify-between">
                <div className="flex w-full flex-1 flex-row gap-4">                     
                    <div className="flex flex-col w-full">
                        <div className="relative flex flex-row justify-between">
                            <div className="flex flex-row gap-3">
                                <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
                                    <Image 
                                        src={author.image}
                                        alt="Profile photo"
                                        fill
                                        className="cursor-pointer rounded-full"
                                    />
                                </Link>
                                <Link href={`/profile/${author.id}`} className="w-fit">
                                    <h4 className="cursor-pointer">{author.name}</h4>
                                </Link>
                            </div>
                            <div className="flex flex-row gap-4">
                                <FollowButton />
                                <OptionButton threadId={id} accountType={accountType} />
                            </div>
                        </div>

                        <p className="mt-2 text-small-regular">{content}</p>

                        <div className={`${isComment && 'mb-10'} mt-5 flex flex-col gap-3`}>
                            <div className="flex border-y border-y-gray-2 gap-1">
                                <div className="flex flex-1 justify-center py-1 rounded-sm custom-hover-1">
                                    <ReactionButton 
                                        threadId={id}
                                        userId={currentUserId}
                                        likes={likes}
                                        dislikes={dislikes}
                                    />
                                </div>
                                <div className="flex justify-center flex-1 py-1 rounded-sm custom-hover-1">
                                    <Link href={`/thread/${id}`} className="flex flex-1 justify-center">
                                        <Image src={"/assets/reply.svg"} alt="reply" width={24} 
                                        height={24} className="cursor-pointer object-contain"
                                        />                                       
                                    </Link>
                                </div>
                                <div className="flex justify-center flex-1 py-1 rounded-sm custom-hover-1">
                                    <Image src={"/assets/repost.svg"} alt="repost" width={24} 
                                    height={24} className="cursor-pointer object-contain"
                                    />
                                </div>
                                <div className="flex py-1 justify-center flex-1 rounded-sm custom-hover-1">
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