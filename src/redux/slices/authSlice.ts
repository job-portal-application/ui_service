import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from '../../lib/type';

export const USER_STORAGE_KEY = 'hireheaven_user';

const getStoredUser = (): User | null => {
    try {
        const stored = localStorage.getItem(USER_STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch {
        return null;
    }
};

interface AuthState {
    user: User | null;
    loading: boolean;
    btnLoading: boolean;
    isAuth: boolean;
}

const storedUser = getStoredUser();

const initialState: AuthState = {
    user: storedUser,
    loading: false,
    btnLoading: false,
    isAuth: !!storedUser,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<User | null>) {
            state.user = action.payload;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setBtnLoading(state, action: PayloadAction<boolean>) {
            state.btnLoading = action.payload;
        },
        setIsAuth(state, action: PayloadAction<boolean>) {
            state.isAuth = action.payload;
        },
        logout(state) {
            state.user = null;
            state.isAuth = false;
            state.loading = false;
            state.btnLoading = false;
        }
    }
});

export const {
    setUser,
    setLoading,
    setBtnLoading,
    setIsAuth,
    logout
} = authSlice.actions;

export default authSlice.reducer;