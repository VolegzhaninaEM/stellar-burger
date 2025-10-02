import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { request } from '../utils/api';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { IngredientsState, LoadingStatus, TIngredient } from '@utils/types';

// Типы для API ответа
type IngredientsResponse = {
  data: TIngredient[];
};

const initialState: IngredientsState = {
  items: [],
  status: 'idle',
  error: null,
  counters: {},
};

// Загрузка ингредиентов
export const fetchIngredients = createAsyncThunk<
  TIngredient[],
  void,
  {
    rejectValue: string;
  }
>('ingredients/fetch', async (_, { rejectWithValue }) => {
  try {
    const response = await request<IngredientsResponse>('/ingredients');
    return response.data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Ошибка загрузки ингредиентов';
    return rejectWithValue(errorMessage);
  }
});

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
    // обнулить все счётчики
    clearAllCounters(state) {
      state.counters = {};
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(
        fetchIngredients.fulfilled,
        (state, { payload }: PayloadAction<TIngredient[]>) => {
          state.items = payload;
          state.status = 'succeeded';
          state.error = null;
        }
      )
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          action.payload ?? action.error.message ?? 'Ошибка загрузки ингредиентов';
      }),
});

export const { incrementCounter, decrementCounter, resetCounter } =
  ingredientsSlice.actions;

export default ingredientsSlice.reducer;

// Селекторы с типизацией
export const selectIngredients = (state: {
  ingredients: IngredientsState;
}): TIngredient[] => state.ingredients.items;
export const selectIngredientsStatus = (state: {
  ingredients: IngredientsState;
}): LoadingStatus => state.ingredients.status;
export const selectIngredientsError = (state: {
  ingredients: IngredientsState;
}): string | null => state.ingredients.error;
export const selectIngredientsCounters = (state: {
  ingredients: IngredientsState;
}): Record<string, number> => state.ingredients.counters;
export const selectIsIngredientsLoading = (state: {
  ingredients: IngredientsState;
}): boolean => state.ingredients.status === 'loading';
export const selectIngredientById = (
  state: { ingredients: IngredientsState },
  id: string
): TIngredient | undefined => state.ingredients.items.find((item) => item._id === id);
export const selectIngredientsByType = (
  state: { ingredients: IngredientsState },
  type: string
): TIngredient[] => state.ingredients.items.filter((item) => item.type === type);
