"use client"

import { useForm } from "react-hook-form";
import {zodResolver} from '@hookform/resolvers/zod'
import * as z from 'zod'
import Image from "next/image";
import { ChangeEvent, useState } from "react";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {Input} from '@/components/ui/input'
import {Button} from '@/components/ui/button'
import { Textarea } from "@/components/ui/textarea";
import { UserValidation } from "@/lib/validations/user";
import { isBase64Image } from "@/lib/utils";
import {useUploadThing} from '@/lib/uploadthing'


interface Props {
    user: {
        id: string,
        objectId: string,
        username: string,
        name: string,
        bio: string,
        image: string,
    };
    
    btnTitle: string;
}

function AccountProfile({user, btnTitle}: Props) {

    const [files, setFiles] = useState<File[]>([])

    const form = useForm({
        resolver: zodResolver(UserValidation),
        defaultValues: {
            profile_photo: user?.image || "",
            name: user?.name || "",
            username: user?.username || "",
            bio: user?.bio || "",
        }
    })

    const handleImage = (e: ChangeEvent<HTMLInputElement>, fieldChange: (value: string) => void) => {
        e.preventDefault();

        const fileReader = new FileReader();

        if(e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]

            setFiles(Array.from(e.target.files));

            if(!file.type.includes('image')) return;

            fileReader.onload = async (e) => {
                const imageDataUrl = e.target?.result ? e.target.result.toString() : ''
                fieldChange(imageDataUrl);
            }
            
            fileReader.readAsDataURL(file)
        }
    }

    function onSubmit(values: z.infer<typeof UserValidation>) {
        const blog = values.profile_photo

        const hasImageChange = isBase64Image(blog)

        if(hasImageChange) {}
    }
    
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-start gap-10">
                <FormField
                control={form.control}
                name="profile_photo"
                render={({ field }) => (
                    <FormItem className="flex items-center">
                        <FormLabel className="account-form_image-label">
                            {field.value ? (
                                <Image 
                                    src={field.value}
                                    alt="profile photo"
                                    width={96}
                                    height={96}
                                    priority
                                    className="rounded-full object-contain"
                                />
                            ) : (
                                <Image 
                                    src={"/assets/profile.svg"}
                                    alt="profile.photo"
                                    width={24}
                                    height={24}
                                    className="object-cover rounded-full"
                                />
                            )}
                        </FormLabel>
                        <FormControl>
                            <Input
                                type="file"
                                accept="image/*"
                                placeholder="Upload a photo"
                                className="account-form_image-input ml-4 text-light-2"
                                onChange={(e) => handleImage(e, field.onChange)}
                            />
                        </FormControl>
                        
                    </FormItem>
                )}
                />

                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className="flex flex-col gap-4">
                            <FormLabel className="text-base-semibold text-light-2">
                                Name
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    accept="image/*"
                                    className="account-form_input no-focus"
                                    {...field}
                                />
                            </FormControl>                          
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='username'
                    render={({ field }) => (
                        <FormItem className='flex w-full flex-col gap-3'>
                        <FormLabel className='text-base-semibold text-light-2'>
                            Username
                        </FormLabel>
                        <FormControl>
                            <Input
                            type='text'
                            className='account-form_input no-focus'
                            {...field}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='bio'
                    render={({ field }) => (
                        <FormItem className='flex w-full flex-col gap-3'>
                        <FormLabel className='text-base-semibold text-light-2'>
                            Bio
                        </FormLabel>
                        <FormControl>
                            <Textarea
                            rows={10}
                            className='account-form_input no-focus'
                            {...field}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}

export default AccountProfile