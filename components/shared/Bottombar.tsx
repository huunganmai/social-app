"use client"

import {usePathname} from 'next/navigation'
import Image from 'next/image'
import Link  from 'next/link'

import { sidebarLinks } from '@/constants';

function Bottombar() {
    const pathname = usePathname();

    return (
        <section className="bottombar">
            <div className="bottombar_container">
                {sidebarLinks.map((link) => {
                    const isActive = (pathname.includes(link.route) && link.route.length > 1) || link.route === pathname

                    return (
                        <Link
                        href={link.route}
                        key={link.label}
                        className={`bottombar_link hover:bg-primary-500 transition duration-150 delay-50 ${isActive && 'bg-primary-500'}`}
                    >
                        <Image 
                            src={link.imgURL}
                            alt={link.label}
                            height={24}
                            width={24}
                        />

                        <p className='text-subtle-medium text-light-1 max-sm:hidden'>{link.label.split(/\s+/)[0]}</p>
                    </Link>
                    )
                })}
            </div>
        </section>
    )
}

export default Bottombar