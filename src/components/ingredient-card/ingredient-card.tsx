import {
  ConstructorElement,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';

import type { TIngredient } from '@utils/types.ts';
import type { JSX } from 'react';

import ingredientCardStyles from './ingredient-card.module.css';

const IngredientCard = ({
  ingredient,
  deleteElement,
}: {
  ingredient: TIngredient;
  deleteElement: (ingredient: TIngredient) => void;
}): JSX.Element => {
  return (
    <>
      <div className={`${ingredientCardStyles.card__wrap} mb-4`} id="inner-wrap">
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
            handleClose={() => deleteElement(ingredient)}
          />
        </div>
      </div>
    </>
  );
};

export default IngredientCard;
