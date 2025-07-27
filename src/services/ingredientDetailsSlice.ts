import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { TIngredient } from '@utils/types.ts';

const ingredientDetailsSlice = createSlice({
  name: 'ingredientDetails',
  initialState: null as TIngredient | null,
  reducers: {
    setIngredient: (_, { payload }: PayloadAction<TIngredient>) => payload,
    clearIngredient: () => null,
  },
});

export const { setIngredient, clearIngredient } = ingredientDetailsSlice.actions;
export default ingredientDetailsSlice.reducer;
