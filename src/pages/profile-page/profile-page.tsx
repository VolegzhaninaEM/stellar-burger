import { memo } from 'react';
import { Outlet } from 'react-router-dom';

import { ProfileMaster } from '@components/profile-master/profile-master.tsx';

import type { JSX } from 'react';

import styles from './profile-page.module.css';

export const ProfilePage = (): JSX.Element => {
  return (
    <div className={`${styles.profile__container} mt-20`}>
      <ProfileMaster />
      <Outlet />
    </div>
  );
};

export default memo(ProfilePage);
