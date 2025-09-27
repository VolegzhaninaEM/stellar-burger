import { memo } from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import type { JSX } from 'react';

import styles from './orders-status.module.css';

// Типы для объекта заказа
type OrderItem = {
  _id: string;
  number: string;
};

// Типы для компонента статистики заказов
type OrderStatusProps = {
  readyOrders?: OrderItem[];
  inProgressOrders?: OrderItem[];
  totalCompleted?: number;
  todayCompleted?: number;
};

const OrdersStatus = ({
  readyOrders = [
    { _id: '1', number: '034536' },
    { _id: '2', number: '034535' },
    { _id: '3', number: '034534' },
    { _id: '4', number: '034533' },
    { _id: '5', number: '034532' },
  ],
  inProgressOrders = [
    { _id: '6', number: '034531' },
    { _id: '7', number: '034530' },
    { _id: '8', number: '034529' },
    { _id: '9', number: '034528' },
  ],
  totalCompleted = 12847,
  todayCompleted = 47,
}: OrderStatusProps): JSX.Element => {
  return (
    <section className={styles.container}>
      {/* Секция с готовыми заказами и заказами в работе */}
      <div className={styles.ordersSection}>
        {/* Колонка готовых заказов */}
        <div className={styles.ordersColumn}>
          <h3 className="text text_type_main-medium mb-6">Готовы:</h3>
          <div className={styles.ordersList}>
            {readyOrders.map((item) => (
              <Link
                key={uuidv4()}
                className={`${styles.orderNumber} ${styles.readyOrder} text text_type_digits-default`}
                to={`/feed/${item._id}`}
              >
                {item.number}
              </Link>
            ))}
          </div>
        </div>

        {/* Колонка заказов в работе */}
        <div className={styles.ordersColumn}>
          <h3 className="text text_type_main-medium mb-6">В работе:</h3>
          <div className={styles.ordersList}>
            {inProgressOrders.map((item) => (
              <Link
                key={uuidv4()}
                className={`${styles.orderNumber} ${styles.processOrder} text text_type_digits-default`}
                to={`/feed/${item._id}`}
              >
                {item.number}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Секция со статистикой */}
      <div className={styles.statisticsSection}>
        <div className={`${styles.statisticItem} ${styles.totalCompleted}`}>
          <h3 className="text text_type_main-medium">Выполнено за все время:</h3>
          <div className="text text_type_digits-large">
            {totalCompleted.toLocaleString('ru-RU')}
          </div>
        </div>

        <div className={`${styles.statisticItem} ${styles.todayCompleted}`}>
          <h3 className="text text_type_main-medium">Выполнено за сегодня:</h3>
          <div className="text text_type_digits-large">{todayCompleted}</div>
        </div>
      </div>
    </section>
  );
};

export default memo(OrdersStatus);
