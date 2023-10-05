"use client"

import Image from "next/image"
import { useState, useRef, useEffect } from "react"

import { Button } from "../ui/button"
import useClickOutside from "../hooks/useClickOutside"
import Link from "next/link"
import { deleteThread, fetchPosts } from "@/lib/actions/thread.actions"
import { fetchUserPost } from "@/lib/actions/user.actions"

const OptionButton = ({threadId, accountType}: {
    threadId: string,
    accountType?: string,
}) => {
    const [isActive, setIsActive] = useState(false)
    const optionRef = useRef<HTMLDivElement | null>(null)

    useClickOutside(optionRef, () => setIsActive(false))

    const handleOptionButton = (e:any) => {
        e.stopPropagation()
        setIsActive(!isActive);
        
    }

    const handleDeleteButton = async () => {
        await deleteThread(threadId);
        window.location.reload();
    }

    return (
        <div ref={optionRef}> 
            <Button variant={'ghost'} className="rounded-full" size={'icon'} onClick={handleOptionButton}>
                <Image 
                    src={'/assets/option.svg'}
                    alt="Option"
                    height={24}
                    width={24}
                    className="cursor-pointer object-contain"
                />
            </Button>

            {accountType === 'Author' && isActive && (
                <div className="flex flex-col absolute right-10 z-10 bg-white rounded-xl shadow">
                    <Link href={`/thread/edit/${threadId}`} className="m-1 px-10 py-2 custom-hover-1 rounded-xl">
                        <span className="flex justify-center">Edit</span>
                    </Link>
                    <Button variant={"ghost"} className="cursor-pointer m-1 px-10 py-2 custom-hover-1 rounded-xl " onClick={handleDeleteButton}>
                        <span className="flex justify-center">Delete</span>
                    </Button>
                </div>  
            )}

            {accountType === 'User' && isActive && (
                <div className="flex flex-col absolute right-10 z-10 bg-white rounded-xl shadow">
                    <h1 className="cursor-pointer m-1 px-10 py-2 custom-hover-1 rounded-xl ">
                        <span className="flex justify-center">Hide</span>
                    </h1>
                    <h1 className="cursor-pointer m-1 px-10 py-2 custom-hover-1 rounded-xl ">
                        <span className="flex justify-center">Report</span>
                    </h1>
                </div>
            )}
        </div>
    )
}

export default OptionButton