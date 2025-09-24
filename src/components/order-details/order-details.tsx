import doneImage from '../../images/order-accepted-done.svg';

import type { FC, JSX } from 'react';

import styles from './order-details.module.css';

type TOrderDetailsProps = {
  orderNumber: number;
};

const OrderDetails: FC<TOrderDetailsProps> = ({ orderNumber }): JSX.Element => (
  <div className={`${styles.wrap} pt-30 pb-30`}>
    <p className={`${styles.title} text text_type_digits-large mb-8`}>{orderNumber}</p>

    <p className="text text_type_main-medium">идентификатор заказа</p>

    <img className="mt-15 mb-15" src={doneImage} alt="Заказ оформлен" />

    <p className="text text_type_main-small mb-2">Ваш заказ начали готовить</p>

    <p className="text text_type_main-default text_color_inactive">
      Дождитесь готовности на орбитальной станции
    </p>
  </div>
);

export default OrderDetails;
