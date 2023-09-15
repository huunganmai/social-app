"use client"

import Image from 'next/image'
import Link  from 'next/link'
import {usePathname, useRouter} from 'next/navigation'
import { SignedIn, SignOutButton, useAuth } from '@clerk/nextjs'

import {sidebarLinks} from '@/constants'

function LeftSidebar() {
    const route = useRouter();
    const pathname = usePathname();
    const {userId} = useAuth();

    return (
        <section className="custom-scrollbar leftsidebar">
            <div className="flex w-full flex-1 flex-col gap-6 px-6">
                {sidebarLinks.map((link) => {
                    const isActive = (pathname.includes(link.route) && link.route.length > 1) || link.route === pathname
                    if(link.route === '/profile') link.route = `/profile/${userId}`
                    return (
                        <Link
                            href={link.route}
                            key={link.label}
                            className={`leftsidebar_link hover:bg-primary-500 transition duration-150 delay-50 ${isActive && 'bg-primary-500'}`}
                        >
                            <Image 
                                src={link.imgURL}
                                alt={link.label}
                                height={24}
                                width={24}
                            />

                            <p className='text-light-1 max-lg:hidden'>{link.label}</p>
                        </Link>)
                })}
            </div>
            <div className='mt-10 px-6'>
                <SignedIn>
                    <SignOutButton signOutCallback={() => route.push('/sign-in')}>
                        <div className="flex cursor-pointer gap-4">
                            <Image
                                src={'/assets/logout.svg'}
                                alt="logout"
                                height={24}
                                width={24}
                            />

                            <p className='text-light-2 max-lg-hidden'>Logout</p>
                        </div>
                    </SignOutButton>
                </SignedIn>
            </div>
        </section>
    )
}

export default LeftSidebar