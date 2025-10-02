import { useAppDispatch } from '@/services';
import {
  profileOrdersConnect,
  profileOrdersDisconnect,
} from '@/services/profileOrdersSlice';
import { WS_URLS } from '@/services/websocketInstances';
import { getCookie } from '@/utils/cookies';
import { memo, useEffect } from 'react';

import OrderCards from '@components/order-cards/order-cards';

import type { JSX } from 'react';

import styles from './profile-orders.module.css';

const ProfileOrders = (): JSX.Element => {
  const dispatch = useAppDispatch();

  // Управление WebSocket соединением для заказов профиля
  useEffect(() => {
    // Получаем токен для авторизированных заказов
    const accessToken = getCookie('accessToken');

    if (accessToken) {
      // Открываем соединение при входе на страницу
      dispatch(
        profileOrdersConnect({ url: WS_URLS.PROFILE_ORDERS, token: accessToken })
      );
    }

    // Закрываем соединение при покидании страницы
    return (): void => {
      dispatch(profileOrdersDisconnect());
    };
  }, [dispatch]);

  return (
    <section className={styles.mainWrap}>
      <OrderCards mode="profile" showStatus={true} />
    </section>
  );
};

export default memo(ProfileOrders);
