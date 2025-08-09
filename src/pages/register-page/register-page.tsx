import {
  Button,
  EmailInput,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { memo, useState } from 'react';
import { Link } from 'react-router-dom';

import { ROUTES } from '@utils/constants.ts';

import type { JSX } from 'react';

import styles from './register-page.module.css';

export const RegisterPage = (): JSX.Element => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <>
      <div className={`${styles.container}`}>
        <form className={`${styles.form} mb-20`}>
          <legend className={`text text_type_main-medium p-8 ${styles.title}`}>
            Регистрация
          </legend>
          <Input
            name="name"
            placeholder="Имя"
            size="default"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            extraClass="mb-6"
          />
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
            <Button htmlType="button" type="primary" size="small">
              <p className="text text_type_main-small"> Зарегистрироваться </p>
            </Button>
          </div>
        </form>

        <div>
          <p className="text text_type_main-small">
            Уже зарегистрированы?{' '}
            <Link className={`${styles.link}`} to={ROUTES.LOGIN}>
              Войти
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default memo(RegisterPage);
