import { memo } from 'react';
import { useParams } from 'react-router-dom';

import OrderInfo from '../../components/order-info/order-info';
import { useAppSelector } from '../../services/hooks';

import type { TOrder } from '../../components/order-card/order-card';
import type { JSX } from 'react';

import styles from './profile-order-page.module.css';

const ProfileOrderPage = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const ingredients = useAppSelector((state) => state.ingredients.items);

  // В реальном приложении здесь будет запрос к API за конкретным заказом пользователя
  // Пока используем мокированные данные
  const mockOrder: TOrder | undefined = id
    ? {
        _id: id,
        ingredients: ['ingredient1', 'ingredient2', 'ingredient3'],
        status: 'done',
        name: 'Краторный бургер',
        createdAt: '2025-09-27T10:30:00Z',
        updatedAt: '2025-09-27T10:30:00Z',
        number: parseInt('034536'),
      }
    : undefined;

  return (
    <div className={styles.container}>
      <OrderInfo order={mockOrder} ingredients={ingredients} showStatus={true} />
    </div>
  );
};

export default memo(ProfileOrderPage);
