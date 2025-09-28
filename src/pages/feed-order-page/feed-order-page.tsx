import { memo } from 'react';

import OrderInfo from '../../components/order-info/order-info';
import { useAppSelector } from '../../services/hooks';

import type { JSX } from 'react';

import styles from './feed-order-page.module.css';

const FeedOrderPage = (): JSX.Element => {
  const ingredients = useAppSelector((state) => state.ingredients.items);

  return (
    <div className={styles.container}>
      <OrderInfo ingredients={ingredients} showStatus={true} />
    </div>
  );
};

export default memo(FeedOrderPage);
