import { Button, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { useMemo } from 'react';

import type { TIngredient } from '@utils/types.ts';
import type { JSX } from 'react';

import styles from './final-price.module.css';

type TPriceData = {
  data: TIngredient[];
  handleOrderButtonClick: () => void;
};

const FinalPrice = ({ data, handleOrderButtonClick }: TPriceData): JSX.Element => {
  const totalPrice = useMemo(() => {
    if (!data) return 0;

    return data.reduce((sum, item) => {
      // булка считается дважды
      const multiplier = item.type === 'bun' ? 2 : 1;
      return sum + item.price * multiplier;
    }, 0);
  }, [data]);
  return (
    <div className={`${styles.burger_currency} ${styles.burger_price}`}>
      <div className={styles.burger_currency}>
        <p className="text text_type_main-medium mr-2">{totalPrice}</p>
        <CurrencyIcon type="primary" className="text text_type_main-medium mr-2" />
      </div>
      <Button
        htmlType="button"
        type="primary"
        size="medium"
        onClick={handleOrderButtonClick}
      >
        Оформить заказ
      </Button>
    </div>
  );
};

export default FinalPrice;
