import { createSlice } from '@reduxjs/toolkit';

import type { TOrder } from '@/components/order-card/order-card';
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
    profileOrdersConnect: (state) => {
      state.isConnected = false;
      state.error = null;
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
      const { orders } = action.payload;
      state.orders = orders;
    },
    clearProfileOrders: (state) => {
      state.orders = [];
      state.isConnected = false;
      state.error = null;
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
