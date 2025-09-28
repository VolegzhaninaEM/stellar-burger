import { useAppDispatch, fetchIngredients } from '@/services';
import { memo, useEffect } from 'react';

import ProfileOrderCards from '@components/profile-order-cards/profile-order-cards';

import type { JSX } from 'react';

import styles from './profile-orders.module.css';

export const ProfileOrders = (): JSX.Element => {
  const dispatch = useAppDispatch();

  // Загружаем ингредиенты при монтировании компонента
  useEffect(() => {
    void dispatch(fetchIngredients());
  }, [dispatch]);

  return (
    <section className={styles.mainWrap}>
      <ProfileOrderCards />
    </section>
  );
};

export default memo(ProfileOrders);
