import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { request } from '@utils/api';
import { getCookie } from '@utils/cookies.ts';

import type {
  TAuthResponse,
  TAuthState,
  TLogoutResponse,
  TTokenResponse,
} from '@utils/types';

export type IUserData = Record<string, string | number | FormData | string[]>;

export const fetchUser = createAsyncThunk('auth/getUser', async () => {
  const token = getCookie('accessToken');
  if (!token) throw new Error('Access token is missing');

  return await request<TAuthResponse>('/auth/user', 'GET', undefined, token);
});

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (data: IUserData) => {
    const token = getCookie('accessToken');
    if (!token) throw new Error('Access token is missing');

    return await request<TAuthResponse>(
      '/auth/user',
      'PATCH',
      JSON.stringify(data),
      token
    );
  }
);
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    const response = await request<TAuthResponse>(
      '/auth/login',
      'POST',
      JSON.stringify({ email, password })
    );
    return response;
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  const response = await request<TLogoutResponse>(
    '/auth/logout',
    'POST',
    JSON.stringify({ token: localStorage.getItem('refreshToken') })
  );
  return response;
});

export const registerUser = createAsyncThunk(
  '/auth/register',
  async ({
    email,
    password,
    name,
  }: {
    email: string;
    password: string;
    name: string;
  }) => {
    const response = await request<TAuthResponse>(
      '/auth/register',
      'POST',
      JSON.stringify({ email, password, name })
    );
    return response;
  }
);

export const refreshToken = createAsyncThunk('auth/token', async () => {
  const response = await request<TTokenResponse>(
    'auth/token',
    'POST',
    JSON.stringify({ token: localStorage.getItem('refreshToken') })
  );
  return response;
});

const initialState: TAuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(fetchUser.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchUser.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.user = payload.user;
      })
      .addCase(fetchUser.rejected, (s, { error }) => {
        s.loading = false;
        s.error = error.message ?? 'Не удалось загрузить профиль';
      })
      .addCase(updateUser.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(updateUser.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.user = payload.user;
      })
      .addCase(updateUser.rejected, (s, { error }) => {
        s.loading = false;
        s.error = error.message ?? 'Не удалось обновить профиль';
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.user = payload.user;
        state.accessToken = payload.accessToken;
        state.loading = false;
        state.refreshToken = payload.refreshToken;
        localStorage.setItem('refreshToken', payload.refreshToken);
      })
      .addCase(loginUser.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message ?? 'Ошибка';
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.user;
        state.accessToken = payload.accessToken;
        state.refreshToken = payload.refreshToken;
        localStorage.setItem('refreshToken', payload.refreshToken);
      })
      .addCase(registerUser.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message ?? 'Ошибка';
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        localStorage.removeItem('refreshToken');
      })
      .addCase(logoutUser.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message ?? 'Ошибка';
      })
      .addCase(refreshToken.fulfilled, (state, { payload }) => {
        state.accessToken = payload.accessToken;
        state.refreshToken = payload.refreshToken;
        localStorage.setItem('refreshToken', payload.refreshToken);
      })
      .addCase(refreshToken.rejected, (state, { error }) => {
        state.error = error.message ?? 'Не удалось обновить токен';
      }),
});

export default authSlice.reducer;
