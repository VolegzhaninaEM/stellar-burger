import { memo, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../services/hooks.ts';
import { fetchIngredients } from '../../services/ingredientsSlice.ts';
import IngredientDetails from '@components/ingredient-details/ingredient-details.tsx';
import { NotFound } from '@pages/not-found-page/not-found-page.tsx';

import type { JSX } from 'react';

export const IngerdientPage = (): JSX.Element => {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const ingredient = useAppSelector((s) =>
    s.ingredients.items.find((i) => i._id === id)
  );

  useEffect(() => {
    if (!ingredient) {
      void dispatch(fetchIngredients());
    }
  }, [dispatch, ingredient]);

  if (!ingredient) return <NotFound />;

  return <IngredientDetails card={ingredient} />;
};

export default memo(IngerdientPage);
