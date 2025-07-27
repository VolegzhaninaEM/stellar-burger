import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { TIngredient } from '@utils/types.ts';

type ConstructorState = {
  bun: TIngredient | null;
  ingredients: TIngredient[];
};

const initialState: ConstructorState = { bun: null, ingredients: [] };

const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    setBun: (state, { payload }: PayloadAction<TIngredient>) => {
      state.bun = payload;
    },
    addIngredient: (state, { payload }: PayloadAction<TIngredient>) => {
      state.ingredients.push({ ...payload, _id: crypto.randomUUID() });
    },
    removeIngredient: (state, { payload }: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter((i) => i._id !== payload);
    },
    moveIngredient: (
      state,
      { payload }: PayloadAction<{ dragIndex: number; hoverIndex: number }>
    ) => {
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
