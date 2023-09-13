"use server"

import { revalidatePath } from 'next/cache';

import {connectToDB} from '../mongoose'
import User from '../models/user.model'
import Thread from '../models/thread.model'

interface Params {
    userId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
    path: string;
}

export async function updateUser({
    userId,
    username,
    name,
    bio,
    image,
    path,
} : Params ): Promise<void> {
    connectToDB();

    try {
        await User.findOneAndUpdate(
            {id: userId},
            {
                username: username.toLowerCase,
                name,
                bio,
                image,
                onboarded: true
            },
            { upsert: true }
        );
    
        if(path === 'profile/edit') {
            revalidatePath(path);
        }
    } catch (error: any) {
        throw new Error(`Failed to create/update user: ${error.message}`)
    }
}

export async function fetchUser(userId: String) {
    try {
        connectToDB();

        return await User
            .findOne({id: userId})
            // .populate({
            //     path: 'communities',
            //     model: Community
            // })
    } catch (error: any) {
        throw new Error(`Failed to fetch user: ${error.message}`);
    }
}

export async function fetchUserPost(userId: string) {
    try {
        connectToDB();

        // Find all threads author by user with the give userId

        // TODO: Populate community

        const threads = await User.findOne({id: userId})
            .populate({
                path: 'threads',
                model: Thread,
                populate: {
                    path: 'children',
                    model: Thread,
                    populate: {
                        path: 'author',
                        model: User,
                        select: 'name image id'
                    }
                }
            });

        return threads;
    } catch (error: any) {
        throw new Error(`Can not fetch user post: ${error.message}`)
    }
}

// export async function cleanupUserThreads() {
//     try {
//         connectToDB();

//         const allThreads = await Thread.find({}, '_id').exec();
//         const allThreadsId = allThreads.map((thread: any) => thread._id);

//         const user = await User.findOne({}).exec();
//         user.threads = user.threads.filter((threadId : any) => allThreadsId.includes(threadId))
//         await user.save();

//     } catch (error: any) {
//         throw new Error(`Fail to cleanup User threads: ${error.message}`)
//     }
// }