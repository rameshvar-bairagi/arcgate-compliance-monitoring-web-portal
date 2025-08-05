import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserResponse } from '@/types/user';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  userProfile: UserResponse | null;
}

const initialState: AuthState = {
  isAuthenticated: false, // Don't initialize from localStorage
  token: null,
  userProfile: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ token: string; }>) {
      state.isAuthenticated = true;
      state.token = action.payload.token;

      if (typeof window !== 'undefined') {
        localStorage.setItem('token', action.payload.token);
      }
    },
    logout(state) {
      state.isAuthenticated = false;
      state.token = null;
      localStorage.removeItem('token');
    },
    setUserProfile(state, action: PayloadAction<UserResponse>) {
      state.userProfile = action.payload;
    },
  },
});

export const { login, logout, setUserProfile } = authSlice.actions;
export default authSlice.reducer;