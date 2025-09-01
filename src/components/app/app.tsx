import {
  ForgotPassword,
  HomePage,
  LoginPage,
  ProfilePage,
  RegisterPage,
  ResetPassword,
} from '@/pages';
import { memo, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import { fetchUser, refreshToken } from '../../services/authSlice.ts';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { fetchIngredients } from '../../services/ingredientsSlice.ts';
import { AppHeader } from '@components/app-header/app-header.tsx';
import IngredientDetails from '@components/ingredient-details/ingredient-details.tsx';
import { Modal } from '@components/modal/modal.tsx';
import { ProfileOrders } from '@components/profile-orders/profile-orders.tsx';
import { ProfileUpdateForm } from '@components/profile-update-form/profile-update-form.tsx';
import { ProtectedResetRoute } from '@components/protected-reset-route/protected-reset-route.tsx';
import { ProtectedRouteElement } from '@components/protected-route-element/protected-route-element.tsx';
import IngredientPage from '@pages/ingredient-page/ingredient-page.tsx';
import { ROUTES } from '@utils/constants.ts';
import { getCookie } from '@utils/cookies.ts';

import type { RootState } from '@services/store.ts';
import type { TLocationState } from '@utils/types.ts';
import type { JSX } from 'react';

export const App = (): JSX.Element => {
  const location = useLocation();
  const state = location.state as TLocationState;
  const background = state?.background ?? location;
  const isAuth = useAppSelector((s: RootState) => s.auth.accessToken);
  const authChecked = useAppSelector((s: RootState) => s.auth.authChecked);
  const from: string = (location.state as { from?: string })?.from ?? ROUTES.HOME;
  const ingredients = useAppSelector((s) => s.ingredients.items);
  const ingredient = ingredients.find(
    (i) => i._id === location.pathname.split('/').pop()
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const accessToken = getCookie('accessToken');
      if (accessToken) {
        await dispatch(fetchUser());
      }
      await dispatch(fetchIngredients());
    };

    try {
      void fetchData();
    } catch (error) {
      console.error(error);
    }
  }, [dispatch]);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const hasRefreshToken = localStorage.getItem('refreshToken');
      if (!isAuth && hasRefreshToken) {
        await dispatch(refreshToken());
      }
    };

    try {
      void fetchData();
    } catch (error) {
      console.error(error);
    }
  }, [dispatch, isAuth]);

  if (!authChecked) {
    return <div>Загрузка...</div>; // 🔁 Показываем спиннер, пока не знаем статус
  }

  return (
    <>
      <AppHeader isAuth={!!isAuth} />
      <Routes location={background}>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route
          path={ROUTES.LOGIN}
          element={!isAuth ? <LoginPage /> : <Navigate to={from} />}
        />
        <Route
          path={ROUTES.FORGOT_PASSWORD}
          element={!isAuth ? <ForgotPassword /> : <Navigate to={from} />}
        />
        <Route
          path={ROUTES.PROFILE}
          element={<ProtectedRouteElement element={<ProfilePage />} />}
        >
          <Route path={ROUTES.PROFILE} element={<ProfileUpdateForm />} />
          <Route path={ROUTES.PROFILE_ORDERS} element={<ProfileOrders />} />
          <Route path={ROUTES.PROFILE_ORDER} element={<></>} />
        </Route>
        <Route path={ROUTES.INGREDIENTS} element={<IngredientPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        <Route
          path={ROUTES.RESET_PASSWORD}
          element={
            <ProtectedResetRoute
              element={!isAuth ? <ResetPassword /> : <Navigate to={ROUTES.HOME} />}
            />
          }
        />
      </Routes>

      {state?.background && (
        <Routes>
          <Route
            path="/ingredients/:id"
            element={
              <Modal onClose={() => window.history.back()}>
                <IngredientDetails card={ingredient} />
              </Modal>
            }
          />
        </Routes>
      )}
    </>
  );
};

export default memo(App);
