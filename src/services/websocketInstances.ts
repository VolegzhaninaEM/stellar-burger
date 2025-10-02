import {
  feedConnect,
  feedConnected,
  feedDisconnect,
  feedDisconnected,
  feedError,
  feedMessage,
  type FeedData,
} from './feedSlice';
import {
  profileOrdersConnect,
  profileOrdersConnected,
  profileOrdersDisconnect,
  profileOrdersDisconnected,
  profileOrdersError,
  profileOrdersMessage,
  type ProfileOrdersData,
} from './profileOrdersSlice';
import { createSocketMiddleware } from './socketMiddleware';

// Создаем middleware для ленты заказов с типизацией FeedData
export const feedSocketMiddleware = createSocketMiddleware<FeedData>({
  connect: feedConnect,
  connected: feedConnected,
  disconnect: feedDisconnect,
  disconnected: feedDisconnected,
  message: feedMessage,
  error: feedError,
});

// Создаем middleware для заказов профиля с типизацией ProfileOrdersData
export const profileOrdersSocketMiddleware = createSocketMiddleware<ProfileOrdersData>({
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
