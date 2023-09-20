"use client"

import Image from "next/image"
import { useState, useRef, useEffect } from "react"

import { Button } from "../ui/button"
import useClickOutside from "../hooks/useClickOutside"
import Link from "next/link"

const OptionButton = ({threadId}: {threadId: string}) => {
    const [isActive, setIsActive] = useState(false)
    const optionRef = useRef<HTMLDivElement | null>(null)

    useClickOutside(optionRef, () => setIsActive(false))
    // useEffect(() => {
    //     const handleClickOutside = (event: any) => {
    //         if(optionRef.current && !optionRef.current.contains(event.target)){ 
    //             setIsActive(false);
    //         }
    //     }

    //     window.addEventListener('click', handleClickOutside)

    //     return () => {
    //         window.removeEventListener('click', handleClickOutside)
    //     }
    // }, [])

    const handleOptionButtonClick = (e:any) => {
        e.stopPropagation()
        setIsActive(!isActive);
    }    

    return (
        <div ref={optionRef}> 
            <Button variant={'ghost'} className="rounded-full" onClick={handleOptionButtonClick}>
                <Image 
                    src={'/assets/option.svg'}
                    alt="Option"
                    height={24}
                    width={24}
                    className="cursor-pointer object-contain"
                />
            </Button>
            {isActive && (
                <div className="flex flex-col absolute right-10 z-10 bg-white rounded-xl shadow">
                    <Link href={`/thread/${threadId}`} className="m-1 px-10 py-2 custom-hover-1 rounded-xl">
                        <span className="flex justify-center">Edit</span>
                    </Link>
                    <h1 className="cursor-pointer m-1 px-10 py-2 custom-hover-1 rounded-xl ">
                        <span className="flex justify-center">Delete</span>
                    </h1>
                </div>  
            )}
        </div>
    )
}

export default OptionButton