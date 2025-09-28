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

export const feedMiddleware: Middleware = (store) => (next) => (action) => {
  const { dispatch } = store;
  const { type } = action as { type: string };

  if (type === feedConnect.type) {
    if (socket) {
      socket.close();
    }

    socket = new WebSocket('wss://norma.nomoreparties.space/orders/all');

    socket.onopen = (): void => {
      dispatch(feedConnected());
    };

    socket.onclose = (): void => {
      dispatch(feedDisconnected());
    };

    socket.onerror = (): void => {
      dispatch(feedError('WebSocket connection error'));
    };

    socket.onmessage = (event): void => {
      try {
        const data = JSON.parse(event.data as string) as {
          success: boolean;
          orders: TOrder[];
          total: number;
          totalToday: number;
        };

        if (data.success && data.orders) {
          const feedData: FeedData = {
            orders: data.orders,
            total: data.total,
            totalToday: data.totalToday,
          };
          dispatch(feedMessage(feedData));
        }
      } catch (_error) {
        dispatch(feedError('Failed to parse WebSocket message'));
      }
    };
  }

  if (type === feedDisconnected.type && socket) {
    socket.close();
    socket = null;
  }

  return next(action);
};
