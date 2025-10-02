import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  TConstructorIngredient,
  TIngredient,
  ConstructorState,
} from '@utils/types';

const initialState: ConstructorState = {
  buns: null,
  ingredients: [],
};

// Типы для payload действий
type MoveIngredientPayload = {
  dragIndex: number;
  hoverIndex: number;
};

const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    setBun: {
      reducer: (state, { payload }: PayloadAction<TConstructorIngredient>) => {
        state.buns = payload;
      },
      prepare: (newBun: TConstructorIngredient) => {
        return {
          payload: newBun,
          meta: { oldBunId: null },
        };
      },
    },
    addIngredient: {
      reducer: (state, { payload }: PayloadAction<TConstructorIngredient>) => {
        state.ingredients.push(payload);
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, uniqueId: uuidv4() },
      }),
    },
    removeIngredient: (state, { payload }: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter((i) => i?.uniqueId !== payload);
    },
    moveIngredient: (state, { payload }: PayloadAction<MoveIngredientPayload>) => {
      const { dragIndex, hoverIndex } = payload;
      const dragItem = state.ingredients[dragIndex];
      state.ingredients.splice(dragIndex, 1);
      state.ingredients.splice(hoverIndex, 0, dragItem);
    },
    clearConstructor: () => initialState,
  },
});

export const {
  setBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
} = constructorSlice.actions;

export default constructorSlice.reducer;

// Селекторы с типизацией
export const selectConstructorBuns = (state: {
  burgerConstructor: ConstructorState;
}): TConstructorIngredient | null => state.burgerConstructor.buns;

export const selectConstructorIngredients = (state: {
  burgerConstructor: ConstructorState;
}): TConstructorIngredient[] => {
  return state.burgerConstructor.ingredients;
};

export const selectConstructorState = (state: {
  burgerConstructor: ConstructorState;
}): ConstructorState => state.burgerConstructor;

export const selectConstructorTotalPrice = (state: {
  burgerConstructor: ConstructorState;
}): number => {
  const { buns, ingredients } = state.burgerConstructor;
  const bunPrice = buns ? buns.price * 2 : 0; // булка считается дважды
  const ingredientsPrice = ingredients.reduce(
    (total, ingredient) => total + ingredient.price,
    0
  );
  return bunPrice + ingredientsPrice;
};

export const selectConstructorItemsCount = (state: {
  burgerConstructor: ConstructorState;
}): number => {
  const { buns, ingredients } = state.burgerConstructor;
  return (buns ? 2 : 0) + ingredients.length;
};

export const selectIsConstructorEmpty = (state: {
  burgerConstructor: ConstructorState;
}): boolean => {
  const { buns, ingredients } = state.burgerConstructor;
  return !buns && ingredients.length === 0;
};
