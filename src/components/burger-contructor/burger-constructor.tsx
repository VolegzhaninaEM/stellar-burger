import { useAppSelector } from '../../services/hooks';
import FinalPrice from '@components/final-price/final-price.tsx';
import IngredientCards from '@components/ingredient-cards/ingredient-cards.tsx';

import type { FC, JSX } from 'react';

import styles from './burger-constructor.module.css';

type TBurgerConstructorProps = {
  handleOrderButtonClick: () => void;
  extendedClass?: string;
  caption: string;
};

export const BurgerConstructor: FC<TBurgerConstructorProps> = ({
  handleOrderButtonClick,
  extendedClass,
  caption,
}): JSX.Element => {
  const { ingredients, buns } = useAppSelector((s) => s.burgerConstructor);

  return (
    <section className={styles.burger_constructor} data-cy="burger-constructor">
      <IngredientCards extendedClass={extendedClass} />
      <FinalPrice
        ingredients={ingredients}
        buns={buns}
        handleOrderButtonClick={handleOrderButtonClick}
        caption={caption}
        hasBuns={buns !== null}
      />
      {buns === null && (
        <p
          className={`text text_type_main-default text_color_inactive mt-4`}
          data-cy="empty-constructor-message"
        >
          {ingredients.length > 0
            ? 'Добавьте булку для оформления заказа'
            : 'Выберите ингредиенты и перетащите их в конструктор бургера'}
        </p>
      )}
    </section>
  );
};
