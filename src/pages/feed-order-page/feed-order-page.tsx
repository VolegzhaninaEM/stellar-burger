import { memo, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { feedConnect } from '../../services/feedSlice';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import OrderInfo from '@components/order-info/order-info';

import type { RootState } from '@services/store';
import type { JSX } from 'react';

import styles from './feed-order-page.module.css';

const FeedOrderPage = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();

  // Получаем список всех ингредиентов
  const ingredients = useAppSelector((state: RootState) => state.ingredients.items);

  // Получаем список всех заказов
  const orders = useAppSelector((state: RootState) => state.feed.orders);

  // Находим заказ по id из URL параметра
  const currentOrder = orders.find((order) => order._id === id);

  // Статус WebSocket соединения
  const isConnected = useAppSelector((state: RootState) => state.feed.isConnected);

  // Подключаемся к WebSocket для получения заказов, если еще не подключены
  useEffect(() => {
    if (!isConnected) {
      dispatch(feedConnect());
    }
  }, [dispatch, isConnected]);

  // Отображаем загрузку, пока заказ не найден
  if (!currentOrder) {
    return (
      <div className={styles.container}>
        <div className="text text_type_main-medium">
          {orders.length > 0 ? 'Заказ не найден' : 'Загрузка заказа...'}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <OrderInfo order={currentOrder} ingredients={ingredients} showStatus={true} />
    </div>
  );
};

export default memo(FeedOrderPage);
