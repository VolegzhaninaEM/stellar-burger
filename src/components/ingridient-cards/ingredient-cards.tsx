import IngredientCardOuter from '@components/ingredient-card-outer/ingredient-card-outer.tsx';

import type { JSX } from 'react';

const IngredientCards = (): JSX.Element => {
  // const position = {
  //   top: 'top',
  //   bottom: 'bottom',
  // };
  //
  // const positionText = {
  //   top: '(верх)',
  //   bottom: '(низ)',
  // };

  return (
    <div>
      cards
      <IngredientCardOuter />
    </div>
  );
};

export default IngredientCards;
