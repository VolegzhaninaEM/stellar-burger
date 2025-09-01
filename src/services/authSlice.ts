import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { request } from '@utils/api';
import { getCookie, setCookie } from '@utils/cookies.ts';

import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  TAuthResponse,
  TAuthState,
  TLogoutResponse,
  TTokenResponse,
} from '@utils/types';

export type IUserData = Record<string, string | number | FormData | string[]>;

export const fetchUser = createAsyncThunk(
  'auth/getUser',
  async (_, { dispatch, rejectWithValue }) => {
    const token = getCookie('accessToken');
    if (!token) {
      return rejectWithValue('Access token is missing');
    }

    try {
      const response = await request<TAuthResponse>(
        '/auth/user',
        'GET',
        undefined,
        token
      );
      return response;
    } catch (error: unknown) {
      const getErrorMessage = (err: unknown): string => {
        if (err && typeof err === 'object' && 'message' in err) {
          return (err as { message?: string }).message ?? '';
        }
        return String(err);
      };

      const message = getErrorMessage(error);

      if (message.includes('401') || message.includes('jwt expired')) {
        try {
          await dispatch(refreshToken()).unwrap();

          const newToken = getCookie('accessToken');
          if (!newToken) {
            return rejectWithValue('No new access token after refresh');
          }

          const response = await request<TAuthResponse>(
            '/auth/user',
            'GET',
            undefined,
            newToken
          );
          return response;
        } catch (_refreshError) {
          await dispatch(logoutUser());
          return rejectWithValue('Refresh failed');
        }
      }

      return rejectWithValue(message || 'Failed to fetch user');
    }
  }
);

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (data: IUserData) => {
    const token = getCookie('accessToken');
    if (!token) throw new Error('Access token is missing');
    const response = await request<TAuthResponse>(
      '/auth/user',
      'PATCH',
      JSON.stringify(data),
      token
    );
    setCookie('accessToken', response.accessToken);
    setCookie('refreshToken', response.refreshToken);

    return response;
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
    setCookie('accessToken', response.accessToken);
    setCookie('refreshToken', response.refreshToken);
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

export const refreshToken = createAsyncThunk(
  '/auth/token',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const refreshToken = getCookie('refreshToken');
      if (!refreshToken) return rejectWithValue('no refresh token');
      const response = await request<TTokenResponse>(
        '/auth/token',
        'POST',
        JSON.stringify({ token: localStorage.getItem('refreshToken') })
      );
      const cleanAccessToken = response.accessToken.replace(/^Bearer\s+/i, '').trim();
      const cleanRefreshToken = response.refreshToken;

      setCookie('accessToken', cleanAccessToken);
      setCookie('refreshToken', cleanRefreshToken);
      localStorage.setItem('refreshToken', cleanRefreshToken);

      await dispatch(fetchUser()).unwrap();
      return {
        accessToken: cleanAccessToken,
        refreshToken: cleanRefreshToken,
      };
    } catch (_error) {
      await dispatch(logoutUser());
      return rejectWithValue('Refresh failed');
    }
  }
);

const initialState: TAuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  loading: false,
  error: null,
  authChecked: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.authChecked = action.payload;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(fetchUser.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchUser.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.user = payload.user;
        s.authChecked = true;
      })
      .addCase(fetchUser.rejected, (s, { error }) => {
        s.loading = false;
        s.authChecked = true;
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
        state.authChecked = true;
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
        state.authChecked = true;
        state.accessToken = payload.accessToken;
        state.refreshToken = payload.refreshToken;
        localStorage.setItem('refreshToken', payload.refreshToken);
      })
      .addCase(refreshToken.rejected, (state, { error }) => {
        state.authChecked = true;
        state.error = error.message ?? 'Не удалось обновить токен';
      }),
});

export const { setAuthChecked } = authSlice.actions;
export default authSlice.reducer;
