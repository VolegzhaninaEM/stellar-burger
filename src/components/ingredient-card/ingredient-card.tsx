import {
  ConstructorElement,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';

import type { TIngredient } from '@utils/types.ts';
import type { JSX } from 'react';

import ingredientCardStyles from './ingredient-card.module.css';

type TIngredientCard = {
  data: TIngredient[];
};

const IngredientCard = (props: TIngredientCard): JSX.Element => {
  return (
    <>
      {props.data?.map((ingredient: TIngredient, index: number) => {
        return ingredient.type !== 'bun' ? (
          <div
            className={`${ingredientCardStyles.card__wrap} mb-4`}
            id="inner-wrap"
            key={index}
          >
            <div className={`${ingredientCardStyles.card__icon} mr-2`}>
              <DragIcon type="primary" />
            </div>
            <div
              className={`${ingredientCardStyles.card__center} mr-2`}
              key={ingredient._id}
            >
              <ConstructorElement
                text={ingredient.name}
                price={ingredient.price}
                thumbnail={ingredient.image}
              />
            </div>
          </div>
        ) : null;
      })}
    </>
  );
};

export default IngredientCard;
