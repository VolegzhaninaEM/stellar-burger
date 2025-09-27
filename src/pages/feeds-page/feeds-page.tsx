import { memo } from 'react';

import type { JSX } from 'react';

import feedsStyles from './feeds-page.module.css';

const FeedsPage = (): JSX.Element => {
  return (
    <div className={feedsStyles.container}>
      <h1 className={feedsStyles.title}>Лента заказов</h1>

      <div className={feedsStyles.feedsWrapper}>
        <section className={feedsStyles.ordersSection}>
          {/* Здесь будет список заказов */}
          <div className={feedsStyles.loading}>Загрузка заказов...</div>
        </section>

        <aside className={feedsStyles.statisticsSection}>
          {/* Здесь будет статистика заказов */}
          <div className={feedsStyles.loading}>Загрузка статистики...</div>
        </aside>
      </div>
    </div>
  );
};

export default memo(FeedsPage);
