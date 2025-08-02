type ApiSuccess<T> = {
  success: true;
  data: T;
};

type ApiError = {
  success: false;
  message?: string;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

import { apiConfig } from './constants';

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

async function checkResponse<T>(res: Response): Promise<T> {
  const body = (await res.json()) as ApiResponse<T>;

  if (!res.ok || !body.success) {
    const error = body as ApiError;
    throw new Error(error.message ?? `Ошибка: ${res.status}`);
  }

  return body as T;
}

export async function request<T>(
  endpoint: string,
  method: HttpMethod = 'GET',
  body?: BodyInit,
  token?: string
): Promise<T> {
  const headers = {
    ...apiConfig.headers,
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  const res = await fetch(`${apiConfig.baseUrl}${endpoint}`, {
    method,
    headers,
    body,
  });
  return checkResponse<T>(res);
}
