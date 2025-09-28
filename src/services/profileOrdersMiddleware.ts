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

// Создаем мидлвар для заказов профиля
export const profileOrdersMiddleware: Middleware = (store) => (next) => (action) => {
  const { dispatch } = store;
  const { type } = action as { type: string };

  if (type === profileOrdersConnect.type) {
    console.log('🔌 Подключение к WebSocket для заказов профиля');

    // Закрываем существующее соединение, если есть
    if (socket) {
      console.log('🔌 Закрываем предыдущее соединение профиля');
      socket.close();
      socket = null;
    }

    // Получаем токен авторизации для подключения к личным заказам
    const accessToken = getCookie('accessToken');

    if (!accessToken) {
      dispatch(profileOrdersError('Требуется авторизация для просмотра заказов'));
      return next(action);
    }

    try {
      // Подключаемся к WebSocket для заказов пользователя
      const wsUrl = `wss://norma.nomoreparties.space/orders?token=${accessToken}`;
      socket = new WebSocket(wsUrl);

      socket.onopen = (): void => {
        console.log('✅ WebSocket заказов профиля подключен');
        dispatch(profileOrdersConnected());
      };

      socket.onclose = (): void => {
        console.log('🔌 WebSocket заказов профиля закрыт');
        dispatch(profileOrdersDisconnected());
        socket = null;
      };

      socket.onerror = (): void => {
        console.error('❌ Ошибка WebSocket заказов профиля');
        dispatch(profileOrdersError('Ошибка подключения к серверу заказов'));
        socket = null;
      };

      socket.onmessage = (event): void => {
        try {
          const data = JSON.parse(event.data as string) as {
            success: boolean;
            orders: TOrder[];
            total?: number;
            totalToday?: number;
          };

          console.log('📦 Получены данные от WebSocket:', data);

          if (data.success && data.orders) {
            const profileOrdersData: ProfileOrdersData = {
              orders: data.orders,
              total: data.total ?? 0,
              totalToday: data.totalToday ?? 0,
            };
            dispatch(profileOrdersMessage(profileOrdersData));
          } else {
            dispatch(profileOrdersError('Некорректные данные от сервера'));
          }
        } catch (error) {
          console.error('❌ Ошибка парсинга данных:', error);
          dispatch(profileOrdersError('Ошибка обработки данных заказов'));
        }
      };
    } catch (error) {
      console.error('💥 Ошибка создания WebSocket:', error);
      dispatch(profileOrdersError('Не удалось создать WebSocket соединение'));
    }
  }

  if (type === profileOrdersDisconnected.type && socket) {
    console.log('🔌 Принудительное закрытие WebSocket заказов профиля');
    socket.close();
    socket = null;
  }

  return next(action);
};
