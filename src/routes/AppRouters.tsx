import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Loader from '@/components/Loader';

const Homepage = lazy(() => import('../pages/Homepage'));
const Aboutpage = lazy(() => import('../pages/AboutPage'));
const Signinpage = lazy(() => import('../pages/Authentication/SIgninPage'));
const Signuppage = lazy(() => import('../pages/Authentication/SignupPage'));
const AccountPage = lazy(() => import('../pages/AccountPage'));
const UserAccountPage = lazy(() => import('../pages/id/UserAccountPage'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/about' element={<Aboutpage />} />
        <Route path='/auth/signin' element={<Signinpage />} />
        <Route path='/auth/signup' element={<Signuppage />} />
          <Route path='/account' element={<AccountPage />} />
          <Route path='/account/:id' element={<UserAccountPage />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes;
