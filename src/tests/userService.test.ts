import axios from 'axios';
import { fetchUser } from '../services/userService';
import { env } from '../config/env';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('fetchUser', () => {
    it('returns data on success', async () => {
        const mockData = { id: 1, name: 'John' };
        mockedAxios.get.mockResolvedValueOnce({ data: mockData });

        const result = await fetchUser();

        expect(mockedAxios.get).toHaveBeenCalledWith(
            `${env.userServiceBaseUrl}/api/v1/users/my-profile`,
            { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
        );
        expect(result).toEqual(mockData);
    });

    it('re-throws error on failure', async () => {
        const mockError = new Error('Network Error');
        mockedAxios.get.mockRejectedValueOnce(mockError);

        await expect(fetchUser()).rejects.toThrow('Network Error');
    });
});
