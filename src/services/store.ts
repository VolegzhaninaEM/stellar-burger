import { configureStore } from '@reduxjs/toolkit';

import authReducer from './authSlice';
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
    auth: authReducer,
  },
});

// типы для всего приложения
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
