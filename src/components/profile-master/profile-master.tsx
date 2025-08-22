import { memo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import { logoutUser } from '../../services/authSlice.ts';
import { useAppDispatch } from '../../services/hooks.ts';
import { ROUTES } from '@utils/constants.ts';

import type { JSX } from 'react';

import styles from './profile-master.module.css';

export const ProfileMaster = (): JSX.Element => {
  const pending = `${styles.link} text text_type_main-medium text_color_inactive`;
  const active = `${styles.link} ${styles.main_link} text text_type_main-medium`;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = (): void => {
    void dispatch(logoutUser());
    void navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <section className={`${styles.master__container}`}>
      <nav className={`${styles.nav__container}`}>
        <NavLink
          className={({ isActive }) => (isActive ? active : pending)}
          to={ROUTES.PROFILE}
          end
        >
          Профиль
        </NavLink>
        <NavLink
          className={({ isActive }) => (isActive ? active : pending)}
          to={ROUTES.PROFILE_ORDERS}
          end
        >
          История заказов
        </NavLink>
        <NavLink
          className={({ isActive }) => (isActive ? active : pending)}
          to={ROUTES.LOGIN}
          end
          onClick={handleLogout}
        >
          Выход
        </NavLink>
      </nav>
      <p className={`text text_type_main-default text_color_inactive pt-2`}>
        В этом разделе вы можете
      </p>
      <p className={`text text_type_main-default text_color_inactive`}>
        изменить свои персональные данные
      </p>
    </section>
  );
};

export default memo(ProfileMaster);
