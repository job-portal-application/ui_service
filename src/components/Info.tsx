import type { AccountProps } from '@/lib/type';
import { Card } from '../../@/components/ui/card'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../@/components/ui/dialog';
import React, {type ChangeEvent, useRef, useState} from 'react'
import { Briefcase, FileText, LucideSmartphone, Mail, NotepadText, Camera, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "../../@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import { updateProfile, updateProfilePicture, updateResume } from "@/services/userService.ts";
import { setBtnLoading, setUser } from "@/redux/slices/authSlice.ts";
import toast from "react-hot-toast";
import { fetchUser } from "../services/userService.ts";
import { Label } from '../../@/components/ui/label';
import { Input } from '../../@/components/ui/input';

const Info: React.FC<AccountProps> = ({user, isYourAccount}) => {
    const dispatch = useAppDispatch();
    const { btnLoading } = useAppSelector((state) => state.auth);
    const inputRef = useRef<HTMLInputElement>(null);
    const editRef = useRef<HTMLButtonElement>(null);
    const resumeRef = useRef<HTMLInputElement>(null);

    const [phoneNumber, setPhoneNumber] = useState('');
    const [bio, setBio] = useState('');

    const handleClick = () => {
        inputRef.current?.click();
    }

    const changeHandler = async(e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if(!file) return;
        const formData = new FormData();
        formData.append('file', file);
        try {
            await updateProfilePicture(formData);
            const updatedUser = await fetchUser();
            dispatch(setUser(updatedUser));
        }catch(err: any) {
            toast.error(err.response.data.message);
        }
    }

    const handleEditClick = () => {
        editRef.current?.click();
        setPhoneNumber(user?.phone_number || "");
        setBio(user?.bio || "");
    }

    const updateProfileHandler = async() => {
        dispatch(setBtnLoading(true))
        try {
            await updateProfile(phoneNumber, bio, Number(user?.user_id));
            const updatedUser = await fetchUser();
            dispatch(setUser(updatedUser));
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    const changeResume = async(e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if(!file) return;
        const formData = new FormData();
        formData.append('file', file);
        try {
            await updateResume(formData, Number(user?.user_id));
            const updatedUser = await fetchUser();
            dispatch(setUser(updatedUser));
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    const handleResumeClick = () => {
        resumeRef.current?.click();
    }
  return (
    <div className='max-w-5xl mx-auto px-4 py-8'>
            <Card className="overflow-hidden shadow-lg border-2">
                <div className="h-32 bg-blue-500 relative">
                    <div className="absolute -bottom-16 left-8">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full border-4 border-background overflow-hidden shadow-xl bg-blue-100 flex items-center justify-center">
                                {user?.profile_pic ? (
                                    <img src={user.profile_pic} alt={user.name} className='w-full h-full object-cover' />
                                ) : (
                                    <span className="text-xl font-bold text-blue-600">
                                        {user?.name?.split(' ').slice(0, 2).map(n => n[0].toUpperCase()).join('')}
                                    </span>
                                )}
                            </div>
                            {/** Edit option for profile pic */}
                            {
                                isYourAccount && (
                                    <>
                                        <Button variant={"secondary"} size={"icon"} onClick={handleClick} className={"absolute bottom-0 right-0 rounded-full h-10 w-10 shadow-lg"}>
                                            <Camera size={18} />
                                        </Button>
                                        <input type={"file"} className={"hidden"} accept={"image/*"} ref={inputRef} onChange={changeHandler} />
                                    </>
                                )
                            }
                        </div>
                    </div>
                </div>
                {/** Main content */}
                <div className="pt-20 pb-8 px-8">
                    <div className="flex items-start justify-between flex-wrap gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold">
                                    {user?.name}
                                </h1>
                                {/** Edit button */}
                                {
                                    isYourAccount && (
                                        <Button variant={"ghost"} size={"icon"} className={"h-8 w-8"} onClick={handleEditClick}>
                                            <Edit size={16} />
                                        </Button>
                                    )
                                }
                            </div>
                            <div className="flex items-center gap-2 text-sm opacity-70">
                            {
                                user?.role && (
                                    <>
                                        <Briefcase size={16} />
                                        <span className='capitalize'>{user?.role}</span>
                                    </>
                                )
                            }
                            </div>
                        </div>
                    </div>
                    {/** Bio */}
                    {
                        user?.role === "jobseeker" && user?.bio && (
                            <div className="mt-6 p-4 rounded-lg border">
                                <div className="flex items-center gap-2 mb-2 text-sm font-medium opacity-70">
                                    <FileText size={16} />
                                    <span>About me</span>
                                </div>
                                <p className="text-base leading-relaxed">{user?.bio}</p>
                            </div>
                        )
                    }
                    {/** Contact information */}
                    <div className="mt-8">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Mail size={20} className='text-blue' />
                            Contact
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-4 rounded-lg border hover:border-blue-500 transition-colors">
                                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                    <Mail size={18} className={"text-blue-600"} />
                                </div>
                                <div className={"flex-1 min-w-0"}>
                                    <p className={"text-xs opacity-70 font-medium"}>Email</p>
                                    <p className={"text-sm truncate"}>{user?.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 rounded-lg border hover:border-blue-500 transition-colors">
                                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                    <LucideSmartphone size={18} className={"text-blue-500"} />
                                </div>
                                <div className={"flex-1 min-w-0"}>
                                    <p className={"text-xs opacity-70 font-medium"}>Phone</p>
                                    <p className={"text-sm truncate"}>{user?.phone_number}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/** resume section */}
                    {
                        user?.role === "jobseeker" && user?.resume && (
                            <div className={"mt-8"}>
                                <h2 className={"text-lg font-semibold mt-4 flex items-center gap-2"}>
                                    <NotepadText size={20} className={"text-blue-600"} />
                                    Resume
                                </h2>
                                <div className={"flex items-center gap-3 p-4 rounded-lg border hover:border-blue-500 transition-colors"}>
                                    <div className={"h-12 w-12 rounded-lg bg-red-100 dark:bg-red-900 flex items-center justify-center"}>
                                        <NotepadText size={20} className={"text-red-500"} />
                                    </div>
                                    <div className={"flex-1"}>
                                        <p className={"text-sm font-medium"}>Resume</p>
                                        <Link to={user?.resume} className={"text-sm text-blue-500 hover:underline"} target={"_blank"}>View resume</Link>
                                    </div>
                                    {/** Edit button */}
                                    <Button variant={'outline'} size={'sm'} onClick={handleResumeClick} className={"gap-2"}>Update</Button>
                                    <input type="file" ref={resumeRef} className='hidden' accept='application/pdf' onChange={changeResume} />
                                </div>
                            </div>
                        )
                    }
                </div>
            </Card>
            {/** Dialog box for editing profile */}
            <Dialog>
                <DialogTrigger>
                    <Button ref={editRef} variant={"outline"} className={"hidden"}>
                        Edit your profile
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className={"text-2xl"}>Edit your profile</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-5 py-4">
                        <div className="space-y-2">
                            <Label htmlFor={phoneNumber} className={"text-sm font-medium flex items-center gap-2"}>
                                <LucideSmartphone size={16} />
                                Phone number
                            </Label>
                            <Input id="phoneNumber" type='number' placeholder='Enter your mobile number' className='h-11' value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                        </div>
                        {
                            user?.role === "jobseeker" && (
                                <div className="space-y-2">
                                    <Label htmlFor={bio} className={"text-sm font-medium flex items-center gap-2"}>
                                        <FileText size={16} />
                                        Bio
                                    </Label>
                                    <Input id="phoneNumber" type='text' placeholder='Enter your mobile number' className='h-11' value={bio} onChange={(e) => setBio(e.target.value)} />
                                </div>
                            )
                        }
                        <DialogFooter>
                            <Button disabled={btnLoading} onClick={updateProfileHandler} className={"w-full h-11"} type='submit'>
                                {
                                    btnLoading ? "Saving changes" : "Save changes"
                                }
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
    </div>
  )
}

export default Info
