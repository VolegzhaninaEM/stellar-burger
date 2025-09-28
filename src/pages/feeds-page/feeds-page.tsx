import OrderCards from '@/components/order-cards/order-cards';
import { useAppDispatch } from '@/services';
import { feedConnect, feedDisconnected } from '@/services/feedSlice';
import { memo, useEffect } from 'react';

import OrdersStatus from '@components/orders-status/orders-status';

import type { JSX } from 'react';

import feedsStyles from './feeds-page.module.css';

const Feeds = (): JSX.Element => {
  const dispatch = useAppDispatch();

  // Подключаемся к WebSocket для загрузки заказов при монтировании страницы
  // и отключаемся при размонтировании
  useEffect((): (() => void) => {
    dispatch(feedConnect());

    return (): void => {
      dispatch(feedDisconnected());
    };
  }, [dispatch]);

  return (
    <div className={feedsStyles.container} id="app">
      <h1 className={`${feedsStyles.title} text text_type_main-large`}>Лента заказов</h1>

      <div className={feedsStyles.feedsWrapper}>
        <section className={feedsStyles.ordersSection}>
          <OrderCards />
        </section>

        <aside className={feedsStyles.statisticsSection}>
          <OrdersStatus />
        </aside>
      </div>
    </div>
  );
};

export default memo(Feeds);
