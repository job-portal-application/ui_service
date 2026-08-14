import reducer, { setUser, clearUser } from '../redux/slices/userSlice';
import type { User } from '../lib/type';

const mockUser: User = {
    user_id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone_number: '1234567890',
    role: 'jobseeker',
    bio: 'A developer',
    resume: 'resume.pdf',
    resume_public_id: 'res_123',
    profile_pic: 'pic.jpg',
    profile_pic_public_id: 'pic_123',
    skills: ['TypeScript', 'React'],
    subscription: 'premium',
};

describe('userSlice', () => {
    it('returns initial state when called with undefined', () => {
        expect(reducer(undefined, { type: '@@INIT' })).toEqual({ user: null });
    });

    it('setUser sets a full user object', () => {
        const state = reducer(undefined, setUser(mockUser));
        expect(state.user).toEqual(mockUser);
    });

    it('setUser with null clears the user', () => {
        const populated = reducer({ user: mockUser }, setUser(null));
        expect(populated.user).toBeNull();
    });

    it('setUser overwrites an existing user', () => {
        const updated: User = { ...mockUser, name: 'Jane Doe', role: 'recruiter' };
        const state = reducer({ user: mockUser }, setUser(updated));
        expect(state.user?.name).toBe('Jane Doe');
        expect(state.user?.role).toBe('recruiter');
    });

    it('clearUser sets user to null', () => {
        const state = reducer({ user: mockUser }, clearUser());
        expect(state.user).toBeNull();
    });

    it('clearUser on already-null state stays null', () => {
        const state = reducer({ user: null }, clearUser());
        expect(state.user).toBeNull();
    });

    it('setUser preserves nullable fields when null', () => {
        const userWithNulls: User = {
            ...mockUser,
            bio: null,
            resume: null,
            resume_public_id: null,
            profile_pic: null,
            profile_pic_public_id: null,
            subscription: null,
        };
        const state = reducer(undefined, setUser(userWithNulls));
        expect(state.user?.bio).toBeNull();
        expect(state.user?.resume).toBeNull();
        expect(state.user?.subscription).toBeNull();
    });

    it('setUser handles recruiter role', () => {
        const recruiter: User = { ...mockUser, role: 'recruiter' };
        const state = reducer(undefined, setUser(recruiter));
        expect(state.user?.role).toBe('recruiter');
    });

    it('setUser handles empty skills array', () => {
        const state = reducer(undefined, setUser({ ...mockUser, skills: [] }));
        expect(state.user?.skills).toEqual([]);
    });

    it('exported setUser action has correct type', () => {
        expect(setUser(mockUser).type).toBe('user/setUser');
    });

    it('exported clearUser action has correct type', () => {
        expect(clearUser().type).toBe('user/clearUser');
    });
});
