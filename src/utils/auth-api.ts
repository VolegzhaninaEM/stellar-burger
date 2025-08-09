import { request } from './api';

import type { TPasswordReset } from '@utils/types.ts';

export const forgotPassword = async (email: string): Promise<TPasswordReset> => {
  return request('/password-reset', 'POST', JSON.stringify({ email }));
};

export const resetPassword = async (
  password: string,
  token: string
): Promise<TPasswordReset> => {
  return request('/password-reset/reset', 'POST', JSON.stringify({ password, token }));
};
