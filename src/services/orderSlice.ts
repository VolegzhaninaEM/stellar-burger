import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { request } from '../utils/api';

type OrderState = {
  number: number | null;
  status: 'idle' | 'loading' | 'error';
};

const initialState: OrderState = { number: null, status: 'idle' };

export const createOrder = createAsyncThunk(
  'order/create',
  async (ingredients: string[]) => {
    const { order } = await request<{ order: { number: number } }>(
      '/orders',
      'POST',
      JSON.stringify({ ingredients })
    );
    return order.number;
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    closeOrderModal: () => initialState,
  },
  extraReducers: (builder) =>
    builder
      .addCase(createOrder.pending, (s) => {
        s.status = 'loading';
      })
      .addCase(createOrder.fulfilled, (s, { payload }) => {
        s.number = payload;
        s.status = 'idle';
      })
      .addCase(createOrder.rejected, (s) => {
        s.status = 'error';
      }),
});

export const { closeOrderModal } = orderSlice.actions;
export default orderSlice.reducer;
