import { memo } from 'react';
import { useParams } from 'react-router-dom';

import { useAppSelector } from '../../services/hooks.ts';
import IngredientDetails from '@components/ingredient-details/ingredient-details.tsx';
import { NotFound } from '@pages/not-found-page/not-found-page.tsx';

import type { JSX } from 'react';

const IngredientPage = (): JSX.Element => {
  const { id } = useParams();
  const ingredients = useAppSelector((s) => s.ingredients.items);
  const ingredient = ingredients.find((i) => i._id === id);

  if (!ingredient) return <NotFound />;

  return <IngredientDetails card={ingredient} />;
};

export default memo(IngredientPage);
