import type { TOrderStatus } from '@components/order-card/order-card.tsx';

export type TIngredient = {
  _id: string;
  name: string;
  type: string;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
  __v: number;
};

export type TIngredientsResponse = {
  success: boolean;
  data: TIngredient[];
};

export type TBurgerIngredientsProps = {
  handleIngredientClick: (card: TIngredient) => void;
  extendedClass?: string;
};

export type TCards = {
  types: TIngredientType[];
  typesItem: string;
  data: TIngredient[];
  handleIngredientClick: (card: TIngredient) => void;
};

export type TCard = {
  card: TIngredient;
  data: TIngredient[];
  handleIngredientClick: (card: TIngredient) => void;
};

export type TIngredientType = {
  type: string;
  text: string;
};

export type TConstructorIngredient = TIngredient & {
  uniqueId: string;
};

export type TPasswordReset = {
  email?: string;
  success: boolean;
  message?: string;
};

export type TUser = {
  email: string;
  name: string;
};

export type TTokenResponse = {
  success: boolean;
  accessToken: string;
  refreshToken: string;
};

export type TAuthResponse = TTokenResponse & {
  user: TUser;
};

export type TLogoutResponse = {
  success: boolean;
  message: string;
};
export type TAuthState = {
  user: TUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
  authChecked: boolean;
};

export type TLocationState = {
  background?: Location;
  from?: string;
};

export type TDragItem = {
  index: number;
  id: string;
  type: string;
};

export type TDroppedItem = {
  ingredient: TConstructorIngredient;
};

export type TIngredientCardProps = {
  ingredient: TConstructorIngredient;
  deleteElement: (ingredient: TConstructorIngredient) => void;
  index: number;
  moveIngredient: (from: number, to: number) => void;
};

// Общие типы для Redux store

// Типы для статусов загрузки
export type LoadingStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

// Тип для базового состояния с загрузкой
export type BaseState = {
  status: LoadingStatus;
  error: string | null;
};

// Тип для асинхронных операций
export type AsyncState = BaseState & {
  loading: boolean;
};

// Типы для ошибок
export type ApiError = {
  message: string;
  status?: number;
};

// Серилизованная ошибка от createAsyncThunk
export type SerializedError = {
  name?: string;
  message?: string;
  stack?: string;
  code?: string;
};

// Типы для состояния конструктора
export type ConstructorState = {
  buns: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

// Состояние ингредиентов
export type IngredientsState = {
  items: TIngredient[];
  status: LoadingStatus;
  error: string | null;
  counters: Record<string, number>;
};

// Состояние заказа
export type OrderState = {
  number: number | null;
  status: LoadingStatus;
  error: string | null;
  selectedOrder?: TOrder | null;
};

export type TOrder = {
  _id: string;
  ingredients: string[];
  status: TOrderStatus;
  name: string;
  createdAt: string;
  updatedAt?: string;
  number: number;
};
