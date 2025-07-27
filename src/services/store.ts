import { configureStore } from '@reduxjs/toolkit';

import constructorReducer from './constructorSlice';
import ingredientDetailsReducer from './ingredientDetailsSlice';
import ingredientsReducer from './ingredientsSlice';
import orderReducer from './orderSlice';

export const store = configureStore({
  reducer: {
    burgerConstructor: constructorReducer,
    ingredients: ingredientsReducer,
    ingredientDetails: ingredientDetailsReducer,
    order: orderReducer,
  },
});

// типы для всего приложения
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
