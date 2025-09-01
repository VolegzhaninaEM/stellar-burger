import { Navigate, useLocation } from 'react-router-dom';

import { ROUTES } from '@utils/constants';

import type { TLocationState } from '@utils/types.ts';
import type { JSX } from 'react';

export const ProtectedResetRoute = ({
  element,
}: {
  element: JSX.Element;
}): JSX.Element => {
  const location = useLocation();
  const state = location.state as TLocationState;
  const fromForgot = state?.from === ROUTES.FORGOT_PASSWORD;
  return fromForgot ? element : <Navigate to={ROUTES.HOME} replace />;
};
