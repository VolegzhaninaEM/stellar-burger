import {
  Button,
  EmailInput,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { memo, useEffect, useState } from 'react';

import { fetchUser, updateUser } from '../../services/authSlice.ts';
import { useAppDispatch, useAppSelector } from '../../services/hooks.ts';
import { getCookie } from '@utils/cookies.ts';

import type { JSX } from 'react';

import styles from './profile-update-form.module.css';

export const ProfileUpdateForm = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [initial, setInitial] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    const token = getCookie('accessToken');
    if (token) {
      void dispatch(fetchUser());
    }
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      const data = { name: user.name, email: user.email, password: '' };
      setForm(data);
      setInitial(data);
    }
  }, [user]);

  const handleSave = async (): Promise<void> => {
    await dispatch(updateUser({ name: form.name, email: form.email }));
    setInitial({ ...form, password: '' });
  };

  const handleCancel = (): void => {
    setForm(initial);
  };

  return (
    <div className={`${styles.container}`}>
      <form
        className={`${styles.form} mb-20`}
        onSubmit={(e) => {
          e.preventDefault();
          void handleSave();
        }}
      >
        <Input
          name="name"
          placeholder="Имя"
          size="default"
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          extraClass="mb-6"
        />
        <EmailInput
          placeholder={'E-mail'}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          value={form.email}
          name={'name'}
          size={'default'}
          extraClass="mb-6"
        />
        <PasswordInput
          placeholder={'Пароль'}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          value={form.password}
          name={'name'}
          size={'default'}
          extraClass="mb-6"
        />

        <div className={styles.submitButton}>
          <Button htmlType="button" type="secondary" onClick={handleCancel}>
            Отмена
          </Button>
          <Button htmlType="submit" type="primary">
            Сохранить
          </Button>
        </div>
      </form>
    </div>
  );
};

export default memo(ProfileUpdateForm);
