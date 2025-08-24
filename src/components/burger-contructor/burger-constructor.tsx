import { useAppSelector } from '../../services/hooks.ts';
import FinalPrice from '@components/final-price/final-price.tsx';
import IngredientCards from '@components/ingredient-cards/ingredient-cards.tsx';

import type { JSX } from 'react';

import styles from './burger-constructor.module.css';

type TBurgerConstructorProps = {
  handleOrderButtonClick: () => void;
  extendedClass?: string;
  caption: string;
};

export const BurgerConstructor = ({
  handleOrderButtonClick,
  extendedClass,
  caption,
}: TBurgerConstructorProps): JSX.Element => {
  const { ingredients, buns } = useAppSelector((s) => s.burgerConstructor);

  return (
    <section className={styles.burger_constructor}>
      <IngredientCards extendedClass={extendedClass} />
      {buns !== null ? (
        <FinalPrice
          ingredients={ingredients}
          buns={buns}
          handleOrderButtonClick={handleOrderButtonClick}
          caption={caption}
        />
      ) : (
        <p className={`text text_type_main-default text_color_inactive`}>
          {ingredients.length > 0
            ? 'Добавьте булку в конструктор бургера'
            : 'Выберите ингредиенты и перетащите их в конструктор бургера'}
        </p>
      )}
    </section>
  );
};
