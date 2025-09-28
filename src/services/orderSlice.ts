import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { request } from '../utils/api';
import { getCookie } from '../utils/cookies';

import type { LoadingStatus, OrderState } from '../../src/utils/types';
import type { PayloadAction } from '@reduxjs/toolkit';

// Типы для API ответа
type OrderResponse = {
  order: {
    number: number;
  };
};

const initialState: OrderState = {
  number: null,
  status: 'idle',
  error: null,
};

// Создание заказа
export const createOrder = createAsyncThunk<
  number, // возвращаемый тип
  string[], // тип аргумента
  {
    rejectValue: string; // тип для rejectWithValue
  }
>('order/create', async (ingredients: string[], { rejectWithValue }) => {
  try {
    const response = await request<OrderResponse>(
      '/orders',
      'POST',
      JSON.stringify({ ingredients })
    );
    return response.order.number;
  } catch (error) {
    // Обработка ошибок с правильной типизацией
    const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
    return rejectWithValue(errorMessage);
  }
});

export const fetchOrders = createAsyncThunk<
  OrderResponse,
  void,
  {
    rejectValue: string;
  }
>('orders/fetch', async (_, { rejectWithValue }) => {
  try {
    // Получаем токен авторизации из cookies
    const accessToken = getCookie('accessToken');

    if (!accessToken) {
      return rejectWithValue('Требуется авторизация для просмотра заказов');
    }

    return await request<OrderResponse>('/orders', 'GET', undefined, accessToken);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Ошибка загрузки заказов';
    return rejectWithValue(errorMessage);
  }
});

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    closeOrderModal: (state) => {
      state.number = null;
      state.status = 'idle';
      state.error = null;
    },
    clearOrderError: (state) => {
      state.error = null;
    },
    setOrderNumber: (state, action: PayloadAction<number | null>) => {
      state.number = action.payload;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(createOrder.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, { payload }: PayloadAction<number>) => {
        state.number = payload;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? action.error.message ?? 'Ошибка создания заказа';
      })
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(
        fetchOrders.fulfilled,
        (state, { payload }: PayloadAction<OrderResponse>) => {
          state.number = payload.order.number;
          state.status = 'succeeded';
          state.error = null;
        }
      )
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          action.payload ?? action.error.message ?? 'Ошибка загрузки заказов';
      }),
});

export const { closeOrderModal, setOrderNumber, clearOrderError } = orderSlice.actions;
export default orderSlice.reducer;

// Селекторы с типизацией
export const selectOrderNumber = (state: { order: OrderState }): number | null =>
  state.order.number;
export const selectOrderStatus = (state: { order: OrderState }): LoadingStatus =>
  state.order.status;
export const selectOrderError = (state: { order: OrderState }): string | null =>
  state.order.error;
export const selectIsOrderLoading = (state: { order: OrderState }): boolean =>
  state.order.status === 'loading';
