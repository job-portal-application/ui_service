import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import loaderReducer from './slices/loaderSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        loader: loaderReducer,
    }
});

export type Rootstate = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;