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

export type TApiError = {
  message?: string;
};

export type TConstructorIngredient = TIngredient & {
  uniqueId: string;
};
