import { testWebSocketConnection, logEnvironmentInfo } from '../utils/websocketUtils';
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
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 3;
const RECONNECT_INTERVAL = 2000; // 2 секунды

export const feedMiddleware: Middleware = (store) => (next) => (action) => {
  const { dispatch } = store;
  const { type } = action as { type: string };

  if (type === feedConnect.type) {
    // Логируем информацию о среде для диагностики
    logEnvironmentInfo();

    // Закрываем существующее соединение, если есть
    if (socket) {
      socket.close();
      socket = null;
    }

    const connectWebSocket = async (): Promise<void> => {
      const wsUrl = 'wss://norma.nomoreparties.space/orders/all';

      // Сначала тестируем соединение
      const testResult = await testWebSocketConnection(wsUrl);

      if (!testResult.success) {
        console.error('❌ Тест WebSocket соединения не прошел:', testResult.error);
        dispatch(feedError(testResult.error ?? 'Ошибка тестирования соединения'));
        return;
      }

      try {
        console.log('🔌 Создание WebSocket соединения...');
        socket = new WebSocket(wsUrl);

        socket.onopen = (): void => {
          console.log('✅ WebSocket ленты заказов успешно подключен');
          reconnectAttempts = 0;
          dispatch(feedConnected());
        };

        socket.onclose = (event): void => {
          console.log('🔌 WebSocket закрыт:', {
            code: event.code,
            reason: event.reason || 'Причина не указана',
            wasClean: event.wasClean,
          });

          dispatch(feedDisconnected());

          // Автопереподключение только при неожиданном закрытии
          if (!event.wasClean && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
            reconnectAttempts++;
            const delay = RECONNECT_INTERVAL * Math.pow(2, reconnectAttempts - 1); // Экспоненциальная задержка

            console.log(
              `🔄 Переподключение через ${delay}ms (попытка ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`
            );

            setTimeout(() => {
              void connectWebSocket();
            }, delay);
          } else if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
            dispatch(
              feedError(
                'Не удается подключиться к серверу. Проверьте интернет-соединение.'
              )
            );
          }
        };

        socket.onerror = (event): void => {
          console.error('💥 WebSocket ошибка:', event);

          let errorMessage = 'Ошибка соединения с сервером';

          if (!navigator.onLine) {
            errorMessage = 'Нет подключения к интернету';
          } else {
            errorMessage = 'Сервер ленты заказов недоступен';
          }

          dispatch(feedError(errorMessage));
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
        dispatch(feedError('Невозможно создать соединение с сервером'));
      }
    };

    // Запускаем подключение
    void connectWebSocket();
  }

  if (type === feedDisconnected.type && socket) {
    console.log('🔌 Принудительное закрытие WebSocket');
    reconnectAttempts = MAX_RECONNECT_ATTEMPTS; // Останавливаем автопереподключение
    socket.close(1000, 'Отключение пользователем');
    socket = null;
  }

  return next(action);
};
