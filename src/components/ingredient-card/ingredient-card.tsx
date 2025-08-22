import {
  ConstructorElement,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useDrag, useDrop } from 'react-dnd';

import type { TConstructorIngredient } from '@utils/types.ts';
import type { JSX } from 'react';

import ingredientCardStyles from './ingredient-card.module.css';
type TDragItem = {
  index: number;
  id: string;
  type: 'ingredient';
};
const IngredientCard = ({
  ingredient,
  deleteElement,
  index,
  moveIngredient,
}: {
  ingredient: TConstructorIngredient;
  deleteElement: (ingredient: TConstructorIngredient) => void;
  index: number;
  moveIngredient: (from: number, to: number) => void;
}): JSX.Element => {
  const [, dropRef] = useDrop<TDragItem, void, void>({
    accept: 'ingredient-in-constructor',
    hover: (item) => {
      if (item.index !== index) {
        moveIngredient(item.index, index);
        item.index = index;
      }
    },
  });

  const [{ opacity }, dragRef] = useDrag({
    type: 'ingredient-in-constructor',
    item: { index },
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.5 : 1,
    }),
  });

  return (
    <div
      className={`${ingredientCardStyles.card__wrap} mb-4`}
      id="inner-wrap"
      ref={(node) => {
        dragRef(node);
        dropRef(node);
      }}
      style={{ opacity }}
    >
      <div className={`${ingredientCardStyles.card__icon} mr-2`}>
        <DragIcon type="primary" />
      </div>
      <div className={`${ingredientCardStyles.card__center} mr-2`} key={ingredient._id}>
        <ConstructorElement
          text={ingredient.name}
          price={ingredient.price}
          thumbnail={ingredient.image}
          handleClose={() => deleteElement(ingredient)}
        />
      </div>
    </div>
  );
};

export default IngredientCard;
