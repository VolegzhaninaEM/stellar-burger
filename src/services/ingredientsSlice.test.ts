import { configureStore } from '@reduxjs/toolkit';

import ingredientsReducer, {
  fetchIngredients,
  incrementCounter,
  decrementCounter,
  resetCounter,
  selectIngredients,
  selectIngredientsStatus,
  selectIngredientsError,
  selectIngredientsCounters,
  selectIsIngredientsLoading,
} from './ingredientsSlice';

import type { TIngredient, IngredientsState } from '../utils/types';

// Мокируем API
jest.mock('../utils/api');

// Импортируем замоканный модуль
import * as apiModule from '../utils/api';

// Типизированный мок
const mockRequest = apiModule.request as jest.MockedFunction<typeof apiModule.request>;

// Типы для корневого состояния
type RootState = {
  ingredients: IngredientsState;
};

describe('ingredientsSlice', () => {
  let store: ReturnType<typeof configureStore<RootState>>;

  const mockIngredients: TIngredient[] = [
    {
      _id: '1',
      name: 'Краторная булка N-200i',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'https://code.s3.yandex.net/react/code/bun-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
      __v: 0,
    },
    {
      _id: '2',
      name: 'Биокотлета из марсианской Магнолии',
      type: 'main',
      proteins: 420,
      fat: 142,
      carbohydrates: 242,
      calories: 4242,
      price: 424,
      image: 'https://code.s3.yandex.net/react/code/meat-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
      __v: 0,
    },
  ];

  beforeEach(() => {
    store = configureStore({
      reducer: {
        ingredients: ingredientsReducer,
      },
    });
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should return initial state', () => {
      const state = store.getState().ingredients;
      expect(state).toEqual({
        items: [],
        status: 'idle',
        error: null,
        counters: {},
      });
    });
  });

  describe('sync actions', () => {
    it('should handle incrementCounter', () => {
      store.dispatch(incrementCounter('1'));

      const state = store.getState().ingredients;
      expect(state.counters['1']).toBe(1);
    });

    it('should handle multiple incrementCounter calls', () => {
      store.dispatch(incrementCounter('1'));
      store.dispatch(incrementCounter('1'));
      store.dispatch(incrementCounter('1'));

      const state = store.getState().ingredients;
      expect(state.counters['1']).toBe(3);
    });

    it('should handle decrementCounter', () => {
      store.dispatch(incrementCounter('1'));
      store.dispatch(incrementCounter('1'));
      expect(store.getState().ingredients.counters['1']).toBe(2);

      store.dispatch(decrementCounter('1'));

      const state = store.getState().ingredients;
      expect(state.counters['1']).toBe(1);
    });

    it('should not decrease counter below 0', () => {
      store.dispatch(decrementCounter('1'));

      const state = store.getState().ingredients;
      expect(state.counters['1']).toBe(0);
    });

    it('should handle resetCounter', () => {
      store.dispatch(incrementCounter('1'));
      store.dispatch(incrementCounter('1'));
      expect(store.getState().ingredients.counters['1']).toBe(2);

      store.dispatch(resetCounter('1'));

      const state = store.getState().ingredients;
      expect(state.counters['1']).toBe(0);
    });
  });

  describe('async actions', () => {
    describe('fetchIngredients', () => {
      it('should handle fulfilled state', async () => {
        mockRequest.mockResolvedValue({ data: mockIngredients });

        await store.dispatch(fetchIngredients());

        const state = store.getState().ingredients;
        expect(state.items).toEqual(mockIngredients);
        expect(state.status).toBe('succeeded');
        expect(state.error).toBe(null);
      });

      it('should handle rejected state with Error object', async () => {
        const errorMessage = 'Network error';
        mockRequest.mockRejectedValue(new Error(errorMessage));

        await store.dispatch(fetchIngredients());

        const state = store.getState().ingredients;
        expect(state.status).toBe('failed');
        expect(state.error).toBe(errorMessage);
        expect(state.items).toEqual([]);
      });

      it('should handle rejected state with non-Error object', async () => {
        mockRequest.mockRejectedValue('String error');

        await store.dispatch(fetchIngredients());

        const state = store.getState().ingredients;
        expect(state.status).toBe('failed');
        expect(state.error).toBe('Ошибка загрузки ингредиентов');
      });
    });
  });

  describe('selectors', () => {
    beforeEach(async () => {
      mockRequest.mockResolvedValue({ data: mockIngredients });
      await store.dispatch(fetchIngredients());
      store.dispatch(incrementCounter('1'));
      store.dispatch(incrementCounter('2'));
    });

    it('should select ingredients', () => {
      const state = store.getState();
      const ingredients = selectIngredients(state);
      expect(ingredients).toEqual(mockIngredients);
    });

    it('should select ingredients status', () => {
      const state = store.getState();
      const status = selectIngredientsStatus(state);
      expect(status).toBe('succeeded');
    });

    it('should select ingredients error', () => {
      const state = store.getState();
      const error = selectIngredientsError(state);
      expect(error).toBe(null);
    });

    it('should select ingredients counters', () => {
      const state = store.getState();
      const counters = selectIngredientsCounters(state);
      expect(counters).toEqual({ '1': 1, '2': 1 });
    });

    it('should select loading status', () => {
      const state = store.getState();
      const isLoading = selectIsIngredientsLoading(state);
      expect(isLoading).toBe(false);
    });
  });
});
