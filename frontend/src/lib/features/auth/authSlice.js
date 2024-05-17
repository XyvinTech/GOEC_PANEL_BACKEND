// features/auth/authSlice.js
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AppThunk } from '@/lib/store';
// Assuming you have an API utility to handle authentication requests
import { loginUser, logoutUser } from './authAPI';

export interface AuthState {
  user: any; // Define the User type according to your data structure
  token: string | null;
  status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  status: 'idle',
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.status = 'loading';
    },
    loginSuccess: (
      state,
      action: PayloadAction<{ user: any, token: string }>
    ) => {
      state.status = 'authenticated';
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },
    loginFailed: (state, action: PayloadAction<string>) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    logout: (state) => {
      state.status = 'unauthenticated';
      state.user = null;
      state.token = null;
      state.error = null;
    },
  },
  // Optionally, you can add extraReducers to handle asynchronous thunk actions
  extraReducers: (builder) => {
    // Add cases for asynchronous actions here
  },
});

// Export actions
export const { loginStart, loginSuccess, loginFailed, logout } =
  authSlice.actions;

// Define a thunk for logging in
export const login =
  (credentials: { email: string, password: string }): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(loginStart());
      const { user, token } = await loginUser(credentials);
      dispatch(loginSuccess({ user, token }));
      // Set token in localStorage or cookies if needed
    } catch (error) {
      dispatch(loginFailed(error.toString()));
    }
  };

// Define a thunk for logging out
export const performLogout = (): AppThunk => async (dispatch) => {
  await logoutUser(); // If your backend requires a logout request
  dispatch(logout());
  // Remove token from localStorage or cookies
};

// Export the reducer
export default authSlice.reducer;
