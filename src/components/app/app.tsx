import {
  ForgotPassword,
  HomePage,
  LoginPage,
  ProfilePage,
  RegisterPage,
  ResetPassword,
} from '@/pages';
import { memo } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header.tsx';
import IngredientPage from '@pages/ingredient-page/ingredient-page.tsx';
import { ROUTES } from '@utils/constants.ts';

import type { JSX } from 'react';

export const App = (): JSX.Element => {
  return (
    <>
      <AppHeader />
      <Router>
        <Routes>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
          <Route path={ROUTES.INGREDIENTS} element={<IngredientPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
          <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
        </Routes>
      </Router>
    </>
  );
};

export default memo(App);
