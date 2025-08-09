export const ingredientTypes = [
  { type: 'bun', text: 'Булки' },
  { type: 'main', text: 'Начинки' },
  { type: 'sauce', text: 'Соусы' },
];

export const apiConfig = {
  baseUrl: 'https://norma.nomoreparties.space/api',
  headers: {
    authorization: '',
    'Content-Type': 'application/json',
  },
};

export enum ROUTES {
  HOME = '/',
  LOGIN = '/login',
  REGISTER = '/register',
  FORGOT_PASSWORD = '/forgot-password',
  RESET_PASSWORD = '/reset-password',
  PROFILE = '/profile',
  INGREDIENTS = '/ingredients/:id',
}
