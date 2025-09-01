import { Navigate, useLocation } from 'react-router-dom';

import { useAppSelector } from '../../services/hooks';
import { ROUTES } from '@utils/constants';

import type { JSX, ReactElement } from 'react';

type ProtectedRouteElementProps = {
  element: ReactElement;
};

export const ProtectedRouteElement = ({
  element,
}: ProtectedRouteElementProps): JSX.Element => {
  const location = useLocation();
  const isAuth = useAppSelector((state) => state.auth.accessToken);

  return isAuth ? (
    element
  ) : (
    <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
  );
};
