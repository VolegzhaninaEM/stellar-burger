import {
  useAppDispatch,
  useAppSelector,
  feedConnect,
  feedDisconnect,
  selectFeedOrders,
  selectFeedIsConnected,
  selectFeedError,
  selectIngredients,
  profileOrdersConnect,
  profileOrdersDisconnect,
  selectProfileOrders,
  selectProfileOrdersIsConnected,
  selectProfileOrdersError,
} from '@/services';
import { memo, useCallback, useMemo, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { WS_URLS } from '../../services/websocketInstances';
import { getCookie } from '../../utils/cookies';
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
  const disconnectAction = mode === 'feed' ? feedDisconnect : profileOrdersDisconnect;

  // Функция для подключения с правильными параметрами
  const connectToWebSocket = useCallback(() => {
    if (mode === 'feed') {
      // Для ленты заказов токен не нужен
      dispatch(feedConnect({ url: WS_URLS.FEED }));
    } else {
      // Для заказов профиля нужен токен
      const accessToken = getCookie('accessToken');
      if (accessToken) {
        dispatch(
          profileOrdersConnect({ url: WS_URLS.PROFILE_ORDERS, token: accessToken })
        );
      } else {
        console.error('❌ Токен авторизации не найден для заказов профиля');
      }
    }
  }, [mode, dispatch]);

  // Функция для периодического обновления (только для ленты)
  const setupPeriodicUpdate = useCallback((): (() => void) => {
    if (mode !== 'feed' || !enablePeriodicUpdate) {
      return () => {
        // Пустая функция для случаев, когда обновление не нужно
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
        connectToWebSocket();
      }
    }, 15000);

    return (): void => {
      if (updateTimerRef.current !== null) {
        window.clearInterval(updateTimerRef.current);
        updateTimerRef.current = null;
      }
    };
  }, [connectToWebSocket, mode, enablePeriodicUpdate]);

  // Подключение при монтировании компонента
  useEffect(() => {
    console.log(`📣 Инициализация компонента OrderCards (режим: ${mode})`);
    isMountedRef.current = true;

    // Запускаем подключение с правильными параметрами
    connectToWebSocket();

    // Настраиваем периодическое обновление если нужно
    const cleanup = setupPeriodicUpdate();

    // Отключаемся при размонтировании
    return (): void => {
      console.log(`🔌 Размонтирование компонента OrderCards (режим: ${mode})`);
      isMountedRef.current = false;
      dispatch(disconnectAction());
      cleanup();
    };
  }, [connectToWebSocket, disconnectAction, setupPeriodicUpdate, mode, dispatch]);

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
      connectToWebSocket();
    }, 1000);
  }, [dispatch, disconnectAction, connectToWebSocket, mode]);

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
