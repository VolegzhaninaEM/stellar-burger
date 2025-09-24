import {
  ConstructorElement,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useRef, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import type { TDragItem, TIngredientCardProps } from '@utils/types.ts';
import type { FC } from 'react';

const IngredientCard: FC<TIngredientCardProps> = ({
  ingredient,
  index,
  deleteElement,
  moveIngredient,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ opacity }, drag] = useDrag<TDragItem, unknown, { opacity: number }>({
    type: 'ingredient-in-constructor',
    item: { index, id: ingredient._id, type: 'ingredient' },
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.5 : 1,
    }),
  });

  const [, drop] = useDrop<TDragItem, unknown, unknown>({
    accept: 'ingredient-in-constructor',
    hover: (item) => {
      if (item.index !== index) {
        moveIngredient(item.index, index);
        item.index = index;
      }
    },
  });

  // Правильное «сцепление» коллбэков react-dnd
  useEffect(() => {
    if (ref.current) {
      drag(drop(ref.current));
    }
  }, [drag, drop]);

  return (
    <div ref={ref} style={{ opacity }} className="mb-4">
      <DragIcon type="primary" />
      <ConstructorElement
        text={ingredient.name}
        price={ingredient.price}
        thumbnail={ingredient.image}
        handleClose={() => deleteElement(ingredient)}
      />
    </div>
  );
};

export default IngredientCard;
