import axios from 'axios';
import { env } from '../config/env';

export const fetchUser = async () => {
    try {
        const { data } = await axios.get(`${env.userServiceBaseUrl}/api/v1/users/my-profile`, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return data;
    } catch (error) {
        // Re-throw to let the caller handle it
        throw error;
    }
}