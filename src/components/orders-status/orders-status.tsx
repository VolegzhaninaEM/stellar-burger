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

  // Разделяем заказы по статусу и группируем по колонкам (максимум 10 в колонке)
  const { readyOrderColumns, inProgressOrderColumns } = useMemo(() => {
    const ready: TOrder[] = [];
    const inProgress: TOrder[] = [];

    orders.forEach((order) => {
      if (order.status === 'done') {
        ready.push(order);
      } else if (order.status === 'pending' || order.status === 'created') {
        inProgress.push(order);
      }
    });

    // Разбиваем заказы по колонкам (максимум 10 в каждой колонке)
    const ORDERS_PER_COLUMN = 10;

    const readyColumns: TOrder[][] = [];
    for (let i = 0; i < ready.length; i += ORDERS_PER_COLUMN) {
      readyColumns.push(ready.slice(i, i + ORDERS_PER_COLUMN));
    }

    const inProgressColumns: TOrder[][] = [];
    for (let i = 0; i < inProgress.length; i += ORDERS_PER_COLUMN) {
      inProgressColumns.push(inProgress.slice(i, i + ORDERS_PER_COLUMN));
    }

    return {
      readyOrderColumns: readyColumns,
      inProgressOrderColumns: inProgressColumns,
    };
  }, [orders]);

  // Функция для рендеринга колонки заказов
  const renderOrderColumn = (
    orders: TOrder[],
    title: string,
    titleClass: string,
    orderClass: string,
    showTitle = false
  ): JSX.Element => (
    <div className={styles.ordersColumn} key={`${title}-${orders[0]?._id || 'empty'}`}>
      {showTitle && (
        <h3
          className={`${styles.columnTitle} ${titleClass} text text_type_main-medium mb-6`}
        >
          {title}
        </h3>
      )}
      <div className={styles.ordersList}>
        {orders.length > 0 ? (
          orders.map((order) => (
            <Link
              key={order._id}
              to={`/feed/${order._id}`}
              className={`${styles.orderNumber} ${orderClass} text text_type_digits-default`}
            >
              {order.number}
            </Link>
          ))
        ) : showTitle ? (
          <span className="text text_type_main-default text_color_inactive">
            {title.includes('Готовы') ? 'Нет готовых заказов' : 'Нет заказов в работе'}
          </span>
        ) : null}
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      {/* Секция готовых и в работе заказов */}
      <div className={styles.ordersSection}>
        {/* Колонки с готовыми заказами */}
        {readyOrderColumns.length > 0 ? (
          readyOrderColumns.map((columnOrders, index) =>
            renderOrderColumn(
              columnOrders,
              'Готовы:',
              styles.readyTitle,
              styles.readyOrder,
              index === 0 // Показываем заголовок только в первой колонке
            )
          )
        ) : (
          <div className={styles.ordersColumn}>
            <h3
              className={`${styles.columnTitle} ${styles.readyTitle} text text_type_main-medium mb-6`}
            >
              Готовы:
            </h3>
            <div className={styles.ordersList}>
              <span className="text text_type_main-default text_color_inactive">
                Нет готовых заказов
              </span>
            </div>
          </div>
        )}

        {/* Колонки с заказами в работе */}
        {inProgressOrderColumns.length > 0 ? (
          inProgressOrderColumns.map((columnOrders, index) =>
            renderOrderColumn(
              columnOrders,
              'В работе:',
              styles.inProgressTitle,
              styles.processOrder,
              index === 0 // Показываем заголовок только в первой колонке
            )
          )
        ) : (
          <div className={styles.ordersColumn}>
            <h3
              className={`${styles.columnTitle} ${styles.inProgressTitle} text text_type_main-medium mb-6`}
            >
              В работе:
            </h3>
            <div className={styles.ordersList}>
              <span className="text text_type_main-default text_color_inactive">
                Нет заказов в работе
              </span>
            </div>
          </div>
        )}
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
