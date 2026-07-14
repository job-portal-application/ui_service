import './App.css'
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Routers from './routes/Routers';
import { ThemeProvider } from './components/ThemeProvider';

function App() {

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="content">
        <Navbar />
        <Routers />
        <Footer />
      </div>
    </ThemeProvider>
  )
}

export default App
