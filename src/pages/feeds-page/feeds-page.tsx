import OrderCards from '@/components/order-cards/order-cards';
import { memo } from 'react';

import OrdersStatus from '@components/orders-status/orders-status';

import type { JSX } from 'react';

import feedsStyles from './feeds-page.module.css';

const Feeds = (): JSX.Element => {
  return (
    <div className={feedsStyles.container}>
      <h1 className={`${feedsStyles.title} text text_type_main-large`}>Лента заказов</h1>

      <div className={feedsStyles.feedsWrapper}>
        <section className={feedsStyles.ordersSection}>
          <OrderCards mode="feed" showStatus={false} enablePeriodicUpdate={true} />
        </section>

        <aside className={feedsStyles.statisticsSection}>
          <OrdersStatus />
        </aside>
      </div>
    </div>
  );
};

export default memo(Feeds);
