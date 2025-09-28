import { type RootState, useAppDispatch, useAppSelector } from '@/services';
import { fetchIngredients } from '@/services/ingredientsSlice';
import {
  profileOrdersConnect,
  profileOrdersDisconnected,
} from '@/services/profileOrdersSlice';
import { memo, useEffect } from 'react';

import ProfileOrderCards from '@components/profile-order-cards/profile-order-cards';

import type { JSX } from 'react';

import styles from './profile-orders.module.css';

const ProfileOrders = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const isAuth = useAppSelector((s: RootState) => s.auth.accessToken);
  const ingredients = useAppSelector((s: RootState) => s.ingredients.items);

  // Загружаем ингредиенты при монтировании компонента (нужны для отображения заказов)
  useEffect(() => {
    if (ingredients.length === 0) {
      void dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length]);

  // Подключаемся к WebSocket для получения заказов пользователя
  useEffect((): (() => void) | void => {
    if (isAuth) {
      console.log('🔌 Подключение к WebSocket для заказов профиля');
      dispatch(profileOrdersConnect());

      // Отключаемся при размонтировании компонента
      return (): void => {
        console.log('🔌 Отключение от WebSocket заказов профиля');
        dispatch(profileOrdersDisconnected());
      };
    }
  }, [dispatch, isAuth]);

  return (
    <section className={styles.mainWrap}>
      <ProfileOrderCards />
    </section>
  );
};

export default memo(ProfileOrders);
