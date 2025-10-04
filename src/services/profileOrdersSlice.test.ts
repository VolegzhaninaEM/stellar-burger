import { configureStore } from '@reduxjs/toolkit';

import profileOrdersReducer, {
  profileOrdersConnect,
  profileOrdersConnected,
  profileOrdersDisconnected,
  profileOrdersError,
  profileOrdersMessage,
  clearProfileOrders,
  selectProfileOrders,
  selectProfileOrdersIsConnected,
  selectProfileOrdersError,
} from './profileOrdersSlice';

import type { TOrder } from '../utils/types';
import type { ProfileOrdersState, ProfileOrdersData } from './profileOrdersSlice';

// Типы для корневого состояния
type RootState = {
  profileOrders: ProfileOrdersState;
};

describe('profileOrdersSlice', () => {
  let store: ReturnType<typeof configureStore<RootState>>;

  const mockOrder: TOrder = {
    _id: '1',
    ingredients: ['ingredient1', 'ingredient2'],
    status: 'done',
    name: 'Test Burger',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
    number: 12345,
  };

  const mockProfileOrdersData: ProfileOrdersData = {
    orders: [mockOrder],
    total: 100,
    totalToday: 5,
  };

  beforeEach(() => {
    store = configureStore({
      reducer: {
        profileOrders: profileOrdersReducer,
      },
    });
  });

  describe('initial state', () => {
    it('should return initial state', () => {
      const state = store.getState().profileOrders;
      expect(state).toEqual({
        orders: [],
        isConnected: false,
        error: null,
      });
    });
  });

  describe('actions', () => {
    it('should handle profileOrdersConnect', () => {
      const connectPayload = { url: 'ws://test.com', token: 'test-token' };
      store.dispatch(profileOrdersConnect(connectPayload));

      const state = store.getState().profileOrders;
      expect(state.isConnected).toBe(false);
      expect(state.error).toBe(null);
    });

    it('should handle profileOrdersConnected', () => {
      store.dispatch(profileOrdersConnected());

      const state = store.getState().profileOrders;
      expect(state.isConnected).toBe(true);
      expect(state.error).toBe(null);
    });

    it('should handle profileOrdersDisconnected', () => {
      store.dispatch(profileOrdersConnected());
      expect(store.getState().profileOrders.isConnected).toBe(true);

      store.dispatch(profileOrdersDisconnected());

      const state = store.getState().profileOrders;
      expect(state.isConnected).toBe(false);
    });

    it('should handle profileOrdersError', () => {
      const errorMessage = 'Connection failed';
      store.dispatch(profileOrdersError(errorMessage));

      const state = store.getState().profileOrders;
      expect(state.error).toBe(errorMessage);
      expect(state.isConnected).toBe(false);
    });

    it('should handle profileOrdersMessage', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      store.dispatch(profileOrdersMessage(mockProfileOrdersData));

      const state = store.getState().profileOrders;
      expect(state.orders).toEqual([mockOrder]);
      expect(state.error).toBe(null);

      consoleSpy.mockRestore();
    });

    it('should handle clearProfileOrders', () => {
      // Сначала добавляем данные
      store.dispatch(profileOrdersConnected());
      store.dispatch(profileOrdersMessage(mockProfileOrdersData));
      store.dispatch(profileOrdersError('Some error'));

      let state = store.getState().profileOrders;
      expect(state.orders).toHaveLength(1);
      expect(state.isConnected).toBe(false); // Изменено: после ошибки соединение разрывается
      expect(state.error).toBe('Some error');

      // Очищаем
      store.dispatch(clearProfileOrders());

      state = store.getState().profileOrders;
      expect(state.orders).toEqual([]);
      expect(state.isConnected).toBe(false);
      expect(state.error).toBe(null);
    });
  });

  describe('selectors', () => {
    beforeEach(() => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      store.dispatch(profileOrdersMessage(mockProfileOrdersData));
      store.dispatch(profileOrdersConnected());
      consoleSpy.mockRestore();
    });

    it('should select profile orders', () => {
      const state = store.getState();
      const orders = selectProfileOrders(state);
      expect(orders).toEqual([mockOrder]);
    });

    it('should select profile orders connection status', () => {
      const state = store.getState();
      const isConnected = selectProfileOrdersIsConnected(state);
      expect(isConnected).toBe(true);
    });

    it('should select profile orders error', () => {
      store.dispatch(profileOrdersError('Test error'));

      const state = store.getState();
      const error = selectProfileOrdersError(state);
      expect(error).toBe('Test error');
    });

    it('should select null error when no error', () => {
      const state = store.getState();
      const error = selectProfileOrdersError(state);
      expect(error).toBe(null);
    });
  });
});
