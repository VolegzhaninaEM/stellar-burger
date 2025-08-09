import {
  Button,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { memo, useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { resetPassword } from '@utils/auth-api.ts';
import { ROUTES } from '@utils/constants.ts';

import type { JSX } from 'react';

import styles from './reset-password.module.css';

export const ResetPassword = (): JSX.Element => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [value, setValue] = useState('');

  const saveNewPassword = useCallback(async (): Promise<void> => {
    const response = await resetPassword(newPassword, value);
    if (response.success) {
      await navigate(ROUTES.LOGIN);
    }
  }, [newPassword, value]);

  return (
    <div className={`${styles.container}`}>
      <form className={`${styles.form} mb-20`}>
        <legend className={`text text_type_main-medium p-8 ${styles.title}`}>
          Восстановление пароля
        </legend>
        <PasswordInput
          placeholder={'Введите свой пароль'}
          onChange={(e) => setNewPassword(e.target.value)}
          value={newPassword}
          name={'name'}
          size={'default'}
          extraClass="mb-6"
        />
        <Input
          name="name"
          placeholder={'Введите код из письма'}
          size="default"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          extraClass="mb-6"
        />

        <div className={`${styles.submitButton}`}>
          <Button
            htmlType="button"
            type="primary"
            size="small"
            onClick={() => saveNewPassword}
          >
            <p className="text text_type_main-small"> Сохранить </p>
          </Button>
        </div>
      </form>

      <div>
        <p className="text text_type_main-small">
          Вспомнили пароль?{' '}
          <Link className={`${styles.link}`} to={ROUTES.LOGIN}>
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
};

export default memo(ResetPassword);
