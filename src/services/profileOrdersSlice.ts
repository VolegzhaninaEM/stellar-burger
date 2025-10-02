import { createSlice } from '@reduxjs/toolkit';

import type { TOrder } from '../utils/types';
import type { PayloadAction } from '@reduxjs/toolkit';

export type ProfileOrdersState = {
  orders: TOrder[];
  isConnected: boolean;
  error: string | null;
};

const initialState: ProfileOrdersState = {
  orders: [],
  isConnected: false,
  error: null,
};

export type ProfileOrdersData = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {
    profileOrdersConnect: {
      reducer: (state, _action: PayloadAction<{ url: string; token?: string }>) => {
        state.isConnected = false;
        state.error = null;
      },
      prepare: (payload: { url: string; token?: string }) => ({
        payload,
      }),
    },
    profileOrdersConnected: (state) => {
      state.isConnected = true;
      state.error = null;
    },
    profileOrdersDisconnected: (state) => {
      state.isConnected = false;
    },
    profileOrdersError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isConnected = false;
    },
    profileOrdersMessage: (state, action: PayloadAction<ProfileOrdersData>) => {
      console.log('📦 Получены заказы профиля:', action.payload);
      const payload = action.payload;
      state.orders = payload.orders ?? [];
      state.error = null;
    },
    clearProfileOrders: (state) => {
      state.orders = [];
      state.isConnected = false;
      state.error = null;
    },
    profileOrdersDisconnect: (state) => {
      state.isConnected = false;
    },
  },
});

export const {
  profileOrdersConnect,
  profileOrdersConnected,
  profileOrdersDisconnected,
  profileOrdersError,
  profileOrdersMessage,
  clearProfileOrders,
  profileOrdersDisconnect,
} = profileOrdersSlice.actions;

export default profileOrdersSlice.reducer;

// Селекторы
export const selectProfileOrders = (state: {
  profileOrders: ProfileOrdersState;
}): TOrder[] => state.profileOrders.orders;

export const selectProfileOrdersIsConnected = (state: {
  profileOrders: ProfileOrdersState;
}): boolean => state.profileOrders.isConnected;

export const selectProfileOrdersError = (state: {
  profileOrders: ProfileOrdersState;
}): string | null => state.profileOrders.error;
