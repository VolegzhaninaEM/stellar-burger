import {
  useAppSelector,
  selectProfileOrders,
  selectProfileOrdersIsConnected,
  selectProfileOrdersError,
  selectIngredients,
} from '@/services';
import { memo, useCallback, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import OrderCard from '../order-card/order-card';
import Modal from '@components/modal/modal';
import OrderInfo from '@components/order-info/order-info';

import type { TOrder } from '../order-card/order-card';
import type { JSX } from 'react';

import styles from './profile-order-cards.module.css';

const ProfileOrderCards = (): JSX.Element => {
  const [currentItem, setCurrentItem] = useState<TOrder | undefined>();
  const [isModalOpen, setModalState] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Получаем данные из Redux store для профиля
  const orders = useAppSelector(selectProfileOrders);
  const ingredients = useAppSelector(selectIngredients);
  const isConnected = useAppSelector(selectProfileOrdersIsConnected);
  const error = useAppSelector(selectProfileOrdersError);

  // Добавляем детальное логирование для отладки
  console.log('📊 ProfileOrderCards состояние:', {
    ordersCount: orders.length,
    isConnected,
    hasError: !!error,
    errorMessage: error,
    ingredientsCount: ingredients.length,
  });

  const handleCloseModal = useCallback((): void => {
    setModalState(false);
    setCurrentItem(undefined);
  }, []);

  const handleOrderClick = useCallback(
    (order: TOrder): void => {
      setCurrentItem(order);
      setModalState(true);
      void navigate(`/profile/orders/${order._id}`, {
        state: { background: location },
      });
    },
    [navigate, location]
  );

  // Мемоизируем список заказов с реверсом (последние заказы вверху, как в примере)
  const orderElements = useMemo(() => {
    const reversedOrders = [...orders].reverse();
    return reversedOrders.map((order) => (
      <OrderCard
        key={order._id}
        order={order}
        ingredients={ingredients}
        onClick={handleOrderClick}
        showStatus={true}
        extraClassName="mb-4"
      />
    ));
  }, [orders, ingredients, handleOrderClick]);

  // Показываем ошибку
  if (error) {
    return (
      <div className={styles.container}>
        <div className="text text_type_main-medium text_color_inactive">{error}</div>
        <div className="text text_type_main-default text_color_inactive mt-4">
          Проверьте авторизацию и повторите попытку
        </div>
      </div>
    );
  }

  // Показываем загрузку только если не подключены и нет заказов
  if (!isConnected && orders.length === 0) {
    return (
      <div className={styles.container}>
        <div className="text text_type_main-medium text_color_inactive">
          Подключение к серверу заказов...
        </div>
      </div>
    );
  }

  return (
    <>
      <section className={`${styles.container} pt-5`}>
        <div>
          {orders.length > 0 ? (
            orderElements
          ) : isConnected ? (
            <div className={styles.emptyState}>
              <div className="text text_type_main-medium text_color_inactive mb-2">
                У вас пока нет заказов
              </div>
              <div className="text text_type_main-default text_color_inactive">
                Перейдите на главную страницу, чтобы собрать свой первый бургер
              </div>
            </div>
          ) : null}
        </div>
      </section>
      {isModalOpen && currentItem && (
        <Modal onClose={handleCloseModal}>
          <OrderInfo order={currentItem} ingredients={ingredients} />
        </Modal>
      )}
    </>
  );
};

export default memo(ProfileOrderCards);
