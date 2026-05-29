import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from './authTypes';

type RegisterPayload = {
  email: string;
  password: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

const initialState: AuthState = {
  users: [],
  currentUserId: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    registerUser: (state, action: PayloadAction<RegisterPayload>) => {
      const user: User = {
        id: `${Date.now()}-${Math.random()}`,
        email: action.payload.email.trim().toLowerCase(),
        password: action.payload.password,
        createdAt: new Date().toISOString(),
      };
      state.users.push(user);
      state.currentUserId = user.id;
    },
    loginUser: (state, action: PayloadAction<LoginPayload>) => {
      const normalizedEmail = action.payload.email.trim().toLowerCase();
      const existingUser = state.users.find(
        user =>
          user.email === normalizedEmail &&
          user.password === action.payload.password,
      );
      state.currentUserId = existingUser?.id ?? null;
    },
    logoutUser: state => {
      state.currentUserId = null;
    },
  },
});

export const { registerUser, loginUser, logoutUser } = authSlice.actions;

export const selectIsAuthenticated = (state: {
  auth: AuthState;
}): boolean => state.auth.currentUserId != null;

export default authSlice.reducer;
