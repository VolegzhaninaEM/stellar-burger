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
} from '@/pages';
import { memo, useEffect, useMemo } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import { setAuthChecked, initializeAuth } from '../../services/authSlice.ts';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { fetchIngredients } from '../../services/ingredientsSlice.ts';
import {
  clearProfileOrders,
  profileOrdersDisconnect,
} from '../../services/profileOrdersSlice.ts';
import { AppHeader } from '@components/app-header/app-header.tsx';
import IngredientDetails from '@components/ingredient-details/ingredient-details.tsx';
import Modal from '@components/modal/modal.tsx';
import OrderInfo from '@components/order-info/order-info.tsx';
import ProfileOrders from '@components/profile-orders/profile-orders.tsx';
import { ProfileUpdateForm } from '@components/profile-update-form/profile-update-form.tsx';
import { ProtectedResetRoute } from '@components/protected-reset-route/protected-reset-route.tsx';
import { ProtectedRouteElement } from '@components/protected-route-element/protected-route-element.tsx';
import { ROUTES } from '@utils/constants.ts';

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

  // Получаем заказы из разных источников для модальных окон
  const feedOrders = useAppSelector((s) => s.feed.orders);
  const profileOrders = useAppSelector((s) => s.profileOrders.orders);

  // Определяем текущий заказ для модального окна
  const orderId = location.pathname.split('/').pop();
  const currentOrder = useMemo(() => {
    // Определяем, где искать заказ в зависимости от URL
    if (location.pathname.startsWith('/profile/orders/')) {
      // Для заказов профиля ищем только в профиле
      const profileOrder = profileOrders.find((order) => order._id === orderId);
      if (profileOrder) {
        return profileOrder;
      }
    } else if (location.pathname.startsWith('/feed/')) {
      // Для заказов ленты ищем только в ленте
      const feedOrder = feedOrders.find((order) => order._id === orderId);
      if (feedOrder) {
        return feedOrder;
      }
    }

    return undefined;
  }, [feedOrders, profileOrders, orderId, location.pathname, state?.background]);

  const dispatch = useAppDispatch();

  // Используем новую функцию инициализации авторизации
  useEffect(() => {
    const initApp = async (): Promise<void> => {
      try {
        // Инициализируем авторизацию из сохраненных токенов
        await dispatch(initializeAuth()).unwrap();

        // Получаем ингредиенты независимо от статуса авторизации
        await dispatch(fetchIngredients());
      } catch (error) {
        console.error('Ошибка при инициализации приложения:', error);
        // Отмечаем проверку авторизации как завершенную в случае ошибки
        dispatch(setAuthChecked(true));
      }
    };

    void initApp();
  }, [dispatch]);

  // Отключаемся от WebSocket заказов профиля при выходе из системы
  useEffect(() => {
    if (!isAuth && authChecked) {
      dispatch(profileOrdersDisconnect());
      dispatch(clearProfileOrders());
    }
  }, [isAuth, authChecked, dispatch]);

  // Очищаем соединения при размонтировании компонента
  useEffect(() => {
    return (): void => {
      dispatch(profileOrdersDisconnect());
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
          <Route path={ROUTES.PROFILE_ORDER} element={<FeedOrderPage />} />
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
        <Route path={ROUTES.FEEDS} element={<FeedsPage />} />
        <Route path={ROUTES.FEED} element={<FeedOrderPage />} />
        <Route
          path={ROUTES.PROFILE_ORDER}
          element={<ProtectedRouteElement element={<FeedOrderPage />} />}
        />
      </Routes>

      {state?.background !== undefined && (
        <>
          {/* Модальное окно для ингредиентов */}
          {location.pathname.startsWith('/ingredients/') && (
            <Modal onClose={() => window.history.back()}>
              <IngredientDetails card={ingredient} />
            </Modal>
          )}

          {/* Модальное окно для заказов из ленты */}
          {location.pathname.startsWith('/feed/') &&
            !location.pathname.includes('/profile') && (
              <>
                <Modal onClose={() => window.history.back()}>
                  {currentOrder ? (
                    <OrderInfo
                      order={currentOrder}
                      ingredients={ingredients}
                      showStatus={true}
                    />
                  ) : (
                    <div>Заказ не найден</div>
                  )}
                </Modal>
              </>
            )}

          {/* Модальное окно для заказов из профиля */}
          {location.pathname.startsWith('/profile/orders/') && (
            <>
              {isAuth ? (
                <Modal onClose={() => window.history.back()}>
                  {currentOrder ? (
                    <OrderInfo
                      order={currentOrder}
                      ingredients={ingredients}
                      showStatus={true}
                    />
                  ) : (
                    <div>Заказ не найден</div>
                  )}
                </Modal>
              ) : (
                <Navigate to={ROUTES.LOGIN} replace />
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default memo(App);
