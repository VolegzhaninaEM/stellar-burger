import type { TOrder, TIngredient } from '../utils/types';

/**
 * Подсчитывает общую стоимость заказа на основе его ингредиентов
 * @param order - объект заказа
 * @param ingredients - массив всех доступных ингредиентов
 * @returns общая стоимость заказа
 */
export const calculateOrderPrice = (
  order: TOrder,
  ingredients: TIngredient[]
): number => {
  if (!order?.ingredients || !ingredients.length) {
    return 0;
  }

  return order.ingredients.reduce((totalPrice, ingredientId) => {
    const ingredient = ingredients.find((ingredient) => ingredient._id === ingredientId);

    if (!ingredient) {
      return totalPrice;
    }

    // Для булочек (bun) цена удваивается, так как булочка состоит из верхней и нижней части
    const price = ingredient.type === 'bun' ? ingredient.price * 2 : ingredient.price;

    return totalPrice + price;
  }, 0);
};

/**
 * Получает уникальные ингредиенты заказа с их количеством
 * @param order - объект заказа
 * @param ingredients - массив всех доступных ингредиентов
 * @returns массив уникальных ингредиентов с количеством
 */
export const getOrderIngredients = (
  order: TOrder,
  ingredients: TIngredient[]
): { ingredient: TIngredient; count: number }[] => {
  if (!order?.ingredients || !ingredients.length) {
    return [];
  }

  const ingredientCounts = new Map<string, { ingredient: TIngredient; count: number }>();

  order.ingredients.forEach((ingredientId) => {
    const ingredient = ingredients.find((ing) => ing._id === ingredientId);

    if (ingredient) {
      const existing = ingredientCounts.get(ingredient._id);
      if (existing) {
        existing.count += 1;
      } else {
        ingredientCounts.set(ingredient._id, { ingredient, count: 1 });
      }
    }
  });

  return Array.from(ingredientCounts.values());
};
