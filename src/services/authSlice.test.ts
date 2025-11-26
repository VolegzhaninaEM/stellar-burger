import { configureStore } from '@reduxjs/toolkit';

import authReducer, {
  loginUser,
  logoutUser,
  setAuthChecked,
  registerUser,
  updateUser,
  fetchUser,
  refreshToken,
  initializeAuth,
} from './authSlice';

import type { TUser, TAuthState } from '../utils/types';

// Мокируем зависимости
jest.mock('../utils/api');
jest.mock('../utils/cookies.ts');

// Импортируем замоканные модули
import * as apiModule from '../utils/api';
import * as cookiesModule from '../utils/cookies.ts';

// Типизированные моки
const mockRequest = apiModule.request as jest.MockedFunction<typeof apiModule.request>;
const mockGetCookie = cookiesModule.getCookie as jest.MockedFunction<
  typeof cookiesModule.getCookie
>;
const mockGetTokens = cookiesModule.getTokens as jest.MockedFunction<
  typeof cookiesModule.getTokens
>;

// Типы для корневого состояния
type RootState = {
  auth: TAuthState;
};

describe('authSlice', () => {
  let store: ReturnType<typeof configureStore<RootState>>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
    });
    jest.clearAllMocks();
  });

  // Тест начального состояния
  describe('initial state', () => {
    it('should return initial state', () => {
      const state = store.getState().auth;
      expect(state).toEqual({
        user: null,
        accessToken: null,
        refreshToken: null,
        loading: false,
        error: null,
        authChecked: false,
      });
    });
  });

  // Тесты синхронных действий
  describe('sync actions', () => {
    it('should handle setAuthChecked', () => {
      store.dispatch(setAuthChecked(true));
      const state = store.getState().auth;
      expect(state.authChecked).toBe(true);
    });
  });

  // Тесты асинхронных действий
  describe('async actions', () => {
    const mockUser: TUser = {
      email: 'test@example.com',
      name: 'Test User',
    };

    const mockAuthResponse = {
      user: mockUser,
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
    };

    describe('loginUser', () => {
      it('should handle pending state', () => {
        // Мокируем успешный ответ, чтобы избежать ошибки при завершении промиса
        mockRequest.mockResolvedValue(mockAuthResponse);

        const promise = store.dispatch(
          loginUser({ email: 'test@test.com', password: 'password' })
        );

        // Проверяем состояние loading сразу после dispatch
        const pendingState = store.getState().auth;
        expect(pendingState.loading).toBe(true);
        expect(pendingState.error).toBe(null);

        // Возвращаем промис для корректного завершения теста
        return promise;
      });

      it('should handle fulfilled state', async () => {
        mockRequest.mockResolvedValue(mockAuthResponse);

        await store.dispatch(
          loginUser({ email: 'test@test.com', password: 'password' })
        );
        const state = store.getState().auth;
        expect(state.loading).toBe(false);
        expect(state.user).toEqual(mockUser);
        expect(state.accessToken).toBe('mock-access-token');
        expect(state.refreshToken).toBe('mock-refresh-token');
      });

      it('should handle rejected state', async () => {
        const errorMessage = 'Login failed';
        mockRequest.mockRejectedValue(new Error(errorMessage));

        await store.dispatch(
          loginUser({ email: 'test@test.com', password: 'password' })
        );
        const state = store.getState().auth;
        expect(state.loading).toBe(false);
        expect(state.error).toBe(errorMessage);
      });
    });

    describe('registerUser', () => {
      it('should handle fulfilled state', async () => {
        mockRequest.mockResolvedValue(mockAuthResponse);

        await store.dispatch(
          registerUser({
            email: 'test@test.com',
            password: 'password',
            name: 'Test User',
          })
        );
        const state = store.getState().auth;
        expect(state.loading).toBe(false);
        expect(state.user).toEqual(mockUser);
        expect(state.accessToken).toBe('mock-access-token');
        expect(state.refreshToken).toBe('mock-refresh-token');
      });
    });

    describe('updateUser', () => {
      it('should handle fulfilled state', async () => {
        mockGetCookie.mockReturnValue('valid-token');
        mockRequest.mockResolvedValue(mockAuthResponse);

        await store.dispatch(updateUser({ name: 'Updated Name' }));
        const state = store.getState().auth;
        expect(state.loading).toBe(false);
        expect(state.user).toEqual(mockUser);
      });
    });

    describe('fetchUser', () => {
      it('should handle fulfilled state', async () => {
        mockGetCookie.mockReturnValue('valid-token');
        mockRequest.mockResolvedValue(mockAuthResponse);

        await store.dispatch(fetchUser());
        const state = store.getState().auth;
        expect(state.loading).toBe(false);
        expect(state.user).toEqual(mockUser);
        expect(state.authChecked).toBe(true);
      });
    });

    describe('logoutUser', () => {
      it('should handle fulfilled state', async () => {
        mockRequest.mockResolvedValue({ message: 'Logout successful' });

        await store.dispatch(logoutUser());
        const state = store.getState().auth;
        expect(state.authChecked).toBe(true);
        expect(state.user).toBe(null);
        expect(state.accessToken).toBe(null);
        expect(state.refreshToken).toBe(null);
      });
    });

    describe('refreshToken', () => {
      it('should handle fulfilled state', async () => {
        mockGetCookie.mockReturnValue('valid-refresh-token');
        const mockTokenResponse = {
          accessToken: 'Bearer new-access-token',
          refreshToken: 'new-refresh-token',
        };
        mockRequest
          .mockResolvedValueOnce(mockTokenResponse)
          .mockResolvedValueOnce(mockAuthResponse);

        await store.dispatch(refreshToken());
        const state = store.getState().auth;
        expect(state.authChecked).toBe(true);
        expect(state.accessToken).toBe('new-access-token');
        expect(state.refreshToken).toBe('new-refresh-token');
      });
    });

    describe('initializeAuth', () => {
      it('should handle fulfilled state with valid token', async () => {
        mockGetTokens.mockReturnValue({
          accessToken: 'valid-token',
          refreshToken: 'valid-refresh-token',
        });
        mockRequest.mockResolvedValue(mockAuthResponse);

        await store.dispatch(initializeAuth());
        const state = store.getState().auth;
        expect(state.loading).toBe(false);
        expect(state.authChecked).toBe(true);
        expect(state.user).toEqual(mockUser);
      });
    });
  });
});
