import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { request } from '@utils/api';
import { getCookie, setCookie, saveTokens, getTokens } from '@utils/cookies.ts';

import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  TAuthResponse,
  TAuthState,
  TLogoutResponse,
  TTokenResponse,
} from '@utils/types';

export type IUserData = Record<string, string | number | FormData | string[]>;

// Функция для синхронизации состояния Redux с cookies при запуске
export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async (_, { dispatch }) => {
    const { accessToken, refreshToken: refreshTokenValue } = getTokens();

    if (accessToken) {
      try {
        // Если у нас есть accessToken, проверяем его валидность запросом пользовательских данных
        const response = await request<TAuthResponse>(
          '/auth/user',
          'GET',
          undefined,
          accessToken
        );
        return {
          user: response.user,
          accessToken,
          refreshToken: refreshTokenValue ?? null, // Преобразуем undefined в null
        };
      } catch (_error) {
        console.log('Token expired or invalid, trying to refresh...');

        // Пробуем обновить токен, если есть refreshToken
        if (refreshTokenValue) {
          try {
            return await dispatch(refreshToken()).unwrap();
          } catch (refreshError) {
            console.error('Failed to refresh token:', refreshError);
            // Если не удалось обновить, очищаем данные авторизации
            localStorage.removeItem('refreshToken');
            setCookie('accessToken', '', { expires: new Date(0) });
            setCookie('refreshToken', '', { expires: new Date(0) });
            return null;
          }
        }
        return null;
      }
    } else if (refreshTokenValue) {
      try {
        // Если нет accessToken, но есть refreshToken, пробуем его использовать
        return await dispatch(refreshToken()).unwrap();
      } catch (error) {
        console.error('Failed to refresh token:', error);
        return null;
      }
    }

    return null;
  }
);

export const fetchUser = createAsyncThunk(
  'auth/getUser',
  async (_, { dispatch, rejectWithValue }) => {
    const token = getCookie('accessToken');
    if (!token) {
      // Пробуем обновить токен, если нет accessToken, но есть refreshToken
      const refreshTokenValue = getCookie('refreshToken');
      if (refreshTokenValue) {
        try {
          await dispatch(refreshToken()).unwrap();
          // После успешного обновления токена пробуем получить данные пользователя
          const newToken = getCookie('accessToken');
          if (newToken) {
            const response = await request<TAuthResponse>(
              '/auth/user',
              'GET',
              undefined,
              newToken
            );
            return response;
          }
        } catch (_error) {
          // Если обновление токена не удалось, возвращаем ошибку
          return rejectWithValue('Failed to refresh token');
        }
      }
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
    saveTokens(response);
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
    saveTokens(response);
    return response;
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  const refreshToken = getCookie('refreshToken') ?? localStorage.getItem('refreshToken');
  const response = await request<TLogoutResponse>(
    '/auth/logout',
    'POST',
    JSON.stringify({ token: refreshToken })
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
    saveTokens(response);
    return response;
  }
);

export const refreshToken = createAsyncThunk(
  '/auth/token',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      // Пробуем получить refreshToken из cookie или localStorage
      const refreshTokenValue =
        getCookie('refreshToken') ?? localStorage.getItem('refreshToken');
      if (!refreshTokenValue) return rejectWithValue('no refresh token');

      const response = await request<TTokenResponse>(
        '/auth/token',
        'POST',
        JSON.stringify({ token: refreshTokenValue })
      );

      // Сохраняем новые токены
      saveTokens(response);

      // После обновления токена пробуем получить данные пользователя
      try {
        const userResponse = await request<TAuthResponse>(
          '/auth/user',
          'GET',
          undefined,
          response.accessToken
        );

        return {
          accessToken: response.accessToken.replace(/^Bearer\s+/i, '').trim(),
          refreshToken: response.refreshToken,
          user: userResponse.user,
        };
      } catch (_userError) {
        // Если не удалось получить пользователя, возвращаем только токены
        return {
          accessToken: response.accessToken.replace(/^Bearer\s+/i, '').trim(),
          refreshToken: response.refreshToken,
          user: null,
        };
      }
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
      .addCase(initializeAuth.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(initializeAuth.fulfilled, (s, { payload }) => {
        s.loading = false;
        if (payload) {
          s.user = payload.user;
          s.accessToken = payload.accessToken;
          s.refreshToken = payload.refreshToken;
        }
        s.authChecked = true;
      })
      .addCase(initializeAuth.rejected, (s) => {
        s.loading = false;
        s.authChecked = true;
      })
      .addCase(fetchUser.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchUser.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.user = payload.user;
        // Также сохраняем токены, если они присутствуют в ответе
        if (payload.accessToken) {
          s.accessToken = payload.accessToken;
        }
        if (payload.refreshToken) {
          s.refreshToken = payload.refreshToken;
        }
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
        setCookie('accessToken', '', { expires: new Date(0) });
        setCookie('refreshToken', '', { expires: new Date(0) });
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
