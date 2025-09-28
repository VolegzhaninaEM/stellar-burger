import {
  feedConnect,
  feedConnected,
  feedDisconnected,
  feedError,
  feedMessage,
} from './feedSlice';

import type { FeedData } from './feedSlice';
import type { TOrder } from '@components/order-card/order-card.tsx';
import type { Middleware } from '@reduxjs/toolkit';

let socket: WebSocket | null = null;

// URL для WebSocket ленты заказов
const FEED_WS_URL = 'wss://norma.nomoreparties.space/orders/all';

// Создаем мидлвар для ленты заказов
export const feedMiddleware: Middleware = (store) => (next) => (action) => {
  const { dispatch } = store;
  const { type } = action as { type: string };

  if (type === feedConnect.type) {
    console.log('🔌 Подключение к WebSocket ленты заказов');

    // Закрываем существующее соединение, если есть
    if (socket) {
      console.log('🔌 Закрываем предыдущее соединение');
      socket.close();
      socket = null;
    }

    try {
      socket = new WebSocket(FEED_WS_URL);

      socket.onopen = (): void => {
        console.log('✅ WebSocket ленты заказов успешно подключен');
        dispatch(feedConnected());
      };

      socket.onclose = (event): void => {
        console.log('🔌 WebSocket ленты заказов закрыт:', {
          code: event.code,
          reason: event.reason || 'Причина не указана',
          wasClean: event.wasClean,
        });
        dispatch(feedDisconnected());
        socket = null;
      };

      socket.onerror = (event): void => {
        console.error('💥 WebSocket ошибка:', event);
        dispatch(feedError('Ошибка соединения с сервером ленты заказов'));
        socket = null;
      };

      socket.onmessage = (event): void => {
        try {
          const data = JSON.parse(event.data as string) as {
            success: boolean;
            orders: TOrder[];
            total: number;
            totalToday: number;
            message?: string;
          };

          console.log('📦 Получены данные ленты:', data);

          if (data.success && Array.isArray(data.orders)) {
            console.log(
              `📦 Получено заказов: ${data.orders.length}, всего: ${data.total}, сегодня: ${data.totalToday}`
            );

            const feedData: FeedData = {
              orders: data.orders,
              total: data.total || 0,
              totalToday: data.totalToday || 0,
            };
            dispatch(feedMessage(feedData));
          } else {
            console.warn('⚠️ Некорректный ответ сервера:', data);
            dispatch(feedError(data.message ?? 'Сервер вернул некорректные данные'));
          }
        } catch (error) {
          console.error('💥 Ошибка парсинга данных:', error);
          dispatch(feedError('Ошибка обработки данных сервера'));
        }
      };
    } catch (error) {
      console.error('💥 Ошибка создания WebSocket:', error);
      dispatch(feedError('Не удалось создать WebSocket соединение'));
    }
  }

  if (type === feedDisconnected.type && socket) {
    console.log('🔌 Принудительное закрытие WebSocket ленты');
    socket.close(1000, 'Отключение пользователем');
    socket = null;
  }

  return next(action);
};
