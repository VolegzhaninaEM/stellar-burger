import {
  Button,
  EmailInput,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { memo, useState } from 'react';
import { Link } from 'react-router-dom';

import { ROUTES } from '@utils/constants.ts';

import type { JSX } from 'react';

import styles from './login-page.module.css';

export const LoginPage = (): JSX.Element => {
  const [value, setValue] = useState('');

  return (
    <>
      <div className={`${styles.container}`}>
        <form className={`${styles.form} mb-20`}>
          <legend className={`text text_type_main-medium p-8 ${styles.title}`}>
            Вход
          </legend>
          <EmailInput
            placeholder={'E-mail'}
            onChange={(e) => setValue(e.target.value)}
            value={value}
            name={'name'}
            size={'default'}
            extraClass="mb-6"
          />
          <PasswordInput
            placeholder={'Пароль'}
            onChange={(e) => setValue(e.target.value)}
            value={value}
            name={'name'}
            size={'default'}
            extraClass="mb-6"
          />

          <div className={`${styles.submitButton}`}>
            <Button htmlType="button" type="primary" size="small">
              <p className="text text_type_main-small"> Войти </p>
            </Button>
          </div>
        </form>

        <div>
          <p className="text text_type_main-small">
            Вы новый пользователь?{' '}
            <Link className={`${styles.link}`} to={ROUTES.REGISTER}>
              Зарегистрироваться
            </Link>
          </p>
          <p className="text text_type_main-small">
            Забыли пароль?{' '}
            <Link className={`${styles.link}`} to={ROUTES.FORGOT_PASSWORD}>
              Восстановите пароль
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default memo(LoginPage);
