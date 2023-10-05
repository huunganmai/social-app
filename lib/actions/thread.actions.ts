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
        const deletedInParent = await User.updateOne(
            {_id: deletedThread.author},
            {$pull:  {threads : deletedThread._id }}
        ).exec();

        if(deletedInParent.modifiedCount === 1 ) {
            console.log("Deleted completed")
        } else {
            console.log("Fail to deleted")
        }

        //Delete children comment
        const deletedChildren = await Thread.deleteMany({parentId: deletedThread._id}).exec();        
    } catch (error: any) {
        throw new Error(`Fail to Delete thread: ${error.message}`)
    }
}

export async function reactionThread(threadId: string, userId: string, action: string) {
    try {
        connectToDB();

        const thread = await Thread.findById(threadId).exec();
        if(!thread) throw new Error("Thread not found")
        
        const user = await User.findById(userId).exec();
        console.log("user._id  "  +user._id)

        switch(action) {
            case 'like':
                if(!thread.likes.includes(user._id)) {
                    thread.likes.push(user._id)
                }
    
                const dislikeIndex = thread.dislikes.indexOf(user._id);
                if(dislikeIndex > -1) {
                    thread.dislikes.splice(dislikeIndex, 1)
                }
                break;

            case 'dislike':
                if(!thread.dislikes.includes(user._id)) {
                    thread.dislikes.push(user._id);
                }
    
                const likeIndex = thread.likes.indexOf(user._id)
                if(likeIndex > -1) {
                    thread.likes.splice(likeIndex, 1)
                }
                break;

            case 'removeLike':
                const likeIndexToRemove = thread.likes.indexOf(user._id)
                if(likeIndexToRemove > -1) {
                    thread.likes.splice(likeIndexToRemove, 1)
                }
                break;

            case 'removeDislike':
                const dislikeIndexToRemove = thread.dislikes.indexOf(user._id)
                if(dislikeIndexToRemove > -1) {
                    thread.dislikes.splice(dislikeIndexToRemove, 1)
                    // await Thread.updateOne(
                    //     {_id: threadId},
                    //     {
                    //         $pull: {
                    //             likes: user._id
                    //         }
                    //     }  
                    // )
                }
                break;

            default:
                throw new Error('Invalid action');
        }

        thread.save();

    } catch(error: any) {
        throw new Error(`Can not react thread: ${error.message}`)
    }

}

// TODO: Soft Deleted

export async function addLikeDislike() {
    try {
        connectToDB();
        const result = await Thread.updateMany(
            {},
            {
                $set: {
                likes: [],
                dislikes: [],
                }
            }
        )

        console.log("Thread modified" + result.modifiedCount);
    } catch (error: any) {
        throw new Error(`Can not addLike Dislike ${error.message}`)
    }
}