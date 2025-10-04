// Константы селекторов для Cypress тестов
export const SELECTORS = {
  // Ингредиенты
  INGREDIENT_BUN: '[data-cy="ingredient-bun"]',
  INGREDIENT_MAIN: '[data-cy="ingredient-main"]',
  INGREDIENT_SAUCE: '[data-cy="ingredient-sauce"]',
  INGREDIENT_ITEM: '[data-testid="ingredient-item"]',

  // Конструктор бургера
  BURGER_CONSTRUCTOR: '[data-cy="burger-constructor"]',
  CONSTRUCTOR_BUN_TOP: '[data-cy="constructor-bun-top"]',
  CONSTRUCTOR_BUN_BOTTOM: '[data-cy="constructor-bun-bottom"]',
  CONSTRUCTOR_INGREDIENTS: '[data-cy="constructor-ingredients"]',
  ORDER_BUTTON: '[data-cy="order-button"]',

  // Модальное окно
  MODAL: '[data-cy="modal"]',
  MODAL_OVERLAY: '[data-cy="modal-overlay"]',
  MODAL_CLOSE_BUTTON: '[data-cy="modal-close-button"]',

  // Детали ингредиента
  INGREDIENT_DETAILS: '[data-cy="ingredient-details"]',
  INGREDIENT_DETAILS_TITLE: '[data-cy="ingredient-details-title"]',
  INGREDIENT_DETAILS_NAME: '[data-cy="ingredient-details-name"]',
  INGREDIENT_DETAILS_IMAGE: '[data-cy="ingredient-details-image"]',
  INGREDIENT_DETAILS_NUTRITION: '[data-cy="ingredient-details-nutrition"]',

  // Пищевая ценность
  NUTRITION_CALORIES: '[data-cy="nutrition-calories"]',
  NUTRITION_PROTEINS: '[data-cy="nutrition-proteins"]',
  NUTRITION_FATS: '[data-cy="nutrition-fats"]',
  NUTRITION_CARBOHYDRATES: '[data-cy="nutrition-carbohydrates"]',
} as const;
