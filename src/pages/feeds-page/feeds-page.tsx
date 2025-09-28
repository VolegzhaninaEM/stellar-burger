import OrderCards from '@/components/order-cards/order-cards';
import { useAppDispatch } from '@/services';
import { fetchIngredients } from '@/services/ingredientsSlice';
import { memo, useEffect } from 'react';

import OrdersStatus from '@components/orders-status/orders-status';

import type { JSX } from 'react';

import feedsStyles from './feeds-page.module.css';

const Feeds = (): JSX.Element => {
  const dispatch = useAppDispatch();

  // Загружаем ингредиенты при монтировании (нужны для отображения заказов)
  useEffect(() => {
    void dispatch(fetchIngredients());
  }, [dispatch]);

  return (
    <div className={feedsStyles.container} id="app">
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
