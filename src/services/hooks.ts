import { useDispatch, useSelector } from 'react-redux';

import type { RootState, AppDispatch, AppThunk } from './store';
import type {
  ConstructorState,
  IngredientsState,
  OrderState,
  TAuthState,
  TConstructorIngredient,
  TIngredient,
} from '@utils/types.ts';
import type { TypedUseSelectorHook } from 'react-redux';

// Типизированные хуки для использования в компонентах
export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Хук для dispatch async thunk actions с правильной типизацией
export const useAppThunk = () => {
  const dispatch = useAppDispatch();
  return <ReturnType = void>(thunk: AppThunk<ReturnType>): ReturnType => dispatch(thunk);
};

// Селекторы с типизацией для часто используемых частей state
export const useAuth = (): TAuthState => useAppSelector((state) => state.auth);
export const useBurgerConstructor = (): ConstructorState =>
  useAppSelector((state): ConstructorState => state.burgerConstructor);
export const useIngredients = (): IngredientsState =>
  useAppSelector((state): IngredientsState => state.ingredients);
export const useIngredientDetails = (): TIngredient | null =>
  useAppSelector((state) => state.ingredientDetails.ingredient);
export const useOrder = (): OrderState => useAppSelector((state) => state.order);

// Комбинированные селекторы для удобства
export const useConstructorState = (): {
  buns: (TIngredient & { uniqueId: string }) | null;
  ingredients: TConstructorIngredient[];
  availableIngredients: TIngredient[];
  counters: Record<string, number>;
} => {
  const { buns, ingredients } = useBurgerConstructor();
  const { items: availableIngredients, counters } = useIngredients();

  return {
    buns,
    ingredients,
    availableIngredients,
    counters,
  };
};
