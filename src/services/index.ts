// Центральный файл для экспорта всех типов и селекторов Redux

// Экспорт типов store
export type { RootState, AppDispatch, AppThunk } from './store';

// Экспорт общих типов
export type {
  LoadingStatus,
  BaseState,
  AsyncState,
  ApiError,
  SerializedError,
} from '@utils/types';

// Экспорт хуков
export { useAppDispatch, useAppSelector } from './hooks';

// Экспорт действий
export {
  createOrder,
  closeOrderModal,
  setOrderNumber,
  clearOrderError,
} from './orderSlice';
export {
  fetchIngredients,
  incrementCounter,
  decrementCounter,
  resetCounter,
} from './ingredientsSlice';
export {
  setBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
} from './constructorSlice';
export { setIngredient, clearIngredient } from './ingredientDetailsSlice';
export {
  feedConnect,
  feedConnected,
  feedDisconnected,
  feedDisconnect,
  feedError,
  feedMessage,
} from './feedSlice';
export {
  profileOrdersConnect,
  profileOrdersConnected,
  profileOrdersDisconnected,
  profileOrdersDisconnect,
  profileOrdersError,
  profileOrdersMessage,
  clearProfileOrders,
} from './profileOrdersSlice';

// Экспорт селекторов
export {
  selectOrderNumber,
  selectOrderStatus,
  selectOrderError,
  selectIsOrderLoading,
} from './orderSlice';

export {
  selectIngredients,
  selectIngredientsStatus,
  selectIngredientsError,
  selectIngredientsCounters,
  selectIsIngredientsLoading,
  selectIngredientById,
  selectIngredientsByType,
} from './ingredientsSlice';

export {
  selectConstructorBuns,
  selectConstructorIngredients,
  selectConstructorState,
  selectConstructorTotalPrice,
  selectConstructorItemsCount,
  selectIsConstructorEmpty,
} from './constructorSlice';

export {
  selectIngredientDetails,
  selectHasIngredientDetails,
  selectIngredientDetailsId,
  selectIngredientDetailsName,
  selectIngredientDetailsNutrition,
} from './ingredientDetailsSlice';

export {
  selectFeedOrders,
  selectFeedTotal,
  selectFeedTotalToday,
  selectFeedIsConnected,
  selectFeedError,
} from './feedSlice';

export {
  selectProfileOrders,
  selectProfileOrdersIsConnected,
  selectProfileOrdersError,
} from './profileOrdersSlice';

// Экспорт store
export { store } from './store';
