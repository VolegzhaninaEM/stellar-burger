import {
  useAppDispatch,
  useAppSelector,
  profileOrdersConnect,
  profileOrdersDisconnected,
  clearProfileOrders,
  selectProfileOrders,
  selectProfileOrdersIsConnected,
  selectProfileOrdersError,
  selectIngredients,
} from '@/services';
import { memo, useCallback, useState, useMemo, useEffect } from 'react';
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
  const dispatch = useAppDispatch();

  // Получаем данные из Redux store для профиля
  const orders = useAppSelector(selectProfileOrders);
  const ingredients = useAppSelector(selectIngredients);
  const isConnected = useAppSelector(selectProfileOrdersIsConnected);
  const error = useAppSelector(selectProfileOrdersError);

  // Подключаемся к WebSocket при монтировании компонента
  useEffect(() => {
    dispatch(profileOrdersConnect());

    // Отключаемся при размонтировании компонента
    return (): void => {
      dispatch(profileOrdersDisconnected());
      dispatch(clearProfileOrders());
    };
  }, [dispatch]);

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

  // Мемоизируем список заказов для оптимизации
  const orderElements = useMemo(
    () =>
      orders.map((order) => (
        <OrderCard
          key={order._id}
          order={order}
          ingredients={ingredients}
          onClick={handleOrderClick}
          showStatus={true}
        />
      )),
    [orders, ingredients, handleOrderClick]
  );

  // Показываем состояние загрузки или ошибки
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

  if (!isConnected && orders.length === 0) {
    return (
      <div className={styles.container}>
        <div className="text text_type_main-medium text_color_inactive">
          Загрузка ваших заказов...
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.container}>
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
      {isModalOpen && currentItem && (
        <Modal onClose={handleCloseModal}>
          <OrderInfo order={currentItem} ingredients={ingredients} />
        </Modal>
      )}
    </>
  );
};

export default memo(ProfileOrderCards);
