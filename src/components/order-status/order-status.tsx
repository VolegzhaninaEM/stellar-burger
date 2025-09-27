import { memo } from 'react';

import type { JSX } from 'react';

import styles from './order-info.module.css';

const OrderStatus = (): JSX.Element => {
  return <section className={styles.container}></section>;
};

export default memo(OrderStatus);
