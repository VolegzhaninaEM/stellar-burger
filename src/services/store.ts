import { configureStore } from '@reduxjs/toolkit';

import authReducer from './authSlice';
import constructorReducer from './constructorSlice';
import feedReducer from './feedSlice';
import ingredientDetailsReducer from './ingredientDetailsSlice';
import ingredientsReducer from './ingredientsSlice';
import orderReducer from './orderSlice';
import profileOrdersReducer from './profileOrdersSlice';
import {
  feedSocketMiddleware,
  profileOrdersSocketMiddleware,
} from './websocketInstances';

import type { Action, ThunkAction } from '@reduxjs/toolkit';

// Конфигурация store с типизацией
export const store = configureStore({
  reducer: {
    burgerConstructor: constructorReducer,
    ingredients: ingredientsReducer,
    ingredientDetails: ingredientDetailsReducer,
    order: orderReducer,
    auth: authReducer,
    feed: feedReducer,
    profileOrders: profileOrdersReducer,
  },
  // Включаем DevTools только в development режиме
  devTools: process.env.NODE_ENV !== 'production',
  // Настройки middleware для лучшей производительности
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Игнорируем определенные action types для несериализуемых данных
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(feedSocketMiddleware, profileOrdersSocketMiddleware),
});

// Типы для всего приложения
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Тип для async thunk действий
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
