import axios from 'axios';
import { env } from '../config/env';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';
import {setBtnLoading, setLoading} from "@/redux/slices/authSlice";

export const fetchUser = async () => {
    setLoading(true);
    try {
        const token = Cookies.get('token');
        const { data } = await axios.get(`${env.userServiceBaseUrl}/api/v1/users/my-profile`, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
            }
        });
        return data;
    } catch (error) {
        // Re-throw to let the caller handle it
        throw error;
    }
}

export const updateProfilePicture = async(formData: any) => {
    setLoading(true);
    try {
        const token = Cookies.get('token');
        await axios.put(`${env.userServiceBaseUrl}/api/v1/users/update-profile-pic`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                ...(token && { Authorization: `Bearer ${token}` }),
            }
        })
        toast.success('Profile picture updated successfully.');
        fetchUser();
    } catch (error) {
        throw error;
    } finally {
        setLoading(false);
    }
}

export const updateResume = async(formData: any, id: number) => {
    setLoading(true);
    try {
        const token = Cookies.get('token');
        await axios.put(`${env.userServiceBaseUrl}/api/v1/users/update-resume/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                ...(token && { Authorization: `Bearer ${token}` }),
            }
        });
        toast.success('Resume updated successfully.');
        fetchUser();
    } catch (error) {
        throw error;
    } finally {
        setLoading(false);
    }
}

export const updateProfile = async(phoneNumber: string, bio: string, id: number) => {
    setBtnLoading(true);
    try {
        const token = Cookies.get('token');
        await axios.put(`${env.userServiceBaseUrl}/api/v1/users/update-profile/${id}`, {
            phoneNumber, bio
        }, {
            headers: {
                ...(token && { Authorization: `Bearer ${token}` }),
            }
        });
        toast.success('Profile updated successfully.');
        fetchUser();
    } catch (error) {
        throw error;
    } finally {
        setBtnLoading(false);
    }
}

export const addSkills = async(skill: string) => {
    setBtnLoading(true);
    try {
        const { data } = await axios.post(`${env.userServiceBaseUrl}/api/v1/users/skills/add`, {skill}, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${Cookies.get('token')}`,
            }
        });
        toast.success('Skill added successfully.');
        fetchUser();
    } catch (error) {
        throw error;
    } finally {
        setBtnLoading(false);
    }
}