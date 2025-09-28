import type { TTokenResponse } from '@utils/types.ts';

type CookieName = string;
type CookieValue = string;

type CookieOptions = {
  expires?: Date | number | string;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
  [key: string]: unknown; // допускаем любые дополнительные опции
};

export function getCookie(name: CookieName): string | undefined {
  const matches = new RegExp(
    '(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)'
  ).exec(document.cookie);
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

export function setCookie(
  name: CookieName,
  value: CookieValue,
  opts: CookieOptions = {}
): void {
  let { expires } = opts;
  const { ...props } = opts;

  if (typeof expires === 'number') {
    const date = new Date();
    date.setTime(date.getTime() + expires * 1000);
    expires = date;
  }

  if (expires instanceof Date) {
    props.expires = expires.toUTCString();
  }

  let cookie = `${name}=${encodeURIComponent(value)}`;
  for (const [key, val] of Object.entries(props)) {
    cookie += `; ${key}`;
    if (val !== true) cookie += `=${String(val)}`;
  }

  document.cookie = cookie;
}

export function deleteCookie(name: CookieName): void {
  setCookie(name, '', { expires: new Date(0) });
}

// Токен доступа хранится 20 минут, рефреш токен - 30 дней
const ACCESS_TOKEN_EXPIRY_TIME = 20 * 60; // 20 минут в секундах
const REFRESH_TOKEN_EXPIRY_TIME = 30 * 24 * 60 * 60; // 30 дней в секундах

// Обновляем тип, чтобы функция могла принимать как TAuthResponse, так и TTokenResponse
export const saveTokens = ({ accessToken, refreshToken }: TTokenResponse): void => {
  // Убираем префикс Bearer, если он есть
  const cleanAccessToken = accessToken.replace(/^Bearer\s+/i, '').trim();

  // Сохраняем токены в cookies с установленным временем жизни
  setCookie('accessToken', cleanAccessToken, {
    expires: ACCESS_TOKEN_EXPIRY_TIME,
    path: '/',
  });

  setCookie('refreshToken', refreshToken, {
    expires: REFRESH_TOKEN_EXPIRY_TIME,
    path: '/',
  });

  // Для совместимости с текущей реализацией сохраняем также в localStorage
  localStorage.setItem('refreshToken', refreshToken);
};

export const getTokens = (): {
  accessToken: string | undefined;
  refreshToken: string | undefined;
} => {
  return {
    accessToken: getCookie('accessToken'),
    refreshToken: getCookie('refreshToken'),
  };
};
