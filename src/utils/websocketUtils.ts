/**
 * Утилиты для диагностики WebSocket соединений
 */

// Типы для диагностической информации
type WebSocketTestResult = {
  success: boolean;
  error?: string;
  details?: {
    code?: number;
    reason?: string;
    event?: Event | CloseEvent;
    message?: string;
  };
};

type NetworkStatus = {
  online: boolean;
  connectionType?: string;
};

type EnvironmentInfo = {
  userAgent: string;
  online: boolean;
  connectionType?: string;
  protocol: string;
  host: string;
  webSocketSupported: boolean;
};

// Тип для NetworkConnection
type NetworkConnection = {
  effectiveType?: string;
};

/**
 * Тестирует доступность WebSocket сервера
 */
export const testWebSocketConnection = async (
  url: string
): Promise<WebSocketTestResult> => {
  return new Promise((resolve) => {
    try {
      console.log(`🔍 Тестирование WebSocket соединения: ${url}`);

      const testSocket = new WebSocket(url);
      const timeout = setTimeout(() => {
        testSocket.close();
        resolve({
          success: false,
          error: 'Timeout: соединение не установлено за 10 секунд',
        });
      }, 10000);

      testSocket.onopen = (): void => {
        clearTimeout(timeout);
        console.log('✅ Тест WebSocket соединения успешен');
        testSocket.close();
        resolve({ success: true });
      };

      testSocket.onerror = (event: Event): void => {
        clearTimeout(timeout);
        console.error('❌ Ошибка тест WebSocket соединения:', event);
        resolve({
          success: false,
          error: 'Ошибка соединения с сервером',
          details: {
            event,
            message: 'WebSocket connection failed',
          },
        });
      };

      testSocket.onclose = (event: CloseEvent): void => {
        clearTimeout(timeout);
        if (event.code !== 1000) {
          console.warn('⚠️ WebSocket закрылся с кодом:', event.code, event.reason);
          resolve({
            success: false,
            error: `Соединение закрыто с кодом ${event.code}: ${event.reason}`,
            details: {
              code: event.code,
              reason: event.reason,
              event,
            },
          });
        }
      };
    } catch (error) {
      console.error('💥 Критическая ошибка при создании WebSocket:', error);
      resolve({
        success: false,
        error: 'Критическая ошибка при создании соединения',
        details: {
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      });
    }
  });
};

/**
 * Проверяет статус подключения к интернету
 */
export const checkNetworkStatus = (): NetworkStatus => {
  const online = navigator.onLine;
  const connection =
    (navigator as { connection?: NetworkConnection }).connection ??
    (navigator as { mozConnection?: NetworkConnection }).mozConnection ??
    (navigator as { webkitConnection?: NetworkConnection }).webkitConnection;

  return {
    online,
    connectionType: connection?.effectiveType ?? 'unknown',
  };
};

/**
 * Логирует информацию о среде для диагностики
 */
export const logEnvironmentInfo = (): EnvironmentInfo => {
  const networkStatus = checkNetworkStatus();

  const envInfo: EnvironmentInfo = {
    userAgent: navigator.userAgent,
    online: networkStatus.online,
    connectionType: networkStatus.connectionType,
    protocol: window.location.protocol,
    host: window.location.host,
    webSocketSupported: typeof WebSocket !== 'undefined',
  };

  console.log('🌐 Информация о среде выполнения:', envInfo);

  return envInfo;
};
