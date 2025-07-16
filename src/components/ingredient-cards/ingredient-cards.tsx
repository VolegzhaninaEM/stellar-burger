import IngredientCardOuter from '@components/ingredient-card-outer/ingredient-card-outer.tsx';
import IngredientCard from '@components/ingredient-card/ingredient-card.tsx';

import type { TIngredient } from '@utils/types.ts';
import type { JSX } from 'react';

const IngredientCards = (props: {
  data: TIngredient[];
  extendedClass?: string;
}): JSX.Element => {
  const positionText = {
    top: '(верх)',
    bottom: '(низ)',
  };

  return (
    <>
      <IngredientCardOuter
        data={props.data}
        position="top"
        positionText={positionText.top}
      />
      <div className={props.extendedClass}>
        <IngredientCard data={props.data} />
      </div>
      <IngredientCardOuter
        position="bottom"
        data={props.data}
        positionText={positionText.bottom}
      />
    </>
  );
};

export default IngredientCards;
