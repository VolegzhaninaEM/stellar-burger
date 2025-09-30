import { memo } from 'react';

import OrderCards from '@components/order-cards/order-cards';

import type { JSX } from 'react';

import styles from './profile-orders.module.css';

const ProfileOrders = (): JSX.Element => {
  return (
    <section className={styles.mainWrap}>
      <OrderCards mode="profile" showStatus={true} />
    </section>
  );
};

export default memo(ProfileOrders);
