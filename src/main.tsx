import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux';
import Cookies from 'js-cookie';
import { store } from './redux/store.ts'
import { setIsAuth, setUser } from './redux/slices/authSlice';
import './index.css'
import App from './App.tsx'

const token = Cookies.get('token');

if (token) {
  store.dispatch(setIsAuth(true));
} else {
  store.dispatch(setUser(null));
  store.dispatch(setIsAuth(false));
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
      <App />
    </BrowserRouter>
    </Provider>
  </StrictMode>,
)
