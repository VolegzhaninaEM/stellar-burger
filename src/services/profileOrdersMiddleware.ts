import { getCookie } from '../utils/cookies';
import {
  profileOrdersConnect,
  profileOrdersConnected,
  profileOrdersDisconnected,
  profileOrdersError,
  profileOrdersMessage,
} from './profileOrdersSlice';

import type { ProfileOrdersData } from './profileOrdersSlice';
import type { TOrder } from '@components/order-card/order-card.tsx';
import type { Middleware } from '@reduxjs/toolkit';

let socket: WebSocket | null = null;

export const profileOrdersMiddleware: Middleware = (store) => (next) => (action) => {
  const { dispatch } = store;
  const { type } = action as { type: string };

  if (type === profileOrdersConnect.type) {
    if (socket) {
      socket.close();
    }

    // Получаем токен авторизации для подключения к личным заказам
    const accessToken = getCookie('accessToken');

    if (!accessToken) {
      dispatch(profileOrdersError('Требуется авторизация для просмотра заказов'));
      return next(action);
    }

    // Подключаемся к WebSocket для заказов пользователя
    const wsUrl = `wss://norma.nomoreparties.space/orders?token=${accessToken}`;
    socket = new WebSocket(wsUrl);

    socket.onopen = (): void => {
      dispatch(profileOrdersConnected());
    };

    socket.onclose = (): void => {
      dispatch(profileOrdersDisconnected());
    };

    socket.onerror = (): void => {
      dispatch(profileOrdersError('Ошибка подключения к серверу заказов'));
    };

    socket.onmessage = (event): void => {
      try {
        const data = JSON.parse(event.data as string) as {
          success: boolean;
          orders: TOrder[];
          total?: number;
          totalToday?: number;
        };

        if (data.success && data.orders) {
          const profileOrdersData: ProfileOrdersData = {
            orders: data.orders,
            total: data.total ?? 0,
            totalToday: data.totalToday ?? 0,
          };
          dispatch(profileOrdersMessage(profileOrdersData));
        }
      } catch (_error) {
        dispatch(profileOrdersError('Ошибка обработки данных заказов'));
      }
    };
  }

  if (type === profileOrdersDisconnected.type && socket) {
    socket.close();
    socket = null;
  }

  return next(action);
};
