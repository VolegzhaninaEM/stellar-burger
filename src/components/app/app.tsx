import {
  ForgotPassword,
  HomePage,
  IngredientPage,
  LoginPage,
  ProfilePage,
  RegisterPage,
  ResetPassword,
  FeedsPage,
  FeedOrderPage,
  ProfileOrderPage,
} from '@/pages';
import { memo, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import { fetchUser, refreshToken, setAuthChecked } from '../../services/authSlice.ts';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { fetchIngredients } from '../../services/ingredientsSlice.ts';
import {
  clearProfileOrders,
  profileOrdersDisconnected,
} from '../../services/profileOrdersSlice.ts';
import { AppHeader } from '@components/app-header/app-header.tsx';
import IngredientDetails from '@components/ingredient-details/ingredient-details.tsx';
import Modal from '@components/modal/modal.tsx';
import { ProfileOrders } from '@components/profile-orders/profile-orders.tsx';
import { ProfileUpdateForm } from '@components/profile-update-form/profile-update-form.tsx';
import { ProtectedResetRoute } from '@components/protected-reset-route/protected-reset-route.tsx';
import { ProtectedRouteElement } from '@components/protected-route-element/protected-route-element.tsx';
import { ROUTES } from '@utils/constants.ts';
import { getCookie } from '@utils/cookies.ts';

import type { RootState } from '@services/store.ts';
import type { TIngredient, TLocationState } from '@utils/types.ts';
import type { JSX } from 'react';

export const App = (): JSX.Element => {
  const location = useLocation();
  const state = location.state as TLocationState;
  const background = state?.background ?? location;
  const isAuth = useAppSelector((s: RootState) => s.auth.accessToken);
  const authChecked = useAppSelector((s: RootState) => s.auth.authChecked);
  const from: string = (location.state as { from?: string })?.from ?? ROUTES.HOME;
  const ingredients: TIngredient[] = useAppSelector((s) => s.ingredients.items);
  const ingredient: TIngredient | undefined = ingredients.find(
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
    const checkAuth = async (): Promise<void> => {
      const accessToken = getCookie('accessToken');
      const hasRefreshToken = localStorage.getItem('refreshToken');

      try {
        if (accessToken) {
          await dispatch(fetchUser());
        } else if (hasRefreshToken) {
          await dispatch(refreshToken());
        }
      } catch {
        throw new Error('Проверка пользователя прошла с ошибкой');
      } finally {
        dispatch(setAuthChecked(true));
      }
    };

    void checkAuth();
  }, [dispatch]);

  // Отключаемся от WebSocket заказов профиля при выходе из системы
  useEffect(() => {
    if (!isAuth && authChecked) {
      dispatch(profileOrdersDisconnected());
      dispatch(clearProfileOrders());
    }
  }, [isAuth, authChecked, dispatch]);

  // Очищаем соединения при размонтировании компонента
  useEffect(() => {
    return (): void => {
      dispatch(profileOrdersDisconnected());
      dispatch(clearProfileOrders());
    };
  }, [dispatch]);

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
          <Route path={ROUTES.PROFILE_ORDER} element={<ProfileOrderPage />} />
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
        <Route
          path={ROUTES.FEEDS}
          element={<ProtectedRouteElement element={<FeedsPage />} />}
        />
        <Route
          path={ROUTES.FEED}
          element={<ProtectedRouteElement element={<FeedOrderPage />} />}
        />
        <Route
          path={ROUTES.PROFILE_ORDER}
          element={<ProtectedRouteElement element={<ProfileOrderPage />} />}
        />
      </Routes>

      {state?.background !== undefined && (
        <Routes>
          <Route
            path={ROUTES.INGREDIENTS}
            element={
              <Modal onClose={() => window.history.back()}>
                <IngredientDetails card={ingredient} />
              </Modal>
            }
          />
          {/* TODO: Реализовать получение заказа по ID из URL параметров */}
          {/* <Route
            path={ROUTES.FEED}
            element={
              <Modal onClose={() => window.history.back()}>
                <OrderInfo order={null} ingredients={ingredients} />
              </Modal>
            }
          />
          <Route
            path={ROUTES.PROFILE_ORDER}
            element={
              <Modal onClose={() => window.history.back()}>
                <OrderInfo order={null} ingredients={ingredients} />
              </Modal>
            }
          /> */}
        </Routes>
      )}
    </>
  );
};

export default memo(App);
