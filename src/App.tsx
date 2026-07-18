import './App.css'
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import AppRoutes from './routes/AppRouters';
import { ThemeProvider } from './components/ThemeProvider';

function App() {

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="content">
        <Navbar />
        <AppRoutes />
        <Footer />
      </div>
    </ThemeProvider>
  )
}

export default App
