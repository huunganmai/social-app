import { currentUser } from "@clerk/nextjs";
import {redirect} from 'next/navigation'

import { fetchUser, fetchUsers, getActivity } from "@/lib/actions/user.actions";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { profileTabs } from "@/constants";
import Image from "next/image";
import ThreadsTab from "@/components/shared/ThreadsTab";
import UserCard from "@/components/cards/UserCard";
import Link from "next/link";

const Page = async () => {
    const user = await currentUser();
    if(!user) return null;

    const userInfo = await fetchUser(user.id);
    if(!userInfo.onboarded) redirect('/onboarding');

    // Get activities
    const activities = await getActivity(userInfo._id)

    return (
        <section>
            <h1 className="head-text mb-10">Activity</h1>

            <section className='mt-10 flex flex-col gap-5'>
                {activities.length > 0 ? (
                    <>
                        {activities.map((activity) => (
                            <Link key={activity._id} href={`/thread/${activity.parentId}`}>
                                <article className="activity-card">
                                    <Image
                                        src={activity.author.image}
                                        alt="Profile photo"
                                        width={20}
                                        height={20}
                                        className="rounded-full object-contain"
                                    />
                                    <p className="!text-small-regular">
                                        <span className="mr-1 text-primary-500">
                                            {activity.author.name}
                                        </span>
                                        {" "}reply to your thread
                                    </p>
                                </article>
                            </Link>
                        ))}
                    </>
                ) : (
                    <h2>No activity</h2>
                )}
            </section>
        </section>
    )
}

export default Page