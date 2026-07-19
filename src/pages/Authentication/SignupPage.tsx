import { type FormEvent, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { setUser, setIsAuth, setLoading, setBtnLoading } from '../../redux/slices/authSlice';
import { setUser as setUserData } from '../../redux/slices/userSlice';
import { env } from '../../config/env';
import Cookies from 'js-cookie';
import { Label } from '../../../@/components/ui/label';
import { Button } from '../../../@/components/ui/button';
import { Input } from '../../../@/components/ui/input';
import { Mail, Lock, ArrowRight, Briefcase, Phone, File, SortDescIcon } from 'lucide-react';

const USER_STORAGE_KEY = 'hireheaven_user';

const SignupPage = () => {
  const [name, setName] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [resume, setResume] = useState<File | null>(null);
  const dispatch = useAppDispatch();
  const { isAuth, btnLoading } = useAppSelector((state) => state.auth);

  if (isAuth) return <Navigate to="/" replace />;

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch(setLoading(true));
    dispatch(setBtnLoading(true));

    const formData = new FormData();
    formData.append('name', name);
    formData.append('role', role);
    formData.append('phoneNumber', phoneNumber);
    formData.append('email', email);
    formData.append('password', password);

    if(role === "jobseeker") {
      formData.append('bio', bio);
      if(resume) {
        formData.append('resume', resume);
      }
    }

    try {
      const baseUrl = (env.authServiceBaseUrl || '').replace(/\/$/, '');
      const { data } = await axios.post(
        `${baseUrl}/api/v1/auth/register`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
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
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.registerUser));
      dispatch(setUser(data.registerUser));
      dispatch(setUserData(data.registerUser));
      dispatch(setIsAuth(true));
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'Unable to sign in';
      toast.error(message);
      dispatch(setUser(null));
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
          <h1 className='text-4xl font-bold mb-2'>Join HireHeaven</h1>
          <p className="text-sm opacity-70">Create account to start your journey</p>
        </div>
        <div className="border border-gray-400 rounded-2xl p-8 shadow-lg backdrop-blur-sm">
          <form onSubmit={submitHandler} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className='text-sm font-medium'>I want to</Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <select id="role" value={role} onChange={(e) => setRole(e.target.value)} className='w-full h-ll pl-10 pr-4 border-2 border-gray-300 rounded-md bg-transparent' required>
                  <option value="">Select Role</option>
                  <option value="jobseeker">Find job</option>
                  <option value="recruiter">Hire talent</option>
                </select>
              </div>
            </div>
            {
              role && (
                <div className="space-y-5 animate-in fade-in duration-300">
                  <div className="space-y-2">
                    <Label htmlFor="name" className='text-sm font-medium'>Full name</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <Input id="name" type="text" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} required className='pl-10 h-11' />
                    </div>
                  </div>
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
                  <div className="space-y-2">
                    <Label htmlFor="Mobile number" className='text-sm font-medium'>Mobile number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <Input id="phoneNumber" type="text" placeholder="Enter mobile number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required className='pl-10 h-11' />
                    </div>
                  </div>
                  {
                    role === "jobseeker" && (
                      <div className="space-y-5 pt-4 border-t border-gray-400">
                        <div className="space-y-2">
                          <Label htmlFor="Resume" className='text-sm font-medium'>Resume</Label>
                          <div className="relative">
                            <File className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            <Input id="resume" type="file" accept='application/pdf' onChange={(e) => {
                              if(e.target.files && e.target.files[0]) {
                                setResume(e.target.files[0]);
                              }
                            }} required className='pl-10 h-11' />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bio" className='text-sm font-medium'>Description</Label>
                          <div className="relative">
                            <SortDescIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            <Input id="phoneNumber" type="text" placeholder="Mention about yourself" value={bio} onChange={(e) => setBio(e.target.value)} required className='pl-10 h-11' />
                          </div>
                        </div>
                      </div>
                    )
                  }
                  <Button type="submit" disabled={btnLoading} className="w-full">
                    {btnLoading ? 'Signing up...' : 'Signup'}
                    <ArrowRight size={18} />
                  </Button>
                </div>
              )
            }
          </form>
          <div className="mt-6 pt-6 border-t border-gray-400">
            <p className="text-center text-sm">
              Already have an account?
              <Link to="/auth/signin" className='text-blue-500 font-medium hover-inderline transition-all ml-1'>Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
