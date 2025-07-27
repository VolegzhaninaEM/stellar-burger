import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { request } from '../utils/api';

import type { TIngredient } from '@utils/types.ts';

export const fetchIngredients = createAsyncThunk('ingredients/fetch', async () => {
  const data = await request<{ data: TIngredient[] }>('/ingredients');
  return data.data;
});

type IngredientsState = {
  items: TIngredient[];
  status: 'idle' | 'loading' | 'error';
};

const initialState: IngredientsState = { items: [], status: 'idle' };

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(fetchIngredients.pending, (s) => {
        s.status = 'loading';
      })
      .addCase(fetchIngredients.fulfilled, (s, { payload }) => {
        s.items = payload;
        s.status = 'idle';
      })
      .addCase(fetchIngredients.rejected, (s) => {
        s.status = 'error';
      }),
});

export default ingredientsSlice.reducer;
