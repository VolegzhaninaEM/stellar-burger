import OrderCards from '@/components/order-cards/order-cards';
import { useAppDispatch } from '@/services';
import { feedConnect, feedDisconnect } from '@/services/feedSlice';
import { WS_URLS } from '@/services/websocketInstances';
import { memo, useEffect } from 'react';

import OrdersStatus from '@components/orders-status/orders-status';

import type { JSX } from 'react';

import feedsStyles from './feeds-page.module.css';

const Feeds = (): JSX.Element => {
  const dispatch = useAppDispatch();

  // Управление WebSocket соединением для ленты заказов
  useEffect(() => {
    // Открываем соединение при входе на страницу
    dispatch(feedConnect({ url: WS_URLS.FEED }));

    // Закрываем соединение при покидании страницы
    return (): void => {
      dispatch(feedDisconnect());
    };
  }, [dispatch]);

  return (
    <div className={feedsStyles.container}>
      <h1 className={`${feedsStyles.title} text text_type_main-large`}>Лента заказов</h1>

      <div className={feedsStyles.feedsWrapper}>
        <section className={feedsStyles.ordersSection}>
          <OrderCards mode="feed" showStatus={false} />
        </section>

        <aside className={feedsStyles.statisticsSection}>
          <OrdersStatus />
        </aside>
      </div>
    </div>
  );
};

export default memo(Feeds);
