import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { NavLink } from 'react-router-dom';

import { ROUTES } from '@utils/constants.ts';

import type { FC, JSX } from 'react';

import styles from './app-header.module.css';

type TAppHeaderProps = {
  isAuth: boolean | null;
};

export const AppHeader: FC<TAppHeaderProps> = ({ isAuth }): JSX.Element => {
  const activeLink = `${styles.link} ${styles.link_active}`;
  const pendingText = 'text text_type_main-default text_color_inactive ml-2';
  const activeText = 'text text_type_main-default ml-2';
  const linkLast = `${styles.link} ${styles.link_position_last}`;
  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          {/* Тут должны быть ссылки, а не например кнопки или абзацы */}
          <NavLink
            to={ROUTES.HOME}
            className={({ isActive }) => (isActive ? activeLink : styles.link)}
          >
            {({ isActive }) => (
              <>
                <BurgerIcon type={isActive ? 'primary' : 'secondary'} />
                <p className={isActive ? activeText : pendingText}>Конструктор</p>
              </>
            )}
          </NavLink>
          <NavLink
            to={ROUTES.FEEDS}
            className={({ isActive }) =>
              isActive ? `${activeLink} ml-10` : `${styles.link} ml-10`
            }
          >
            {({ isActive }) => (
              <>
                <ListIcon type={isActive ? 'primary' : 'secondary'} />
                <p className={isActive ? activeText : pendingText}>Лента заказов</p>
              </>
            )}
          </NavLink>
        </div>
        <NavLink to={ROUTES.HOME} className={styles.logo}>
          <Logo />
        </NavLink>
        <NavLink
          to={isAuth ? ROUTES.PROFILE : ROUTES.LOGIN}
          className={({ isActive }) =>
            isActive ? `${activeLink} ${linkLast}` : `${styles.link}`
          }
        >
          {({ isActive }) => (
            <>
              <ProfileIcon type={isActive ? 'primary' : 'secondary'} />
              <p className={isActive ? activeText : pendingText}>Личный кабинет</p>
            </>
          )}
        </NavLink>
      </nav>
    </header>
  );
};
