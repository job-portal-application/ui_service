import './App.css'
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import AppRoutes from './routes/AppRouters';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { useEffect, useState } from 'react';
import Loader from './components/Loader';
import { useNavigate } from 'react-router-dom';
import { hideLoader, showLoader } from './redux/slices/loaderSlice';
import PageWrapper from './components/PageWrapper';

function App() {
  const dispatch = useAppDispatch();
  const location = useNavigate();
  const loading = useAppSelector((state: any) => state.loader.loading);
  const [initialLoading, setInitialLoading] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 30000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    dispatch(showLoader("full"));
    const timer = setTimeout(() => dispatch(hideLoader()), 1500);
    return () => clearTimeout(timer);
  }, [dispatch]);

  // Navigation loader
  useEffect(() => {
    dispatch(showLoader("content"));
    const timer = setTimeout(() => dispatch(hideLoader()), 800);
    return () => clearTimeout(timer);
  }, [location]);

  if (initialLoading) return <Loader />;

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Toaster position="top-center" reverseOrder={false} />
          <div className="content">
            <Navbar />
            <PageWrapper>
              <AppRoutes />
            </PageWrapper>
            <Footer />
          </div>
    </ThemeProvider>
  )
}

export default App;
