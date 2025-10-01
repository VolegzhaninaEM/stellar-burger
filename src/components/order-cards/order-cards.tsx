import {
  useAppSelector,
  selectFeedOrders,
  selectFeedIsConnected,
  selectFeedError,
  selectIngredients,
  selectProfileOrders,
  selectProfileOrdersIsConnected,
  selectProfileOrdersError,
} from '@/services';
import { memo, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import OrderCard from '../order-card/order-card';

import type { TOrder } from '../../utils/types';
import type { JSX } from 'react';

import styles from './order-cards.module.css';

type OrderCardsProps = {
  /** Режим работы: 'feed' для ленты заказов, 'profile' для заказов профиля */
  mode: 'feed' | 'profile';
  /** Показывать ли статус заказа */
  showStatus?: boolean;
};

const OrderCards = ({ mode, showStatus = false }: OrderCardsProps): JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();

  // Получаем данные в зависимости от режима
  const orders = useAppSelector(
    mode === 'feed' ? selectFeedOrders : selectProfileOrders
  );
  const ingredients = useAppSelector(selectIngredients);
  const isConnected = useAppSelector(
    mode === 'feed' ? selectFeedIsConnected : selectProfileOrdersIsConnected
  );
  const error = useAppSelector(
    mode === 'feed' ? selectFeedError : selectProfileOrdersError
  );

  const handleOrderClick = useCallback(
    (order: TOrder): void => {
      const path =
        mode === 'feed' ? `/feed/${order._id}` : `/profile/orders/${order._id}`;

      void navigate(path, {
        state: { background: location },
      });
    },
    [navigate, location, mode]
  );

  // Мемоизируем список заказов
  const orderElements = useMemo(() => {
    let sortedOrders = [...orders];

    if (mode === 'feed') {
      // Для ленты сортируем по дате создания (новые в начале)
      sortedOrders = sortedOrders.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else {
      // Для профиля реверсируем (последние заказы вверху)
      sortedOrders = sortedOrders.reverse();
    }

    return sortedOrders.map((order) => (
      <OrderCard
        key={order._id}
        order={order}
        ingredients={ingredients}
        onClick={handleOrderClick}
        showStatus={showStatus}
      />
    ));
  }, [orders, ingredients, handleOrderClick, showStatus, mode]);

  // Показываем ошибку
  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <div className="text text_type_main-medium mb-4">
            {mode === 'feed'
              ? 'Не удалось загрузить ленту заказов'
              : 'Ошибка загрузки заказов'}
          </div>
          <div className="text text_type_main-default text_color_inactive mb-6">
            {error}
          </div>
        </div>
      </div>
    );
  }

  // Показываем загрузку
  if (!isConnected && orders.length === 0) {
    return (
      <div className={styles.container}>
        <div className="text text_type_main-medium text_color_inactive">
          {mode === 'feed'
            ? 'Загрузка ленты заказов...'
            : 'Подключение к серверу заказов...'}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {orders.length > 0 ? (
        orderElements
      ) : isConnected ? (
        <div className={styles.errorState}>
          <div className="text text_type_main-medium text_color_inactive mb-2">
            {mode === 'feed' ? 'Заказы не найдены' : 'У вас пока нет заказов'}
          </div>
          <div className="text text_type_main-default text_color_inactive">
            {mode === 'feed'
              ? 'Попробуйте обновить страницу'
              : 'Перейдите на главную страницу, чтобы собрать свой первый бургер'}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default memo(OrderCards);
