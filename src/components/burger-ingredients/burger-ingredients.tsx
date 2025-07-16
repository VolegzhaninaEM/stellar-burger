import { memo } from 'react';

import Cards from '@components/cards/cards.tsx';
import SwitchTabs from '@components/switch-tabs/switch-tabs.tsx';
import { ingredientTypes } from '@utils/constants.ts';

import type { TBurgerIngredientsProps } from '@utils/types.ts';
import type { JSX } from 'react';

import styles from './burger-ingredients.module.css';

const BurgerIngredients = ({
  ingredients,
  handleIngredientClick,
  extendedClass,
}: TBurgerIngredientsProps): JSX.Element => {
  console.log(ingredients);

  return (
    <div>
      <section className={styles.ingredients}>
        <SwitchTabs ingredients={ingredientTypes} />
        <div className={extendedClass}>
          {ingredientTypes.map((item, index) => {
            return (
              <Cards
                data={ingredients}
                types={ingredientTypes}
                typesItem={item.type}
                typesText={item.text}
                key={index}
                handleIngredientClick={handleIngredientClick}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default memo(BurgerIngredients);
