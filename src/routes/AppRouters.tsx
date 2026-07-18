import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const Homepage = lazy(() => import('../pages/Homepage'));
const Aboutpage = lazy(() => import('../pages/AboutPage'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/about' element={<Aboutpage />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes;
