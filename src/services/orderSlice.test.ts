import { configureStore } from '@reduxjs/toolkit';

import orderReducer, {
  createOrder,
  fetchOrderById,
  closeOrderModal,
  setOrderNumber,
  clearOrderError,
  selectOrderNumber,
  selectOrderStatus,
  selectOrderError,
  selectIsOrderLoading,
} from './orderSlice';

import type { TOrder, OrderState } from '../utils/types';

// Мокируем зависимости
jest.mock('../utils/api');
jest.mock('../utils/cookies');

// Импортируем замоканные модули
import * as apiModule from '../utils/api';
import * as cookiesModule from '../utils/cookies';

// Типизированные моки
const mockRequest = apiModule.request as jest.MockedFunction<typeof apiModule.request>;
const mockGetOrderById = apiModule.getOrderById as jest.MockedFunction<
  typeof apiModule.getOrderById
>;
const mockGetCookie = cookiesModule.getCookie as jest.MockedFunction<
  typeof cookiesModule.getCookie
>;

// Типы для корневого состояния
type RootState = {
  order: OrderState;
};

describe('orderSlice', () => {
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

  beforeEach(() => {
    store = configureStore({
      reducer: {
        order: orderReducer,
      },
    });
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should return initial state', () => {
      const state = store.getState().order;
      expect(state).toEqual({
        number: null,
        status: 'idle',
        error: null,
        selectedOrder: null,
      });
    });
  });

  describe('sync actions', () => {
    it('should handle closeOrderModal', () => {
      store.dispatch(setOrderNumber(12345));
      store.dispatch(closeOrderModal());

      const state = store.getState().order;
      expect(state.number).toBe(null);
      expect(state.status).toBe('idle');
      expect(state.error).toBe(null);
    });

    it('should handle setOrderNumber', () => {
      store.dispatch(setOrderNumber(12345));

      const state = store.getState().order;
      expect(state.number).toBe(12345);
    });

    it('should handle clearOrderError', () => {
      store.dispatch({
        type: createOrder.rejected.type,
        payload: 'Test error',
      });
      expect(store.getState().order.error).toBe('Test error');

      store.dispatch(clearOrderError());

      const state = store.getState().order;
      expect(state.error).toBe(null);
    });
  });

  describe('async actions', () => {
    describe('createOrder', () => {
      it('should handle fulfilled state', async () => {
        mockGetCookie.mockReturnValue('valid-token');
        mockRequest.mockResolvedValue({ order: { number: 12345 } });

        await store.dispatch(createOrder(['ingredient1', 'ingredient2']));

        const state = store.getState().order;
        expect(state.number).toBe(12345);
        expect(state.status).toBe('succeeded');
        expect(state.error).toBe(null);
      });

      it('should handle rejected state when no token', async () => {
        mockGetCookie.mockReturnValue(undefined);

        await store.dispatch(createOrder(['ingredient1', 'ingredient2']));

        const state = store.getState().order;
        expect(state.status).toBe('failed');
        expect(state.error).toBe('Требуется авторизация для создания заказа');
      });

      it('should handle rejected state with error', async () => {
        mockGetCookie.mockReturnValue('valid-token');
        const errorMessage = 'Network error';
        mockRequest.mockRejectedValue(new Error(errorMessage));

        await store.dispatch(createOrder(['ingredient1', 'ingredient2']));

        const state = store.getState().order;
        expect(state.status).toBe('failed');
        expect(state.error).toBe(errorMessage);
      });
    });

    describe('fetchOrderById', () => {
      it('should handle fulfilled state', async () => {
        mockGetCookie.mockReturnValue('valid-token');
        mockGetOrderById.mockResolvedValue({ orders: [mockOrder] });

        await store.dispatch(fetchOrderById('order-id'));

        const state = store.getState().order;
        expect(state.selectedOrder).toEqual(mockOrder);
        expect(state.status).toBe('succeeded');
        expect(state.error).toBe(null);
      });

      it('should handle rejected state when order not found', async () => {
        mockGetCookie.mockReturnValue('valid-token');
        mockGetOrderById.mockResolvedValue({ orders: [] });

        await store.dispatch(fetchOrderById('order-id'));

        const state = store.getState().order;
        expect(state.status).toBe('failed');
        expect(state.error).toBe('Заказ не найден');
        expect(state.selectedOrder).toBe(null);
      });
    });
  });

  describe('selectors', () => {
    beforeEach(() => {
      store.dispatch(setOrderNumber(12345));
    });

    it('should select order number', () => {
      const state = store.getState();
      const orderNumber = selectOrderNumber(state);
      expect(orderNumber).toBe(12345);
    });

    it('should select order status', () => {
      const state = store.getState();
      const status = selectOrderStatus(state);
      expect(status).toBe('idle');
    });

    it('should select order error', () => {
      const state = store.getState();
      const error = selectOrderError(state);
      expect(error).toBe(null);
    });

    it('should select loading status', () => {
      const state = store.getState();
      const isLoading = selectIsOrderLoading(state);
      expect(isLoading).toBe(false);
    });
  });
});
