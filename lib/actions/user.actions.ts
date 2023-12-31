"use server"

import { revalidatePath } from 'next/cache';

import {connectToDB} from '../mongoose'
import User from '../models/user.model'
import Thread from '../models/thread.model'
import { SortOrder, FilterQuery } from 'mongoose';
import { currentUser } from '@clerk/nextjs';

interface Params {
    userId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
    path: string;
}

export async function getUser() {
    const user = await currentUser();
    const res = await user;
    // console.log('get user '+ JSON.stringify(user));
    return res;
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
                username: username.toLowerCase(),
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

export async function fetchUsers({
    userId,
    searchString = "",
    pageNumber = 1,
    pageSize = 20,
    sortBy = "desc"
} : {
    userId: string;
    searchString?: string;
    pageNumber?: number;
    pageSize?: number;
    sortBy?: SortOrder;
}) {
    try {
        connectToDB();

        const skipAmount = (pageNumber - 1) * pageSize

        const regex = new RegExp(searchString, 'i')

        const query: FilterQuery<typeof User> = {
            id: { $ne: userId}
        }

        if(searchString.trim() !== '') {
            query.$or = [
                {name: { $regex: regex}},
                {username: { $regex: regex}}
            ]
        }

        const sortOption = { createAt : sortBy}

        const usersQuery = User.find(query)
            .sort(sortOption)
            .skip(skipAmount)
            .limit(pageSize);

        const totalUsersCount = await User.countDocuments(query);

        const users = await usersQuery.exec();

        const isNext = totalUsersCount > skipAmount + users.length;

        return {users, isNext}
    } catch (error : any) {
        throw new Error(`Fail to fetchUsers: ${error.message}`)
    }
}

export async function getActivity(userId: string) {
    try {
        connectToDB();

        const userThreads = await Thread.find({author: userId});

    
        // Collect all child thread Id (replies) from thr 'children' field
        const childThreadIds = userThreads.reduce((acc, userThread) => {
            return acc.concat(userThread.children)
        }, [])

        const replies = await Thread.find({
            _id: { $in: childThreadIds},
            author: { $ne: userId}
        })
        .populate({
            path: 'author',
            model: User,
            select: 'name image _id'
        })

        return replies;
    } catch(error: any) {
        throw new Error(`Fail to get activity: ${error.message}`)
    }
}



