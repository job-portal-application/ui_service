import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import axios from 'axios';
import SIgninPage from '../pages/Authentication/SIgninPage';
import authReducer from '../redux/slices/authSlice';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('SIgninPage', () => {
  beforeEach(() => {
    mockedAxios.post.mockResolvedValue({
      data: {
        token: 'fake-token',
        message: 'Signed in successfully',
        user: {
          user_id: 1,
          name: 'Test User',
          email: 'test@example.com',
          phone_number: '1234567890',
          role: 'jobseeker' as const,
          bio: null,
          resume: null,
          resume_public_id: null,
          profile_pic: null,
          profile_pic_public_id: null,
          skills: [],
          subscription: null,
        },
      },
    });
  });

  it('submits the form when the login button is clicked', async () => {
    const store = configureStore({
      reducer: { auth: authReducer },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <SIgninPage />
        </MemoryRouter>
      </Provider>
    );

    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'secret123');
    await userEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalled();
    });
  });
});
