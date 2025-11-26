import doneImage from '../../images/order-accepted-done.svg';

import type { LoadingStatus } from '@utils/types';
import type { FC, JSX } from 'react';

import styles from './order-details.module.css';

type TOrderDetailsProps = {
  orderNumber: number | null;
  status?: LoadingStatus;
  error?: string | null;
};

const OrderDetails: FC<TOrderDetailsProps> = ({
  orderNumber,
  status = 'idle',
  error,
}): JSX.Element => {
  // Если идет загрузка
  if (status === 'loading') {
    return (
      <div className={`${styles.wrap} pt-30 pb-30`} data-cy="order-details-loading">
        <div className={`${styles.title} text text_type_digits-large mb-8`}>
          <div className="loader" data-cy="order-loading-spinner">
            ...
          </div>
        </div>
        <p className="text text_type_main-medium" data-cy="order-loading-message">
          Создаем заказ...
        </p>
        <p
          className="text text_type_main-small mb-2 mt-15"
          data-cy="order-loading-submessage"
        >
          Пожалуйста, подождите
        </p>
      </div>
    );
  }

  // Если есть ошибка
  if (error || status === 'failed') {
    return (
      <div className={`${styles.wrap} pt-30 pb-30`} data-cy="order-details-error">
        <p
          className={`${styles.title} text text_type_main-large mb-8 text_color_error`}
          data-cy="order-error-title"
        >
          Ошибка
        </p>
        <p className="text text_type_main-medium mb-8" data-cy="order-error-message">
          {error ?? 'Не удалось создать заказ'}
        </p>
        <p
          className="text text_type_main-small text_color_inactive"
          data-cy="order-error-hint"
        >
          Попробуйте еще раз
        </p>
      </div>
    );
  }

  // Если заказ успешно создан
  if (orderNumber && status === 'succeeded') {
    return (
      <div className={`${styles.wrap} pt-30 pb-30`} data-cy="order-details-success">
        <p
          className={`${styles.title} text text_type_digits-large mb-8`}
          data-cy="order-number"
        >
          {orderNumber}
        </p>
        <p className="text text_type_main-medium" data-cy="order-number-label">
          идентификатор заказа
        </p>
        <img
          className="mt-15 mb-15"
          src={doneImage}
          alt="Заказ оформлен"
          data-cy="order-success-image"
        />
        <p className="text text_type_main-small mb-2" data-cy="order-success-message">
          Ваш заказ начали готовить
        </p>
        <p
          className="text text_type_main-default text_color_inactive"
          data-cy="order-success-submessage"
        >
          Дождитесь готовности на орбитальной станции
        </p>
      </div>
    );
  }

  // Fallback для неожиданных состояний
  return (
    <div className={`${styles.wrap} pt-30 pb-30`} data-cy="order-details-fallback">
      <p className="text text_type_main-medium" data-cy="order-fallback-message">
        Что-то пошло не так
      </p>
    </div>
  );
};

export default OrderDetails;
