import { Button, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { useMemo } from 'react';

import type { TConstructorIngredient } from '@utils/types.ts';
import type { JSX } from 'react';

import styles from './final-price.module.css';

type TPriceData = {
  ingredients: TConstructorIngredient[];
  buns: TConstructorIngredient | null;
  handleOrderButtonClick: () => void;
  caption: string;
  hasBuns: boolean;
};

const FinalPrice = ({
  ingredients,
  buns,
  handleOrderButtonClick,
  caption,
  hasBuns,
}: TPriceData): JSX.Element => {
  const totalPrice = useMemo(() => {
    if (!ingredients || !buns) return buns ? buns.price * 2 : 0;
    const ingredientsPrice = ingredients.reduce((sum, item) => {
      return sum + item.price;
    }, 0);
    return ingredientsPrice + buns.price * 2;
  }, [ingredients, buns]);

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
        disabled={!hasBuns}
      >
        {caption}
      </Button>
    </div>
  );
};

export default FinalPrice;
