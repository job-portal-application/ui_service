import axios from 'axios';
import { env } from '../config/env';
import Cookies from 'js-cookie';

const FetchUserProfile = async(id: string) => {
  try {
        const token = Cookies.get('token');
        const { data } = await axios.get(`${env.userServiceBaseUrl}/api/v1/users/profile/${id}`, {
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

export default FetchUserProfile
