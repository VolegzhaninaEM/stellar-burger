import {
  CurrencyIcon,
  FormattedDate,
} from '@krgaa/react-developer-burger-ui-components';
import { memo, useMemo } from 'react';

import type { TIngredient } from '../../utils/types';
import type { TOrder } from '../order-card/order-card';
import type { JSX } from 'react';

import styles from './order-info.module.css';

type OrderInfoProps = {
  order?: TOrder;
  ingredients: TIngredient[];
  showStatus?: boolean;
};

const OrderInfo = ({
  order,
  ingredients,
  showStatus = true,
}: OrderInfoProps): JSX.Element => {
  // Получаем детали ингредиентов заказа
  const orderIngredients = useMemo(() => {
    if (!order) return [];
    return order.ingredients
      .map((id) => ingredients.find((ingredient) => ingredient._id === id))
      .filter(Boolean) as TIngredient[];
  }, [order?.ingredients, ingredients]);

  // Подсчитываем общую стоимость заказа
  const totalPrice = useMemo(() => {
    return orderIngredients.reduce((sum, ingredient) => sum + ingredient.price, 0);
  }, [orderIngredients]);

  // Получаем уникальные ингредиенты с количеством
  const ingredientCounts = useMemo(() => {
    const counts = new Map<string, { ingredient: TIngredient; count: number }>();

    orderIngredients.forEach((ingredient) => {
      const existing = counts.get(ingredient._id);
      if (existing) {
        existing.count += 1;
      } else {
        counts.set(ingredient._id, { ingredient, count: 1 });
      }
    });

    return Array.from(counts.values());
  }, [orderIngredients]);

  // Получаем статус заказа
  const getStatusText = (status: TOrder['status']): string => {
    switch (status) {
      case 'done':
        return 'Выполнен';
      case 'pending':
        return 'Готовится';
      case 'created':
        return 'Создан';
      default:
        return '';
    }
  };

  const getStatusClass = (status: TOrder['status']): string => {
    switch (status) {
      case 'done':
        return styles.statusDone;
      case 'pending':
        return styles.statusPending;
      case 'created':
        return styles.statusCreated;
      default:
        return '';
    }
  };

  if (!order) {
    return (
      <div className={styles.container}>
        <p className="text text_type_main-default">Заказ не найден</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <p className={`text text_type_digits-default mb-10 ${styles.orderNumber}`}>
          #{order.number}
        </p>
        <h2 className="text text_type_main-medium mb-3">{order.name}</h2>
        {showStatus && (
          <p
            className={`text text_type_main-small mb-15 ${getStatusClass(order.status)}`}
          >
            {getStatusText(order.status)}
          </p>
        )}
      </div>

      <div className={styles.composition}>
        <h3 className="text text_type_main-medium mb-6">Состав:</h3>
        <div className={styles.ingredients}>
          {ingredientCounts.map(({ ingredient, count }) => (
            <div key={ingredient._id} className={styles.ingredientItem}>
              <div className={styles.ingredientInfo}>
                <div className={styles.ingredientImageContainer}>
                  <img
                    src={ingredient.image}
                    alt={ingredient.name}
                    className={styles.ingredientImage}
                  />
                </div>
                <p className="text text_type_main-default ml-4">{ingredient.name}</p>
              </div>
              <div className={styles.ingredientPrice}>
                <span className="text text_type_digits-default mr-2">
                  {count} x {ingredient.price}
                </span>
                <CurrencyIcon type="primary" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.footer}>
        <FormattedDate
          className="text text_type_main-default text_color_inactive"
          date={new Date(order.createdAt)}
        />
        <div className={styles.totalPrice}>
          <span className="text text_type_digits-default mr-2">{totalPrice}</span>
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </div>
  );
};

export default memo(OrderInfo);
