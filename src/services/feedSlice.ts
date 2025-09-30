import { createSlice } from '@reduxjs/toolkit';

import type { TOrder } from '@/components/order-card/order-card';
import type { PayloadAction } from '@reduxjs/toolkit';

export type FeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isConnected: boolean;
  error: string | null;
};

const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isConnected: false,
  error: null,
};

export type FeedData = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    feedConnect: {
      reducer: (state, _action: PayloadAction<{ url: string; token?: string }>) => {
        state.isConnected = false;
        state.error = null;
      },
      prepare: (payload: { url: string; token?: string }) => ({
        payload,
      }),
    },
    feedConnected: (state) => {
      state.isConnected = true;
      state.error = null;
    },
    feedDisconnected: (state) => {
      state.isConnected = false;
    },
    feedError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isConnected = false;
    },
    feedMessage: (state, action: PayloadAction<FeedData>) => {
      console.log('📦 Получены заказы ленты:', action.payload);
      const payload = action.payload;
      state.orders = payload.orders ?? [];
      state.total = payload.total ?? 0;
      state.totalToday = payload.totalToday ?? 0;
      state.error = null;
    },
    // Добавляем действие для отключения
    feedDisconnect: (state) => {
      state.isConnected = false;
    },
  },
});

export const {
  feedConnect,
  feedConnected,
  feedDisconnected,
  feedError,
  feedMessage,
  feedDisconnect,
} = feedSlice.actions;

export default feedSlice.reducer;

// Селекторы
export const selectFeedOrders = (state: { feed: FeedState }): TOrder[] =>
  state.feed.orders;
export const selectFeedTotal = (state: { feed: FeedState }): number => state.feed.total;
export const selectFeedTotalToday = (state: { feed: FeedState }): number =>
  state.feed.totalToday;
export const selectFeedIsConnected = (state: { feed: FeedState }): boolean =>
  state.feed.isConnected;
export const selectFeedError = (state: { feed: FeedState }): string | null =>
  state.feed.error;
