import { configureStore } from '@reduxjs/toolkit';

import feedReducer, {
  feedConnect,
  feedConnected,
  feedDisconnected,
  feedError,
  feedMessage,
  feedDisconnect,
  selectFeedOrders,
  selectFeedTotal,
  selectFeedTotalToday,
  selectFeedIsConnected,
  selectFeedError,
} from './feedSlice';

import type { TOrder } from '../utils/types';
import type { FeedState, FeedData } from './feedSlice';

// Типы для корневого состояния
type RootState = {
  feed: FeedState;
};

describe('feedSlice', () => {
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

  const mockFeedData: FeedData = {
    orders: [mockOrder],
    total: 1000,
    totalToday: 50,
  };

  beforeEach(() => {
    store = configureStore({
      reducer: {
        feed: feedReducer,
      },
    });
  });

  describe('initial state', () => {
    it('should return initial state', () => {
      const state = store.getState().feed;
      expect(state).toEqual({
        orders: [],
        total: 0,
        totalToday: 0,
        isConnected: false,
        error: null,
      });
    });
  });

  describe('actions', () => {
    it('should handle feedConnect', () => {
      const connectPayload = { url: 'ws://test.com', token: 'test-token' };
      store.dispatch(feedConnect(connectPayload));

      const state = store.getState().feed;
      expect(state.isConnected).toBe(false);
      expect(state.error).toBe(null);
    });

    it('should handle feedConnected', () => {
      store.dispatch(feedConnected());

      const state = store.getState().feed;
      expect(state.isConnected).toBe(true);
      expect(state.error).toBe(null);
    });

    it('should handle feedDisconnected', () => {
      store.dispatch(feedConnected());
      expect(store.getState().feed.isConnected).toBe(true);

      store.dispatch(feedDisconnected());

      const state = store.getState().feed;
      expect(state.isConnected).toBe(false);
    });

    it('should handle feedError', () => {
      const errorMessage = 'Connection failed';
      store.dispatch(feedError(errorMessage));

      const state = store.getState().feed;
      expect(state.error).toBe(errorMessage);
      expect(state.isConnected).toBe(false);
    });

    it('should handle feedMessage', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      store.dispatch(feedMessage(mockFeedData));

      const state = store.getState().feed;
      expect(state.orders).toEqual([mockOrder]);
      expect(state.total).toBe(1000);
      expect(state.totalToday).toBe(50);
      expect(state.error).toBe(null);

      consoleSpy.mockRestore();
    });

    it('should handle feedDisconnect', () => {
      store.dispatch(feedConnected());
      expect(store.getState().feed.isConnected).toBe(true);

      store.dispatch(feedDisconnect());

      const state = store.getState().feed;
      expect(state.isConnected).toBe(false);
    });
  });

  describe('selectors', () => {
    beforeEach(() => {
      store.dispatch(feedMessage(mockFeedData));
      store.dispatch(feedConnected());
    });

    it('should select feed orders', () => {
      const state = store.getState();
      const orders = selectFeedOrders(state);
      expect(orders).toEqual([mockOrder]);
    });

    it('should select feed total', () => {
      const state = store.getState();
      const total = selectFeedTotal(state);
      expect(total).toBe(1000);
    });

    it('should select feed total today', () => {
      const state = store.getState();
      const totalToday = selectFeedTotalToday(state);
      expect(totalToday).toBe(50);
    });

    it('should select feed connection status', () => {
      const state = store.getState();
      const isConnected = selectFeedIsConnected(state);
      expect(isConnected).toBe(true);
    });

    it('should select feed error', () => {
      store.dispatch(feedError('Test error'));

      const state = store.getState();
      const error = selectFeedError(state);
      expect(error).toBe('Test error');
    });
  });
});
