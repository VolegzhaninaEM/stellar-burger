import { configureStore } from '@reduxjs/toolkit';

import constructorReducer, {
  setBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  selectConstructorBuns,
  selectConstructorIngredients,
  selectConstructorTotalPrice,
  selectConstructorItemsCount,
} from './constructorSlice';

import type {
  ConstructorState,
  TIngredient,
  TConstructorIngredient,
} from '../utils/types';

// Мокируем uuid
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-uuid'),
}));

// Импортируем замоканный модуль
import { v4 as uuidv4 } from 'uuid';

// Типизированный мок для uuid
const mockUuidv4 = uuidv4 as jest.MockedFunction<typeof uuidv4>;

// Типы для корневого состояния
type RootState = {
  burgerConstructor: ConstructorState;
};

describe('constructorSlice', () => {
  let store: ReturnType<typeof configureStore<RootState>>;

  const mockBun: TConstructorIngredient = {
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
    uniqueId: 'bun-uuid',
  };

  const mockIngredient: TIngredient = {
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
  };

  const mockConstructorIngredient: TConstructorIngredient = {
    ...mockIngredient,
    uniqueId: 'mock-uuid',
  };

  beforeEach(() => {
    store = configureStore({
      reducer: {
        burgerConstructor: constructorReducer,
      },
    });
    // @ts-expect-error - мокирование uuid с перегруженными типами
    mockUuidv4.mockReturnValue('mock-uuid');
  });

  describe('initial state', () => {
    it('should return initial state', () => {
      const state = store.getState().burgerConstructor;
      expect(state).toEqual({
        buns: null,
        ingredients: [],
      });
    });
  });

  describe('actions', () => {
    it('should handle setBun', () => {
      store.dispatch(setBun(mockBun));
      const state = store.getState().burgerConstructor;
      expect(state.buns).toEqual(mockBun);
    });

    it('should handle addIngredient', () => {
      store.dispatch(addIngredient(mockIngredient));
      const state = store.getState().burgerConstructor;
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toEqual(mockConstructorIngredient);
    });

    it('should handle removeIngredient', () => {
      store.dispatch(addIngredient(mockIngredient));
      let state = store.getState().burgerConstructor;
      expect(state.ingredients).toHaveLength(1);

      store.dispatch(removeIngredient('mock-uuid'));
      state = store.getState().burgerConstructor;
      expect(state.ingredients).toHaveLength(0);
    });

    it('should handle moveIngredient', () => {
      const ingredient1: TIngredient = { ...mockIngredient, _id: '1' };
      const ingredient2: TIngredient = { ...mockIngredient, _id: '2' };

      store.dispatch(addIngredient(ingredient1));
      store.dispatch(addIngredient(ingredient2));

      let state = store.getState().burgerConstructor;
      expect(state.ingredients[0]._id).toBe('1');
      expect(state.ingredients[1]._id).toBe('2');

      store.dispatch(moveIngredient({ dragIndex: 0, hoverIndex: 1 }));

      state = store.getState().burgerConstructor;
      expect(state.ingredients[0]._id).toBe('2');
      expect(state.ingredients[1]._id).toBe('1');
    });

    it('should handle clearConstructor', () => {
      store.dispatch(setBun(mockBun));
      store.dispatch(addIngredient(mockIngredient));

      let state = store.getState().burgerConstructor;
      expect(state.buns).not.toBeNull();
      expect(state.ingredients).toHaveLength(1);

      store.dispatch(clearConstructor());

      state = store.getState().burgerConstructor;
      expect(state.buns).toBeNull();
      expect(state.ingredients).toHaveLength(0);
    });
  });

  describe('selectors', () => {
    beforeEach(() => {
      store.dispatch(setBun(mockBun));
      store.dispatch(addIngredient(mockIngredient));
    });

    it('should select constructor buns', () => {
      const state = store.getState();
      const buns = selectConstructorBuns(state);
      expect(buns).toEqual(mockBun);
    });

    it('should select constructor ingredients', () => {
      const state = store.getState();
      const ingredients = selectConstructorIngredients(state);
      expect(ingredients).toHaveLength(1);
      expect(ingredients[0]).toEqual(mockConstructorIngredient);
    });

    it('should calculate total price correctly', () => {
      const state = store.getState();
      const totalPrice = selectConstructorTotalPrice(state);
      expect(totalPrice).toBe(2934);
    });

    it('should count items correctly', () => {
      const state = store.getState();
      const itemsCount = selectConstructorItemsCount(state);
      expect(itemsCount).toBe(3);
    });
  });
});
