import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { request } from '../utils/api';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { TIngredient } from '@utils/types.ts';

export const fetchIngredients = createAsyncThunk('ingredients/fetch', async () => {
  const data = await request<{ data: TIngredient[] }>('/ingredients');
  return data.data;
});

type IngredientsState = {
  items: TIngredient[];
  status: 'idle' | 'loading' | 'error';
  counters: Record<string, number>;
};

const initialState: IngredientsState = { items: [], status: 'idle', counters: {} };

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    // увеличить счётчик
    incrementCounter(state, { payload }: PayloadAction<string>) {
      const id: string = payload;
      state.counters[id] = (state.counters[id] ?? 0) + 1;
    },
    // уменьшить счётчик (не ниже 0)
    decrementCounter(state, { payload }: PayloadAction<string>) {
      state.counters[payload] = Math.max(0, (state.counters[payload] || 0) - 1);
    },
    // обнулить счётчик (для булок при замене)
    resetCounter(state, { payload }: PayloadAction<string>) {
      state.counters[payload] = 0;
    },
  },
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

export const { incrementCounter, decrementCounter, resetCounter } =
  ingredientsSlice.actions;
export default ingredientsSlice.reducer;
