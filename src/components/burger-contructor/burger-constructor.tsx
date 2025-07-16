import FinalPrice from '@components/final-price/final-price.tsx';
import IngredientCards from '@components/ingredient-cards/ingredient-cards.tsx';

import type { TIngredient } from '@utils/types';
import type { JSX } from 'react';

import styles from './burger-constructor.module.css';

type TBurgerConstructorProps = {
  ingredients: TIngredient[];
  handleOrderButtonClick: () => void;
  extendedClass?: string;
};

export const BurgerConstructor = ({
  ingredients,
  handleOrderButtonClick,
  extendedClass,
}: TBurgerConstructorProps): JSX.Element => {
  console.log(ingredients);

  return (
    <section className={styles.burger_constructor}>
      <IngredientCards data={ingredients} extendedClass={extendedClass} />
      <FinalPrice data={ingredients} handleOrderButtonClick={handleOrderButtonClick} />
    </section>
  );
};
