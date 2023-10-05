"use client"

import Image from "next/image"
import { useState, useRef, useEffect } from "react"

import { Button } from "../ui/button"
import useHover from "../hooks/useHover"
import { reactionThread } from "@/lib/actions/thread.actions"

const ReactionButton = ({threadId, userId, likes, dislikes}: {threadId: string, userId: string, likes?: string[], dislikes?: string[]}) => {
    const [isLiked, setIsLiked] = useState(false)
    const [isDisliked, setIsDisliked] = useState(false);
    const [isHover, setIsHover] = useState(false)

    // Original state ReactionButton
    useEffect(() => {
        if(likes?.includes(userId)) {
            setIsLiked(true);
        } else if(dislikes?.includes(userId)) {
            setIsDisliked(true);
        }

    },[])

    // Handle hover on ReactionButton
    const reactionRef = useRef<HTMLDivElement | null>(null)
    
    const handleHover = () => {
        setIsHover(true);
    };

    const handleLeave = () => {
        setIsHover(false);
    };

    useHover(reactionRef, handleHover, handleLeave);
  
    // Handle Like, Dislike, Remove Like, Dislike
    const handleReactionButton = () => {
        if(isLiked) {
            handleLikeButton();
        } else if(isDisliked) {
            handleDislikeButton();
        } else {
            handleLikeButton();
        }
    }

    const handleLikeButton = () => {
        if(isLiked) {
            reactionThread(threadId, userId, 'removeLike')
            setIsLiked(false)
        } else {
            reactionThread(threadId, userId, 'like')
            setIsLiked(true)
            setIsDisliked(false)
        }
    }

    const handleDislikeButton = () => {
        if(isDisliked){
            reactionThread(threadId, userId, 'removeDislike')
            setIsDisliked(false)
        } else {
            reactionThread(threadId, userId, 'dislike')
            setIsDisliked(true)
            setIsLiked(false)
        }
    }

    

    return (
        <div ref={reactionRef} className="w-full">
            <button onClick={handleReactionButton} className="flex justify-center w-full">
                <Image 
                    src={`/assets/${isLiked ? 'like-red' : isDisliked ? 'dislike-red' : 'heart-gray'}.svg`} 
                    alt="heart" width={24} 
                    height={24} className="cursor-pointer object-contain"
                />
            </button>
            {isHover && (
                <div className="flex flex-row gap-3 absolute p-3 bg-white">
                    <div className="rounded-xl custom-hover-1 px-2 py-1">
                        <button className="w-full" onClick={handleLikeButton}>
                            <Image 
                            src={`/assets/like-${isLiked ? 'red' : 'gray'}.svg`} 
                            alt="heart" width={24} 
                            height={24} className="cursor-pointer object-contain"
                            />
                        </button>
                    </div>
                    <div className="rounded-xl custom-hover-1 px-2 py-1">
                        <button className="w-full" onClick={handleDislikeButton}>
                            <Image 
                            src={`/assets/dislike-${isDisliked ? 'red' : 'gray'}.svg`} 
                            alt="heart" width={24} 
                            height={24} className="cursor-pointer object-contain"
                            />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ReactionButton;

