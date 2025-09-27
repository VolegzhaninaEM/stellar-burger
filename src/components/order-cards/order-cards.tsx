import { CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { memo } from 'react';

import type { JSX } from 'react';

import styles from './order-cards.module.css';

// Временные типы для демонстрации
type OrderStatus = 'done' | 'pending' | 'created';

type MockOrder = {
  id: string;
  number: string;
  name: string;
  status: OrderStatus;
  createdAt: string;
  ingredients: string[];
  price: number;
};

const OrderCards = (): JSX.Element => {
  // Мокированные данные для демонстрации
  const mockOrders: MockOrder[] = [
    {
      id: '1',
      number: '034536',
      name: 'Краторный бургер',
      status: 'done',
      createdAt: '2025-09-27T10:30:00Z',
      ingredients: ['ingredient1', 'ingredient2', 'ingredient3'],
      price: 1255,
    },
    {
      id: '2',
      number: '034535',
      name: 'Флюоресцентный люминесцентный бургер',
      status: 'pending',
      createdAt: '2025-09-27T09:25:00Z',
      ingredients: ['ingredient1', 'ingredient2', 'ingredient3', 'ingredient4'],
      price: 988,
    },
    {
      id: '3',
      number: '034534',
      name: 'Био-марсианский бургер',
      status: 'created',
      createdAt: '2025-09-27T08:15:00Z',
      ingredients: ['ingredient1', 'ingredient2'],
      price: 1644,
    },
    {
      id: '4',
      number: '034533',
      name: 'Антарианский астро-бургер',
      status: 'done',
      createdAt: '2025-09-27T07:45:00Z',
      ingredients: [
        'ingredient1',
        'ingredient2',
        'ingredient3',
        'ingredient4',
        'ingredient5',
      ],
      price: 2100,
    },
    {
      id: '5',
      number: '034532',
      name: 'Традиционный галактический бургер',
      status: 'pending',
      createdAt: '2025-09-27T07:20:00Z',
      ingredients: ['ingredient1', 'ingredient2', 'ingredient3'],
      price: 1455,
    },
    {
      id: '6',
      number: '034531',
      name: 'Экзо-плазменный бургер',
      status: 'created',
      createdAt: '2025-09-27T06:55:00Z',
      ingredients: [
        'ingredient1',
        'ingredient2',
        'ingredient3',
        'ingredient4',
        'ingredient5',
        'ingredient6',
        'ingredient7',
      ],
      price: 1876,
    },
    {
      id: '7',
      number: '034530',
      name: 'Метеоритный мега-бургер',
      status: 'done',
      createdAt: '2025-09-27T06:30:00Z',
      ingredients: ['ingredient1', 'ingredient2'],
      price: 999,
    },
    {
      id: '8',
      number: '034529',
      name: 'Звездный деликатес',
      status: 'pending',
      createdAt: '2025-09-27T06:05:00Z',
      ingredients: ['ingredient1', 'ingredient2', 'ingredient3', 'ingredient4'],
      price: 1333,
    },
  ];

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'менее часа назад';
    if (diffInHours < 24)
      return `${diffInHours} ${diffInHours === 1 ? 'час' : 'часов'} назад`;
    const days = Math.floor(diffInHours / 24);
    return `${days} ${days === 1 ? 'день' : 'дней'} назад`;
  };

  const getStatusText = (status: OrderStatus): string => {
    switch (status) {
      case 'done':
        return 'Выполнен';
      case 'pending':
        return 'Готовится';
      case 'created':
        return 'Создан';
      default:
        return 'Неизвестно';
    }
  };

  const getStatusClass = (status: OrderStatus): string => {
    switch (status) {
      case 'done':
        return styles.statusDone || '';
      case 'pending':
        return styles.statusPending || '';
      case 'created':
        return styles.statusCreated || '';
      default:
        return styles.statusCreated || '';
    }
  };

  const handleOrderClick = (orderId: string): void => {
    console.log('Clicked order:', orderId);
    // Здесь будет логика перехода к деталям заказа
  };

  return (
    <div className={styles.container}>
      {mockOrders.map((order) => (
        <div
          key={order.id}
          className={styles.orderCard}
          onClick={() => handleOrderClick(order.id)}
        >
          <div className={styles.orderHeader}>
            <span className={styles.orderNumber}>#{order.number}</span>
            <span className={styles.orderTime}>{formatTime(order.createdAt)}</span>
          </div>

          <h3 className={styles.orderName}>{order.name}</h3>

          <div className={`${styles.orderStatus || ''} ${getStatusClass(order.status)}`}>
            {getStatusText(order.status)}
          </div>

          <div className={styles.orderFooter}>
            <div className={styles.ingredientsPreview}>
              {/* Показываем первые 6 ингредиентов */}
              {order.ingredients.slice(0, 6).map((_ingredient, index) => {
                const isLast = index === 5 && order.ingredients.length > 6;
                const remainingCount = order.ingredients.length - 6;

                return (
                  <div
                    key={`${order.id}-${index}`}
                    className={styles.ingredientImage}
                    style={{
                      backgroundImage: `url(https://code.s3.yandex.net/react/code/meat-02.png)`,
                      zIndex: (10 - index).toString(),
                    }}
                  >
                    {isLast && remainingCount > 0 && (
                      <div className={styles.ingredientCounter}>+{remainingCount}</div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className={styles.orderPrice}>
              <span>{order.price}</span>
              <CurrencyIcon type="primary" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default memo(OrderCards);
