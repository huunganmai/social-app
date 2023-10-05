"use client"

import {useState} from 'react'

const FollowButton = () => {
    const [isFollow, setIsFollow] = useState(false);

    const handleFollowButton = () => {
        setIsFollow(prev => !prev);
    }

    return (
        <div className={`flex items-center border border-secondary-500 ${ isFollow && 'bg-secondary-500 text-white'} rounded-xl cursor-pointer`}>
            <button onClick={handleFollowButton} className="px-6 py-2 w-full">
                Follow
            </button>
        </div>
    )
}

export default FollowButton