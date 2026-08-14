import { render, screen, waitFor, fireEvent } from '@testing-library/react';
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

const makeStore = (isAuth = false) =>
  configureStore({
    reducer: { auth: authReducer, user: userReducer },
    preloadedState: {
      auth: { user: isAuth ? mockUser : null, isAuth, loading: false, btnLoading: false },
    },
  });

const renderPage = (isAuth = false) =>
  render(
    <Provider store={makeStore(isAuth)}>
      <MemoryRouter>
        <SignupPage />
      </MemoryRouter>
    </Provider>
  );

// Helpers — source has mismatched htmlFor/id on phone, resume, bio inputs
const getPhoneInput = () => screen.getByPlaceholderText(/enter mobile number/i);
const getResumeInput = () => document.getElementById('resume') as HTMLInputElement;
const getBioInput = () => screen.getByPlaceholderText(/mention about yourself/i);

describe('SignupPage', () => {
  beforeEach(() => jest.clearAllMocks());

  it('redirects to "/" when already authenticated', () => {
    renderPage(true);
    expect(screen.queryByText(/join hireheaven/i)).not.toBeInTheDocument();
  });

  it('renders the signup form when not authenticated', () => {
    renderPage();
    expect(screen.getByText(/join hireheaven/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
  });

  it('shows common fields after selecting recruiter role', async () => {
    renderPage();
    await userEvent.selectOptions(screen.getByRole('combobox'), 'recruiter');
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(getPhoneInput()).toBeInTheDocument();
    expect(screen.queryByText(/resume/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/description/i)).not.toBeInTheDocument();
  });

  it('shows jobseeker-specific fields after selecting jobseeker role', async () => {
    renderPage();
    await userEvent.selectOptions(screen.getByRole('combobox'), 'jobseeker');
    expect(getResumeInput()).toBeInTheDocument();
    expect(getBioInput()).toBeInTheDocument();
  });

  it('submits successfully as recruiter and dispatches auth state', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { token: 'tok', message: 'Registered!', registerUser: mockUser },
    });

    renderPage();
    await userEvent.selectOptions(screen.getByRole('combobox'), 'recruiter');
    await userEvent.type(screen.getByLabelText(/full name/i), 'Test User');
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'secret123');
    await userEvent.type(getPhoneInput(), '1234567890');
    await userEvent.click(screen.getByRole('button', { name: /signup/i }));

    await waitFor(() => expect(mockedAxios.post).toHaveBeenCalledTimes(1));
    const [url, body] = mockedAxios.post.mock.calls[0] as [string, FormData];
    expect(url).toContain('/api/v1/auth/register');
    expect(body.get('role')).toBe('recruiter');
    expect(body.get('name')).toBe('Test User');
  });

  it('submits successfully as jobseeker with resume and bio', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { token: 'tok', message: 'Registered!', registerUser: mockUser },
    });

    const { container } = renderPage();
    await userEvent.selectOptions(screen.getByRole('combobox'), 'jobseeker');
    await userEvent.type(screen.getByLabelText(/full name/i), 'Test User');
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'secret123');
    await userEvent.type(getPhoneInput(), '1234567890');
    await userEvent.type(getBioInput(), 'My bio');

    const file = new File(['pdf content'], 'resume.pdf', { type: 'application/pdf' });
    await userEvent.upload(getResumeInput(), file);

    fireEvent.submit(container.querySelector('form')!);

    await waitFor(() => expect(mockedAxios.post).toHaveBeenCalledTimes(1));
    const body = mockedAxios.post.mock.calls[0][1] as FormData;
    expect(body.get('role')).toBe('jobseeker');
    expect(body.get('bio')).toBe('My bio');
    expect(body.get('resume')).toBeTruthy();
  });

  it('submits as jobseeker without resume (covers if(resume) false branch)', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { token: 'tok', message: 'Registered!', registerUser: mockUser },
    });

    const { container } = renderPage();
    await userEvent.selectOptions(screen.getByRole('combobox'), 'jobseeker');
    await userEvent.type(screen.getByLabelText(/full name/i), 'Test User');
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'secret123');
    await userEvent.type(getPhoneInput(), '1234567890');
    await userEvent.type(getBioInput(), 'My bio');

    // No file upload — covers the `if(resume)` false branch
    fireEvent.submit(container.querySelector('form')!);

    await waitFor(() => expect(mockedAxios.post).toHaveBeenCalledTimes(1));
    const body = mockedAxios.post.mock.calls[0][1] as FormData;
    expect(body.get('resume')).toBeNull();
  });

  it('handles API error with response message', async () => {
    mockedAxios.post.mockRejectedValueOnce({
      response: { data: { message: 'Email already exists' } },
    });

    renderPage();
    await userEvent.selectOptions(screen.getByRole('combobox'), 'recruiter');
    await userEvent.type(screen.getByLabelText(/full name/i), 'Test User');
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'secret123');
    await userEvent.type(getPhoneInput(), '1234567890');
    await userEvent.click(screen.getByRole('button', { name: /signup/i }));

    await waitFor(() => expect(mockedAxios.post).toHaveBeenCalledTimes(1));
  });

  it('handles API error with generic error message', async () => {
    mockedAxios.post.mockRejectedValueOnce({ message: 'Network Error' });

    renderPage();
    await userEvent.selectOptions(screen.getByRole('combobox'), 'recruiter');
    await userEvent.type(screen.getByLabelText(/full name/i), 'Test User');
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'secret123');
    await userEvent.type(getPhoneInput(), '1234567890');
    await userEvent.click(screen.getByRole('button', { name: /signup/i }));

    await waitFor(() => expect(mockedAxios.post).toHaveBeenCalledTimes(1));
  });

  it('handles API error with no message (fallback)', async () => {
    mockedAxios.post.mockRejectedValueOnce({});

    renderPage();
    await userEvent.selectOptions(screen.getByRole('combobox'), 'recruiter');
    await userEvent.type(screen.getByLabelText(/full name/i), 'Test User');
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'secret123');
    await userEvent.type(getPhoneInput(), '1234567890');
    await userEvent.click(screen.getByRole('button', { name: /signup/i }));

    await waitFor(() => expect(mockedAxios.post).toHaveBeenCalledTimes(1));
  });

  it('uses http (non-secure) cookie when on http', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { token: 'tok', message: 'Registered!', registerUser: mockUser },
    });

    renderPage();
    await userEvent.selectOptions(screen.getByRole('combobox'), 'recruiter');
    await userEvent.type(screen.getByLabelText(/full name/i), 'Test User');
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'secret123');
    await userEvent.type(getPhoneInput(), '1234567890');
    await userEvent.click(screen.getByRole('button', { name: /signup/i }));

    await waitFor(() => expect(mockedAxios.post).toHaveBeenCalledTimes(1));
    expect(mockedCookies.set).toHaveBeenCalledWith(
      'token', 'tok',
      expect.objectContaining({ secure: false })
    );
  });
});
