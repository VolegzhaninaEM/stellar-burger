import {
  CurrencyIcon,
  FormattedDate,
} from '@krgaa/react-developer-burger-ui-components';
import { memo, useMemo } from 'react';

import type { TIngredient } from '../../utils/types';
import type { JSX } from 'react';

import styles from './order-card.module.css';

// Типы для заказа
export type TOrderStatus = 'done' | 'pending' | 'created';

export type TOrder = {
  _id: string;
  ingredients: string[];
  status: TOrderStatus;
  name: string;
  createdAt: string;
  updatedAt: string;
  number: number;
};

type OrderCardProps = {
  order: TOrder;
  ingredients: TIngredient[];
  onClick?: (order: TOrder) => void;
  showStatus?: boolean;
};

const OrderCard = ({
  order,
  ingredients,
  onClick,
  showStatus = true,
}: OrderCardProps): JSX.Element => {
  // Получаем детали ингредиентов заказа
  const orderIngredients = useMemo(() => {
    return order.ingredients
      .map((id) => ingredients.find((ingredient) => ingredient._id === id))
      .filter(Boolean) as TIngredient[];
  }, [order.ingredients, ingredients]);

  // Подсчитываем общую стоимость заказа
  const totalPrice = useMemo(() => {
    return orderIngredients.reduce((sum, ingredient) => sum + ingredient.price, 0);
  }, [orderIngredients]);

  // Получаем уникальные ингредиенты для отображения
  const uniqueIngredients = useMemo(() => {
    const ingredientCounts = new Map<
      string,
      { ingredient: TIngredient; count: number }
    >();

    orderIngredients.forEach((ingredient) => {
      const existing = ingredientCounts.get(ingredient._id);
      if (existing) {
        existing.count += 1;
      } else {
        ingredientCounts.set(ingredient._id, { ingredient, count: 1 });
      }
    });

    return Array.from(ingredientCounts.values());
  }, [orderIngredients]);

  // Получаем статус заказа
  const getStatusText = (status: TOrderStatus): string => {
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

  const getStatusClass = (status: TOrderStatus): string => {
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

  const handleClick = (): void => {
    if (onClick) {
      onClick(order);
    }
  };

  const zIndex = (index: number | null): string => {
    return index === 0
      ? '10'
      : index === 1
        ? '9'
        : index === 2
          ? '8'
          : index === 3
            ? '7'
            : index === 4
              ? '6'
              : index === 5
                ? '5'
                : '1';
  };

  // Ограничиваем количество отображаемых ингредиентов до 6
  const visibleIngredients = uniqueIngredients.slice(0, 6);
  const hiddenCount = uniqueIngredients.length - 6;

  return (
    <section className={styles.container} onClick={handleClick}>
      <div className={styles.header}>
        <p className="text text_type_digits-default">#{order.number}</p>
        <FormattedDate
          className="text text_type_main-default text_color_inactive"
          date={new Date(order.createdAt)}
        />
      </div>

      <h3 className="text text_type_main-medium">{order.name}</h3>

      {showStatus && (
        <p
          className={`text text_type_main-small ${styles.orderStatus} ${getStatusClass(order.status)}`}
        >
          {getStatusText(order.status)}
        </p>
      )}

      <div className={styles.footer}>
        <div className={styles.ingredientsImages}>
          {visibleIngredients.map((item, index) => {
            const isLast = index === 5 && hiddenCount > 0;
            return (
              <div
                key={`${item.ingredient._id}-${index}`}
                className={styles.imgCircle}
                style={{ zIndex: zIndex(index) }}
              >
                <div className={styles.backgroundCircle}>
                  <div
                    className={styles.ingredientImage}
                    style={{
                      backgroundImage: `url(${item.ingredient.image || item.ingredient.image_mobile})`,
                    }}
                  >
                    {isLast && (
                      <div className={styles.ingredientCounter}>+{hiddenCount}</div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.price}>
          <span className="text text_type_digits-default">{totalPrice}</span>
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </section>
  );
};

export default memo(OrderCard);
