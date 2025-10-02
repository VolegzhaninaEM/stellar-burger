import {
  Button,
  EmailInput,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { memo, useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAppDispatch } from '../../services//hooks';
import { loginUser } from '../../services/authSlice';
import { ROUTES } from '@utils/constants';

import type { JSX, FormEvent } from 'react';

import styles from './login-page.module.css';
const LoginPage = (): JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const handleLogin = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      try {
        const data = await dispatch(loginUser({ email, password })).unwrap();
        if (data) {
          void navigate(ROUTES.HOME);
        }
      } catch (error) {
        console.error(error);
      }
    },
    [dispatch, email, password]
  );

  return (
    <div className={`${styles.container}`}>
      <form className={`${styles.form} mb-20`} onSubmit={(e) => void handleLogin(e)}>
        <legend className={`text text_type_main-medium p-8 ${styles.title}`}>
          Вход
        </legend>
        <EmailInput
          placeholder={'E-mail'}
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          name={'name'}
          size={'default'}
          extraClass="mb-6"
        />
        <PasswordInput
          placeholder={'Пароль'}
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          name={'name'}
          size={'default'}
          extraClass="mb-6"
        />

        <div className={`${styles.submitButton}`}>
          <Button htmlType="submit" type="primary" size="small">
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
  );
};

export default memo(LoginPage);
