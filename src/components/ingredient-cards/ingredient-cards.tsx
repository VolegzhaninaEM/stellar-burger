import { useMemo } from 'react';
import { useDrop } from 'react-dnd';
import { useDispatch } from 'react-redux';

import {
  addIngredient,
  removeIngredient,
  setBun,
} from '../../services/constructorSlice.ts';
import { useAppSelector } from '../../services/hooks.ts';
import IngredientCardOuter from '@components/ingredient-card-outer/ingredient-card-outer.tsx';
import IngredientCard from '@components/ingredient-card/ingredient-card';

import type { TIngredient } from '@utils/types.ts';
import type { JSX } from 'react';

import ingredientCardSstyles from './ingredient-cards.module.css';

const IngredientCards = (props: { extendedClass?: string }): JSX.Element => {
  const { buns, ingredients } = useAppSelector((s) => s.burgerConstructor);
  const ingredientsId: string[] = [];
  const prices: number[] = [];
  const dispatch = useDispatch();
  useMemo(() => {
    if (buns) {
      ingredientsId.push(buns._id);
      prices.push(buns.price * 2);
    }
  }, [buns, ingredientsId, prices]);

  useMemo(
    () =>
      ingredients?.filter((ingredient) => {
        ingredientsId?.push(ingredient._id);
        prices?.push(ingredient.price);
      }),
    [ingredients, ingredientsId, prices]
  );

  const addElement = (element: TIngredient): void => {
    element = { ...element, _id: element._id };
    if (element.type === 'bun') {
      dispatch(setBun(element));
    }
    if (element.type !== 'bun') {
      dispatch(addIngredient(element));
    }
  };

  const deleteElement = (ingredient: TIngredient): void => {
    dispatch(removeIngredient(ingredient._id));
  };

  const [{ opacity }, dropIngredient] = useDrop(() => ({
    accept: 'ingredient',
    collect: (monitor): { opacity: number } => {
      return {
        opacity: monitor.isOver() ? 0.5 : 1,
      };
    },
    drop: (item: { ingredient: TIngredient }): void => {
      addElement(item.ingredient);
    },
  }));

  return (
    <div
      ref={dropIngredient as unknown as React.Ref<HTMLDivElement>}
      style={{ opacity }}
      className={`${ingredientCardSstyles.cards}`}
    >
      {buns && <IngredientCardOuter position={'top'} bun={buns} />}
      <div className={props.extendedClass}>
        {ingredients?.map((ingredient: TIngredient) => {
          return (
            <IngredientCard
              key={ingredient._id}
              ingredient={ingredient}
              deleteElement={deleteElement}
            />
          );
        })}
      </div>
      {buns && <IngredientCardOuter position={'bottom'} bun={buns} />}
    </div>
  );
};

export default IngredientCards;
