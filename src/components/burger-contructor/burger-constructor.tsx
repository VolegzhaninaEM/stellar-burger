import type { TIngredient } from '@utils/types';
import type { JSX } from 'react';

import styles from './burger-constructor.module.css';

type TBurgerConstructorProps = {
  ingredients: TIngredient[];
};

export const BurgerConstructor = ({
  ingredients,
}: TBurgerConstructorProps): JSX.Element => {
  console.log(ingredients);

  return <section className={styles.burger_constructor}></section>;
};
