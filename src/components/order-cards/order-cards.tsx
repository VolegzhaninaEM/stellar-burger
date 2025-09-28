import {
  useAppDispatch,
  useAppSelector,
  feedConnect,
  feedDisconnected,
  selectFeedOrders,
  selectFeedIsConnected,
  selectFeedError,
  selectIngredients,
} from '@/services';
import { memo, useCallback, useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import OrderCard from '../order-card/order-card';
import Modal from '@components/modal/modal';
import OrderInfo from '@components/order-info/order-info';

import type { TOrder } from '../order-card/order-card';
import type { JSX } from 'react';

import styles from './order-cards.module.css';

const OrderCards = (): JSX.Element => {
  const [currentItem, setCurrentItem] = useState<TOrder | undefined>();
  const [isModalOpen, setModalState] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Получаем данные из Redux store
  const orders = useAppSelector(selectFeedOrders);
  const ingredients = useAppSelector(selectIngredients);
  const isConnected = useAppSelector(selectFeedIsConnected);
  const error = useAppSelector(selectFeedError);

  // Подключаемся к WebSocket при монтировании компонента
  useEffect(() => {
    dispatch(feedConnect());

    // Отключаемся при размонтировании компонента
    return (): void => {
      dispatch(feedDisconnected());
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
      void navigate(`/feed/${order._id}`, {
        state: { background: location },
      });
    },
    [navigate, location]
  );

  const handleRetryConnection = useCallback((): void => {
    console.log('🔄 Попытка переподключения к ленте заказов...');
    dispatch(feedDisconnected()); // Сначала отключаемся
    setTimeout(() => {
      dispatch(feedConnect()); // Затем подключаемся заново
    }, 1000);
  }, [dispatch]);

  // Мемоизируем список заказов для оптимизации
  const orderElements = useMemo(
    () =>
      orders.map((order) => (
        <OrderCard
          key={order._id}
          order={order}
          ingredients={ingredients}
          onClick={handleOrderClick}
          showStatus={false}
        />
      )),
    [orders, ingredients, handleOrderClick]
  );

  // Показываем состояние загрузки или ошибки
  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <div className="text text_type_main-medium mb-4">
            Не удалось загрузить ленту заказов
          </div>
          <div className="text text_type_main-default text_color_inactive mb-6">
            {error}
          </div>
          <button
            className="button button_type_primary button_size_medium"
            onClick={handleRetryConnection}
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  if (!isConnected && orders.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <div className="text text_type_main-medium text_color_inactive">
            Подключение к серверу...
          </div>
          <div className="text text_type_main-default text_color_inactive mt-2">
            Загружаем актуальные заказы
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.container}>
        {orders.length > 0 ? (
          orderElements
        ) : (
          <div className="text text_type_main-medium">Заказы не найдены</div>
        )}
      </div>
      {isModalOpen && currentItem && (
        <Modal onClose={handleCloseModal}>
          <OrderInfo order={currentItem} ingredients={ingredients} />
        </Modal>
      )}
    </>
  );
};

export default memo(OrderCards);
