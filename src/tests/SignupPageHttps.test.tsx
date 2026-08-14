/**
 * @jest-environment jest-environment-jsdom
 * @jest-environment-options {"url": "https://localhost"}
 */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';
import SignupPage from '../pages/Authentication/SignupPage';
import authReducer from '../redux/slices/authSlice';
import userReducer from '../redux/slices/userSlice';

jest.mock('axios');
jest.mock('js-cookie');
const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedCookies = Cookies as jest.Mocked<typeof Cookies>;

const mockUser = {
  user_id: 1,
  name: 'Test User',
  email: 'test@example.com',
  phone_number: '1234567890',
  role: 'jobseeker' as const,
  bio: 'A bio',
  resume: null,
  resume_public_id: null,
  profile_pic: null,
  profile_pic_public_id: null,
  skills: [],
  subscription: null,
};

const makeStore = () =>
  configureStore({
    reducer: { auth: authReducer, user: userReducer },
    preloadedState: {
      auth: { user: null, isAuth: false, loading: false, btnLoading: false },
    },
  });

describe('SignupPage (https)', () => {
  it('sets secure:true cookie when protocol is https', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { token: 'tok', message: 'Registered!', registerUser: mockUser },
    });

    render(
      <Provider store={makeStore()}>
        <MemoryRouter>
          <SignupPage />
        </MemoryRouter>
      </Provider>
    );

    await userEvent.selectOptions(screen.getByRole('combobox'), 'recruiter');
    await userEvent.type(screen.getByLabelText(/full name/i), 'Test User');
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'secret123');
    await userEvent.type(screen.getByPlaceholderText(/enter mobile number/i), '1234567890');
    await userEvent.click(screen.getByRole('button', { name: /signup/i }));

    await waitFor(() => expect(mockedAxios.post).toHaveBeenCalledTimes(1));
    expect(mockedCookies.set).toHaveBeenCalledWith(
      'token', 'tok',
      expect.objectContaining({ secure: true })
    );
  });
});
