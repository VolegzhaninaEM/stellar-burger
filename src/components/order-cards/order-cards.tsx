import { memo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import OrderCard from '../order-card/order-card';

import type { TIngredient } from '../../utils/types';
import type { TOrder } from '../order-card/order-card';
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
  const location = useLocation();
  const navigate = useNavigate();

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

  // Мокированные ингредиенты для демонстрации
  const mockIngredients: TIngredient[] = [
    {
      _id: 'ingredient1',
      name: 'Краторная булка N-200i',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'https://code.s3.yandex.net/react/code/bun-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
      __v: 0,
    },
    {
      _id: 'ingredient2',
      name: 'Биокотлета из марсианской Магнолии',
      type: 'main',
      proteins: 420,
      fat: 142,
      carbohydrates: 242,
      calories: 4242,
      price: 424,
      image: 'https://code.s3.yandex.net/react/code/meat-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
      __v: 0,
    },
    {
      _id: 'ingredient3',
      name: 'Соус Spicy-X',
      type: 'sauce',
      proteins: 30,
      fat: 20,
      carbohydrates: 40,
      calories: 30,
      price: 90,
      image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
      __v: 0,
    },
  ];

  // Конвертируем MockOrder в TOrder
  const convertToTOrder = (mockOrder: MockOrder): TOrder => ({
    _id: mockOrder.id,
    ingredients: mockOrder.ingredients,
    status: mockOrder.status as TOrder['status'],
    name: mockOrder.name,
    createdAt: mockOrder.createdAt,
    updatedAt: mockOrder.createdAt,
    number: parseInt(mockOrder.number),
  });

  const handleOrderClick = useCallback(
    (order: TOrder): void => {
      void navigate(`/feed/${order._id}`, {
        state: { background: location.pathname },
      });
    },
    [navigate, location]
  );

  return (
    <div className={styles.container}>
      {mockOrders.map((order) => {
        const tOrder = convertToTOrder(order);
        return (
          <OrderCard
            key={order.id}
            order={tOrder}
            ingredients={mockIngredients}
            onClick={handleOrderClick}
            showStatus={true}
          />
        );
      })}
    </div>
  );
};

export default memo(OrderCards);
