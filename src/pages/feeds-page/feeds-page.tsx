import OrderCards from '@/components/order-cards/order-cards';
import { memo } from 'react';

import type { JSX } from 'react';

import feedsStyles from './feeds-page.module.css';
const Feeds = (): JSX.Element => {
  return (
    <div className={feedsStyles.container}>
      <h1 className={feedsStyles.title}>Лента заказов</h1>

      <div className={feedsStyles.feedsWrapper}>
        <section className={feedsStyles.ordersSection}>
          <OrderCards />
        </section>

        <aside className={feedsStyles.statisticsSection}>
          {/* Здесь будет статистика заказов */}
          <div className={feedsStyles.loading}>Загрузка статистики...</div>
        </aside>
      </div>
    </div>
  );
};

export default memo(Feeds);
