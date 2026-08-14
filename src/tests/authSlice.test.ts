import authReducer, {
  setUser,
  setLoading,
  setBtnLoading,
  setIsAuth,
  logout,
} from '../redux/slices/authSlice';

describe('authSlice', () => {
  it('updates auth state and clears user on logout', () => {
    const state = authReducer(undefined, setUser({
      user_id: 1,
      name: 'Test User',
      email: 'test@example.com',
      phone_number: '1234567890',
      role: 'jobseeker',
      bio: null,
      resume: null,
      resume_public_id: null,
      profile_pic: null,
      profile_pic_public_id: null,
      skills: [],
      subscription: null,
    }));

    const updated = authReducer(state, setIsAuth(true));
    expect(updated.user?.email).toBe('test@example.com');
    expect(updated.isAuth).toBe(true);

    const loadingState = authReducer(updated, setLoading(true));
    expect(loadingState.loading).toBe(true);

    const btnLoadingState = authReducer(loadingState, setBtnLoading(true));
    expect(btnLoadingState.btnLoading).toBe(true);

    const loggedOut = authReducer(btnLoadingState, logout());
    expect(loggedOut.user).toBeNull();
    expect(loggedOut.isAuth).toBe(false);
  });
});
