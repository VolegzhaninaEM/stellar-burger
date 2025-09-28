import { memo } from 'react';

import OrderCards from '@components/order-cards/order-cards.tsx';

import type { JSX } from 'react';

import styles from './profile-orders.module.css';

export const ProfileOrders = (): JSX.Element => {
  return (
    <section className={styles.mainWrap}>
      <OrderCards />
    </section>
  );
};

export default memo(ProfileOrders);
