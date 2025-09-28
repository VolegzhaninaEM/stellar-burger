import {
  useAppSelector,
  selectFeedOrders,
  selectFeedTotal,
  selectFeedTotalToday,
} from '@/services';
import { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';

import type { TOrder } from '../order-card/order-card';
import type { JSX } from 'react';

import styles from './orders-status.module.css';

const OrdersStatus = (): JSX.Element => {
  // Получаем данные из Redux store
  const orders = useAppSelector(selectFeedOrders);
  const total = useAppSelector(selectFeedTotal);
  const totalToday = useAppSelector(selectFeedTotalToday);

  // Разделяем заказы по статусу
  const { readyOrders, inProgressOrders } = useMemo(() => {
    const ready: TOrder[] = [];
    const inProgress: TOrder[] = [];

    orders.forEach((order) => {
      if (order.status === 'done') {
        ready.push(order);
      } else if (order.status === 'pending' || order.status === 'created') {
        inProgress.push(order);
      }
    });

    return {
      readyOrders: ready.slice(0, 20), // Показываем максимум 20 заказов
      inProgressOrders: inProgress.slice(0, 20),
    };
  }, [orders]);

  return (
    <div className={styles.container}>
      {/* Секция готовых и в работе заказов */}
      <div className={styles.ordersSection}>
        <div className={styles.ordersColumn}>
          <h3
            className={`${styles.columnTitle} ${styles.readyTitle} text text_type_main-medium mb-6`}
          >
            Готовы:
          </h3>
          <div className={styles.ordersList}>
            {readyOrders.length > 0 ? (
              readyOrders.map((order) => (
                <Link
                  key={order._id}
                  to={`/feed/${order._id}`}
                  className={`${styles.orderNumber} ${styles.readyOrder} text text_type_digits-default`}
                >
                  {order.number}
                </Link>
              ))
            ) : (
              <span className="text text_type_main-default text_color_inactive">
                Нет готовых заказов
              </span>
            )}
          </div>
        </div>

        <div className={styles.ordersColumn}>
          <h3
            className={`${styles.columnTitle} ${styles.inProgressTitle} text text_type_main-medium mb-6`}
          >
            В работе:
          </h3>
          <div className={styles.ordersList}>
            {inProgressOrders.length > 0 ? (
              inProgressOrders.map((order) => (
                <Link
                  key={order._id}
                  to={`/feed/${order._id}`}
                  className={`${styles.orderNumber} ${styles.processOrder} text text_type_digits-default`}
                >
                  {order.number}
                </Link>
              ))
            ) : (
              <span className="text text_type_main-default text_color_inactive">
                Нет заказов в работе
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Секция статистики */}
      <div className={styles.statisticsSection}>
        <div className={styles.statisticItem}>
          <h3 className={`${styles.statisticTitle} text text_type_main-medium`}>
            Выполнено за всё время:
          </h3>
          <p
            className={`${styles.statisticValue} ${styles.totalCompleted} text text_type_digits-large`}
          >
            {total.toLocaleString()}
          </p>
        </div>

        <div className={styles.statisticItem}>
          <h3 className={`${styles.statisticTitle} text text_type_main-medium`}>
            Выполнено за сегодня:
          </h3>
          <p
            className={`${styles.statisticValue} ${styles.todayCompleted} text text_type_digits-large`}
          >
            {totalToday.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default memo(OrdersStatus);
