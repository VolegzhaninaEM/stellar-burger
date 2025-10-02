import { Button, EmailInput } from '@krgaa/react-developer-burger-ui-components';
import { memo, useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { forgotPassword } from '@utils/auth-api.ts';
import { ROUTES } from '@utils/constants.ts';

import type { JSX } from 'react';

import styles from './forgot-password.module.css';

const ForgotPassword = (): JSX.Element => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const resetPasswordHandler = useCallback(async () => {
    const response = await forgotPassword(email);
    if (response.success) {
      return navigate(ROUTES.RESET_PASSWORD, {
        state: { from: ROUTES.FORGOT_PASSWORD },
      });
    }
  }, [email]);

  return (
    <div className={`${styles.container}`}>
      <form className={`${styles.form} mb-20`}>
        <legend className={`text text_type_main-medium p-8 ${styles.title}`}>
          Восстановление пароля
        </legend>
        <EmailInput
          placeholder={'Укажите e-mail'}
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          name={'name'}
          size={'default'}
          extraClass="mb-6"
        />

        <div className={`${styles.submitButton}`}>
          <Button
            htmlType="button"
            type="primary"
            size="small"
            onClick={() => {
              resetPasswordHandler().catch(console.error);
            }}
          >
            <p className="text text_type_main-small"> Восстановить </p>
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

export default memo(ForgotPassword);
