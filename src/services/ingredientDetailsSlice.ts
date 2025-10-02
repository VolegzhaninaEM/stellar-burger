import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { TIngredient } from '@utils/types.ts';

// Типы для состояния деталей ингредиента
type IngredientDetailsState = {
  ingredient: TIngredient | null;
};

const initialState: IngredientDetailsState = {
  ingredient: null,
};

const ingredientDetailsSlice = createSlice({
  name: 'ingredientDetails',
  initialState,
  reducers: {
    setIngredient: (state, { payload }: PayloadAction<TIngredient>) => {
      state.ingredient = payload;
    },
    clearIngredient: (state) => {
      state.ingredient = null;
    },
  },
});

export const { setIngredient, clearIngredient } = ingredientDetailsSlice.actions;
export default ingredientDetailsSlice.reducer;

// Селекторы с типизацией
export const selectIngredientDetails = (state: {
  ingredientDetails: IngredientDetailsState;
}): TIngredient | null => state.ingredientDetails.ingredient;

export const selectHasIngredientDetails = (state: {
  ingredientDetails: IngredientDetailsState;
}): boolean => state.ingredientDetails.ingredient !== null;

export const selectIngredientDetailsId = (state: {
  ingredientDetails: IngredientDetailsState;
}): string | undefined => state.ingredientDetails.ingredient?._id;

export const selectIngredientDetailsName = (state: {
  ingredientDetails: IngredientDetailsState;
}): string | undefined => state.ingredientDetails.ingredient?.name;

export const selectIngredientDetailsNutrition = (state: {
  ingredientDetails: IngredientDetailsState;
}): {
  calories: number;
  proteins: number;
  fat: number;
  carbohydrates: number;
} | null => {
  const ingredient = state.ingredientDetails.ingredient;
  if (!ingredient) return null;

  return {
    calories: ingredient.calories,
    proteins: ingredient.proteins,
    fat: ingredient.fat,
    carbohydrates: ingredient.carbohydrates,
  };
};
