import { memo } from 'react';

import type { JSX } from 'react';

import styles from './feed-order-page.module.css';

const FeedOrderPage = (): JSX.Element => {
  return (
    <div className={styles.container}>
      {/* TODO: Реализовать получение заказа по ID из URL параметров */}
      <div className="text text_type_main-medium">
        Страница заказа из ленты (в разработке)
      </div>
      {/* <OrderInfo order={null} ingredients={ingredients} showStatus={true} /> */}
    </div>
  );
};

export default memo(FeedOrderPage);
