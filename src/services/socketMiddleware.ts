import type {
  Middleware,
  ActionCreatorWithPayload,
  ActionCreatorWithoutPayload,
  AnyAction,
} from '@reduxjs/toolkit';

// Типы для конфигурации WebSocket middleware
export type SocketActions<TMessagePayload = unknown> = {
  connect: ActionCreatorWithPayload<{ url: string; token?: string }>;
  connected: ActionCreatorWithoutPayload;
  disconnect: ActionCreatorWithoutPayload;
  disconnected: ActionCreatorWithoutPayload;
  message: ActionCreatorWithPayload<TMessagePayload>;
  error: ActionCreatorWithPayload<string>;
};

type SocketConnection = {
  socket: WebSocket | null;
  isConnecting: boolean;
};

// Тип для ответа WebSocket
type WebSocketResponse = {
  success: boolean;
  message?: string;
  [key: string]: unknown;
};

// Универсальная функция создания WebSocket middleware
export const createSocketMiddleware = <TMessagePayload = unknown>(
  actions: SocketActions<TMessagePayload>
): Middleware => {
  // Хранилище соединений для каждого типа middleware
  const connections = new Map<string, SocketConnection>();

  return (store) => (next) => (action: unknown) => {
    const typedAction = action as AnyAction;
    const { dispatch } = store;
    const { type } = typedAction;

    // Получаем уникальный ключ для этого типа соединения
    const connectionKey = actions.connect.type;

    // Инициализируем соединение если его нет
    if (!connections.has(connectionKey)) {
      connections.set(connectionKey, { socket: null, isConnecting: false });
    }

    const connection = connections.get(connectionKey)!;

    // Обработка подключения
    if (type === actions.connect.type) {
      const payload = typedAction.payload as { url: string; token?: string };
      const { url, token } = payload;

      console.log(`🔌 Подключение к WebSocket: ${url}`);

      // Предотвращаем множественные подключения
      if (
        connection.isConnecting ||
        connection.socket?.readyState === WebSocket.CONNECTING
      ) {
        console.log('⚠️ Подключение уже в процессе');
        return next(action);
      }

      // Закрываем существующее соединение
      if (connection.socket) {
        console.log('🔌 Закрываем предыдущее соединение');
        connection.socket.close();
        connection.socket = null;
      }

      connection.isConnecting = true;

      try {
        // Формируем URL с токеном если необходимо
        const wsUrl = token ? `${url}?token=${token}` : url;
        connection.socket = new WebSocket(wsUrl);

        connection.socket.onopen = (): void => {
          console.log(`✅ WebSocket подключен: ${url}`);
          connection.isConnecting = false;
          dispatch(actions.connected());
        };

        connection.socket.onclose = (event): void => {
          console.log(`🔌 WebSocket закрыт: ${url}`, {
            code: event.code,
            reason: event.reason || 'Причина не указана',
            wasClean: event.wasClean,
          });
          connection.isConnecting = false;
          connection.socket = null;
          dispatch(actions.disconnected());
        };

        connection.socket.onerror = (event): void => {
          console.error(`💥 WebSocket ошибка: ${url}`, event);
          connection.isConnecting = false;
          connection.socket = null;
          dispatch(actions.error('Ошибка соединения с сервером'));
        };

        connection.socket.onmessage = (event): void => {
          try {
            const data = JSON.parse(event.data as string) as WebSocketResponse;
            console.log(`📦 Получены данные от WebSocket: ${url}`, data);

            if (data.success) {
              dispatch(actions.message(data as TMessagePayload));
            } else {
              dispatch(actions.error(data.message ?? 'Сервер вернул ошибку'));
            }
          } catch (error) {
            console.error(`💥 Ошибка парсинга данных: ${url}`, error);
            dispatch(actions.error('Ошибка обработки данных сервера'));
          }
        };
      } catch (error) {
        console.error(`💥 Ошибка создания WebSocket: ${url}`, error);
        connection.isConnecting = false;
        dispatch(actions.error('Не удалось создать WebSocket соединение'));
      }
    }

    // Обработка отключения
    if (type === actions.disconnect.type || type === actions.disconnected.type) {
      if (connection.socket) {
        console.log(`🔌 Принудительное закрытие WebSocket: ${connectionKey}`);
        connection.socket.close(1000, 'Отключение пользователем');
        connection.socket = null;
      }
      connection.isConnecting = false;
    }

    return next(action);
  };
};
