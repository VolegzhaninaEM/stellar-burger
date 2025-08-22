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
