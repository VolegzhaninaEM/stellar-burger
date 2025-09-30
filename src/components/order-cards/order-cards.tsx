import {
  useAppDispatch,
  useAppSelector,
  feedConnect,
  feedDisconnected,
  selectFeedOrders,
  selectFeedIsConnected,
  selectFeedError,
  selectIngredients,
  profileOrdersConnect,
  profileOrdersDisconnected,
  selectProfileOrders,
  selectProfileOrdersIsConnected,
  selectProfileOrdersError,
} from '@/services';
import { memo, useCallback, useMemo, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import OrderCard from '../order-card/order-card';

import type { TOrder } from '../order-card/order-card';
import type { JSX } from 'react';

import styles from './order-cards.module.css';

type OrderCardsProps = {
  /** Режим работы: 'feed' для ленты заказов, 'profile' для заказов профиля */
  mode: 'feed' | 'profile';
  /** Показывать ли статус заказа */
  showStatus?: boolean;
  /** Включить ли периодическое обновление (только для feed) */
  enablePeriodicUpdate?: boolean;
};

const OrderCards = ({
  mode,
  showStatus = false,
  enablePeriodicUpdate = false,
}: OrderCardsProps): JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Refs для управления состоянием
  const isMountedRef = useRef(false);
  const updateTimerRef = useRef<number | null>(null);

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

  // Действия для подключения/отключения в зависимости от режима
  const connectAction = mode === 'feed' ? feedConnect : profileOrdersConnect;
  const disconnectAction =
    mode === 'feed' ? feedDisconnected : profileOrdersDisconnected;

  // Функция для периодического обновления (только для ленты)
  const setupPeriodicUpdate = useCallback((): (() => void) => {
    if (mode !== 'feed' || !enablePeriodicUpdate) {
      return (): void => {
        // Ничего не делаем, если режим не "feed" или обновление отключено
      };
    }

    // Очищаем предыдущий таймер
    if (updateTimerRef.current !== null) {
      window.clearInterval(updateTimerRef.current);
    }

    // Устанавливаем периодическое обновление
    updateTimerRef.current = window.setInterval(() => {
      console.log('🔄 Периодическое обновление ленты заказов');
      if (isMountedRef.current) {
        dispatch(connectAction());
      }
    }, 15000);

    return (): void => {
      if (updateTimerRef.current !== null) {
        window.clearInterval(updateTimerRef.current);
        updateTimerRef.current = null;
      }
    };
  }, [dispatch, connectAction, mode, enablePeriodicUpdate]);

  // Подключение при монтировании компонента
  useEffect(() => {
    console.log(`📣 Инициализация компонента OrderCards (режим: ${mode})`);
    isMountedRef.current = true;

    // Запускаем подключение
    dispatch(connectAction());

    // Настраиваем периодическое обновление если нужно
    const cleanup = setupPeriodicUpdate();

    // Отключаемся при размонтировании
    return (): void => {
      console.log(`🔌 Размонтирование компонента OrderCards (режим: ${mode})`);
      isMountedRef.current = false;
      dispatch(disconnectAction());
      cleanup();
    };
  }, [dispatch, connectAction, disconnectAction, setupPeriodicUpdate, mode]);

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

  const handleRetryConnection = useCallback((): void => {
    console.log(`🔄 Попытка переподключения (режим: ${mode})...`);
    dispatch(disconnectAction());
    setTimeout(() => {
      dispatch(connectAction());
    }, 1000);
  }, [dispatch, connectAction, disconnectAction, mode]);

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
    <>
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
    </>
  );
};

export default memo(OrderCards);
