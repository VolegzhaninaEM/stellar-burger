import {
  feedConnect,
  feedConnected,
  feedDisconnect,
  feedDisconnected,
  feedError,
  feedMessage,
} from './feedSlice';
import {
  profileOrdersConnect,
  profileOrdersConnected,
  profileOrdersDisconnect,
  profileOrdersDisconnected,
  profileOrdersError,
  profileOrdersMessage,
} from './profileOrdersSlice';
import { createSocketMiddleware } from './socketMiddleware';

// Создаем middleware для ленты заказов
export const feedSocketMiddleware = createSocketMiddleware({
  connect: feedConnect,
  connected: feedConnected,
  disconnect: feedDisconnect,
  disconnected: feedDisconnected,
  message: feedMessage,
  error: feedError,
});

// Создаем middleware для заказов профиля
export const profileOrdersSocketMiddleware = createSocketMiddleware({
  connect: profileOrdersConnect,
  connected: profileOrdersConnected,
  disconnect: profileOrdersDisconnect,
  disconnected: profileOrdersDisconnected,
  message: profileOrdersMessage,
  error: profileOrdersError,
});

// Константы URL для WebSocket соединений
export const WS_URLS = {
  FEED: 'wss://norma.nomoreparties.space/orders/all',
  PROFILE_ORDERS: 'wss://norma.nomoreparties.space/orders',
} as const;
