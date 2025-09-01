import { memo } from 'react';
import { Link } from 'react-router-dom';

import { ROUTES } from '@utils/constants.ts';

import type { JSX } from 'react';

import styles from './not-found-page.module.css';

export const NotFound = (): JSX.Element => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className="text text_type_main-large mb-10">Упс! Ошибка 404</h1>
          <p className="text text_type_main-medium text_color_inactive mb-2">
            Страница не найдена
          </p>
          <p className="text text_type_main-default text_color_inactive">
            Перейти на{' '}
            <Link
              to={ROUTES.HOME}
              className={`${styles.link} text text_type_main-default`}
            >
              главную
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default memo(NotFound);
