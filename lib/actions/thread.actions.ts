"use server"

import { revalidatePath } from "next/cache";

import { connectToDB } from "../mongoose";
import Thread from "../models/thread.model";
import User from "../models/user.model";


interface Params {
    text: string;
    author: string;
    communityId: string | null;
    path: string;
}

export async function createThread({text, author, communityId, path}: Params) {
    try {
        connectToDB();
        const createdThread = await Thread.create({
            text,
            author,
            communityId: null,
        });

        // Update user model
        await User.findByIdAndUpdate(author, {
            $push: {threads: createdThread._id}
        })

        revalidatePath(path)
    } catch (error: any) {
        throw new Error(`Fail to create Thread: ${error}`)
    }
    
}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
    connectToDB();

    // Calculate the number of posts to skip
    const skipAmount = (pageNumber - 1) * pageSize;
    
    // Fetch the posts that have no parents (top-level threads)
    const postsQuery = Thread.find({ parentId: { $in: [null, undefined]}})
        .sort({ createdAt: 'desc'})
        .skip(skipAmount)
        .limit(pageSize)
        .populate({ path: 'author', model: User})
        .populate({
            path: 'children',
            populate: {
                path: 'author',
                model: User,
                select: "_id name parentId image"
            }
        });

    const totalPostsQuery = await Thread.countDocuments({ parentId: { $in: [null, undefined]}});

    const posts = await postsQuery.exec();

    const isNext = totalPostsQuery > skipAmount + posts.length;

    return {posts, isNext}
}

export async function fetchThreadById(id: string) {
    connectToDB();

    try {

        // TODO: Populate Community
        const thread = await Thread.findById(id)
            .populate({
                path: 'author',
                model: User,
                select: '_id id name image'
            })
            .populate({
                path: 'children',
                model: Thread,
                populate: [
                    {
                        path: 'author',
                        model: User,
                        select: "_id id name parentId image"
                    },
                    {
                        path: 'children',
                        model: Thread,
                        populate: {
                            path: 'author',
                            model: User,
                            select: "_id id name parentId image"
                        }
                    }
                ]
            })
            .exec();

            return thread;
    } catch (error: any) {
        throw new Error(`Can not find Thread By Id ${error.message}`)
    }
}

export async function addCommentToThread(
    threadId: string,
    commentText: string,
    userId: string,
    path: string,
) {
    try {
        connectToDB();
        // Find the original thread by its ID
        const originalThread = await Thread.findById(threadId);
        if(!originalThread) {
            throw new Error("Thread not found")
        }

        // Create a new thread with the comment text
        const commentThread = new Thread({
            text: commentText,
            author: userId,
            parentId: threadId,
        })

        // Save the new thread
        const savedCommentThread = await commentThread.save();

        // Update the original thread to include the new comment
        originalThread.children.push(savedCommentThread._id)

        // Save the original thread
        await originalThread.save();
        
        revalidatePath(path)
    } catch (error: any) {
        throw new Error(`Error adding comment to thread: ${error.message}`)
    }
}

export async function deleteThread(threadId: string) {
    try{
        connectToDB();

        const deletedThread = await Thread.findOneAndDelete({ _id: threadId}).exec();
        
        // Delete childrenID in parent thread
        const deletedInParent = await Thread.updateOne(
            {_id: deletedThread.parentId},
            {$pull: {children: deletedThread._id}}
        )
        console.log(`deletedInParent: ${deletedInParent}`)

        if(deletedInParent.modifiedCount === 1 ) {console.log("Deleted completed")}
        else console.log("Fail to deleted")

        // TODO: Delete children comment
        const deletedChildren = await Thread.deleteMany({parentId: deletedThread._id});
        console.log(`deletedChildren: ${deletedChildren}`)
        
    } catch (error: any) {
        throw new Error(`Fail to Delete thread: ${error.message}`)
    }
}

// TODO: Soft Deleted