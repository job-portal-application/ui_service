import { type FormEvent, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { setUser as setAuthUser, setIsAuth, setLoading, setBtnLoading } from '../../redux/slices/authSlice';
import { setUser as setUserData } from '../../redux/slices/userSlice';
import { env } from '../../config/env';
import Cookies from 'js-cookie';
import { Label } from '../../../@/components/ui/label';
import { Button } from '../../../@/components/ui/button';
import { Input } from '../../../@/components/ui/input';
import { Mail, Lock, ArrowRight } from 'lucide-react';

const USER_STORAGE_KEY = 'hireheaven_user';

const SIgninPage = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const dispatch = useAppDispatch();
  const { isAuth, btnLoading } = useAppSelector((state) => state.auth);

  if (isAuth) return <Navigate to="/" replace />;

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch(setLoading(true));
    dispatch(setBtnLoading(true));

    try {
      const baseUrl = (env.authServiceBaseUrl || '').replace(/\/$/, '');
      const { data } = await axios.post(
        `${baseUrl}/api/v1/auth/login`,
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          withCredentials: true,
        }
      );
      const token = data.token;
      Cookies.set('token', token, {
        expires: 15,
        secure: window.location.protocol === 'https:',
        sameSite: 'lax',
        path: "/"
      });
      toast.success(data.message);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
      dispatch(setAuthUser(data.user));
      dispatch(setUserData(data.user));
      dispatch(setIsAuth(true));
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'Unable to sign in';
      toast.error(message);
      dispatch(setAuthUser(null));
      dispatch(setUserData(null));
      dispatch(setIsAuth(false));
    } finally {
      dispatch(setLoading(false));
      dispatch(setBtnLoading(false));
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center px-4 py-12'>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className='text-4xl font-bold mb-2'>Welcome to HireHeaven</h1>
          <p className="text-sm opacity-70">Signin to continue your journey</p>
        </div>
        <div className="border border-gray-400 rounded-2xl p-8 shadow-lg backdrop-blur-sm">
          <form onSubmit={submitHandler} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className='text-sm font-medium'>Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className='pl-10 h-11' />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className='text-sm font-medium'>Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <Input id="password" type="password" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} required className='pl-10 h-11' />
              </div>
            </div>
            <div className="flex items-center justify-start">
              <Link to="/forgot" className='text-sm text-blue-500 hover-inderline transition-all'>Forgot password</Link>
            </div>
            <Button type="submit" disabled={btnLoading} className="w-full">
              {btnLoading ? 'Logging in...' : 'Login'}
              <ArrowRight size={18} />
            </Button>
          </form>
          <div className="mt-6 pt-6 border-t border-gray-400">
            <p className="text-center text-sm">
              Don't have an account?
              <Link to="/auth/signup" className='text-blue-500 font-medium hover-inderline transition-all ml-1'>Register</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SIgninPage;
