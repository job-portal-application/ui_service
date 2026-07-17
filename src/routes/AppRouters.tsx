import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const Homepage = lazy(() => import('../pages/Homepage'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path='/' element={<Homepage />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes;
