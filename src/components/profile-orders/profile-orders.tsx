import { type RootState, useAppDispatch, useAppSelector } from '@/services';
import { fetchIngredients } from '@/services/ingredientsSlice';
import { memo, useEffect } from 'react';

import OrderCards from '@components/order-cards/order-cards';

import type { JSX } from 'react';

import styles from './profile-orders.module.css';

const ProfileOrders = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const ingredients = useAppSelector((s: RootState) => s.ingredients.items);

  // Загружаем ингредиенты при монтировании компонента (нужны для отображения заказов)
  useEffect(() => {
    if (ingredients.length === 0) {
      void dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length]);

  return (
    <section className={styles.mainWrap}>
      <OrderCards mode="profile" showStatus={true} />
    </section>
  );
};

export default memo(ProfileOrders);
