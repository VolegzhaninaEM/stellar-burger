import { useDrop } from 'react-dnd';
import { useDispatch } from 'react-redux';

import {
  addIngredient,
  moveIngredient,
  removeIngredient,
  setBun,
} from '../../services/constructorSlice';
import { useAppSelector } from '../../services/hooks';
import {
  decrementCounter,
  incrementCounter,
  resetCounter,
} from '../../services/ingredientsSlice';
import IngredientCardOuter from '@components/ingredient-card-outer/ingredient-card-outer.tsx';
import IngredientCard from '@components/ingredient-card/ingredient-card';

import type { TConstructorIngredient, TDroppedItem } from '@utils/types.ts';
import type { JSX } from 'react';

import ingredientCardsStyles from './ingredient-cards.module.css';

const IngredientCards = (props: { extendedClass?: string }): JSX.Element => {
  const { buns, ingredients } = useAppSelector((s) => s.burgerConstructor);
  const dispatch = useDispatch();

  const addElement = (element: TConstructorIngredient): void => {
    element = { ...element, uniqueId: element?._id };
    if (element.type === 'bun') {
      if (buns) {
        dispatch(decrementCounter(element.uniqueId));
        dispatch(resetCounter(element.uniqueId));
      }
      dispatch(setBun(element));
      dispatch(incrementCounter(element.uniqueId));
      dispatch(incrementCounter(element.uniqueId));
    }
    if (element.type !== 'bun') {
      dispatch(addIngredient(element));
      dispatch(incrementCounter(element.uniqueId));
    }
  };

  const deleteElement = (ingredient: TConstructorIngredient): void => {
    dispatch(removeIngredient(ingredient.uniqueId));
    dispatch(incrementCounter(ingredient.uniqueId));
  };

  const [{ opacity }, dropIngredient] = useDrop<
    TDroppedItem,
    unknown,
    { opacity: number }
  >({
    accept: 'ingredient',
    collect: (monitor) => ({
      opacity: monitor.isOver() ? 0.5 : 1,
    }),
    drop: ({ ingredient }) => addElement(ingredient),
  });

  return (
    <div
      ref={dropIngredient as unknown as React.Ref<HTMLDivElement>}
      style={{ opacity }}
      className={`${ingredientCardsStyles.cards}`}
    >
      {buns && <IngredientCardOuter position={'top'} bun={buns} />}
      <div className={props.extendedClass}>
        {ingredients?.map((ingredient: TConstructorIngredient, index: number) => {
          if (!ingredient) return null;
          return (
            <IngredientCard
              key={ingredient.uniqueId}
              ingredient={ingredient}
              deleteElement={deleteElement}
              index={index}
              moveIngredient={(from: number, to: number) =>
                dispatch(moveIngredient({ dragIndex: from, hoverIndex: to }))
              }
            />
          );
        })}
      </div>
      {buns && <IngredientCardOuter position={'bottom'} bun={buns} />}
    </div>
  );
};

export default IngredientCards;
