import { configureStore } from '@reduxjs/toolkit';

import ingredientDetailsReducer, {
  setIngredient,
  clearIngredient,
  selectIngredientDetails,
  selectHasIngredientDetails,
  selectIngredientDetailsId,
  selectIngredientDetailsName,
} from './ingredientDetailsSlice';

import type { TIngredient } from '../utils/types';

// Типизация состояния для ingredientDetails
type IngredientDetailsState = {
  ingredient: TIngredient | null;
};

// Типы для корневого состояния
type RootState = {
  ingredientDetails: IngredientDetailsState;
};

describe('ingredientDetailsSlice', () => {
  let store: ReturnType<typeof configureStore<RootState>>;

  const mockIngredient: TIngredient = {
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
  };

  beforeEach(() => {
    store = configureStore({
      reducer: {
        ingredientDetails: ingredientDetailsReducer,
      },
    });
  });

  describe('initial state', () => {
    it('should return initial state', () => {
      const state = store.getState().ingredientDetails;
      expect(state).toEqual({
        ingredient: null,
      });
    });
  });

  describe('actions', () => {
    it('should handle setIngredient', () => {
      store.dispatch(setIngredient(mockIngredient));

      const state = store.getState().ingredientDetails;
      expect(state.ingredient).toEqual(mockIngredient);
    });

    it('should handle clearIngredient', () => {
      store.dispatch(setIngredient(mockIngredient));
      expect(store.getState().ingredientDetails.ingredient).toEqual(mockIngredient);

      store.dispatch(clearIngredient());

      const state = store.getState().ingredientDetails;
      expect(state.ingredient).toBe(null);
    });

    it('should replace existing ingredient when setting new one', () => {
      const anotherIngredient: TIngredient = {
        ...mockIngredient,
        _id: '2',
        name: 'Другой ингредиент',
        price: 500,
      };

      store.dispatch(setIngredient(mockIngredient));
      expect(store.getState().ingredientDetails.ingredient?.name).toBe(
        'Краторная булка N-200i'
      );

      store.dispatch(setIngredient(anotherIngredient));

      const state = store.getState().ingredientDetails;
      expect(state.ingredient).toEqual(anotherIngredient);
      expect(state.ingredient?.name).toBe('Другой ингредиент');
    });
  });

  describe('selectors', () => {
    it('should select ingredient details when ingredient is set', () => {
      store.dispatch(setIngredient(mockIngredient));

      const state = store.getState();
      const ingredient = selectIngredientDetails(state);
      expect(ingredient).toEqual(mockIngredient);
    });

    it('should select null when no ingredient is set', () => {
      const state = store.getState();
      const ingredient = selectIngredientDetails(state);
      expect(ingredient).toBe(null);
    });

    it('should correctly detect if ingredient details exist', () => {
      let state = store.getState();
      expect(selectHasIngredientDetails(state)).toBe(false);

      store.dispatch(setIngredient(mockIngredient));

      state = store.getState();
      expect(selectHasIngredientDetails(state)).toBe(true);
    });

    it('should select ingredient id', () => {
      store.dispatch(setIngredient(mockIngredient));

      const state = store.getState();
      const id = selectIngredientDetailsId(state);
      expect(id).toBe('1');
    });

    it('should select undefined id when no ingredient', () => {
      const state = store.getState();
      const id = selectIngredientDetailsId(state);
      expect(id).toBeUndefined();
    });

    it('should select ingredient name', () => {
      store.dispatch(setIngredient(mockIngredient));

      const state = store.getState();
      const name = selectIngredientDetailsName(state);
      expect(name).toBe('Краторная булка N-200i');
    });

    it('should select undefined name when no ingredient', () => {
      const state = store.getState();
      const name = selectIngredientDetailsName(state);
      expect(name).toBeUndefined();
    });
  });
});
