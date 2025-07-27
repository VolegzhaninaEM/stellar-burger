import { memo } from 'react';

import Card from '@components/card/card.tsx';

import type { TCards, TIngredient } from '@utils/types.ts';
import type { JSX } from 'react';

import cardsStyle from './cards.module.css';

const Cards = (props: TCards): JSX.Element => {
  const { data, typesItem, handleIngredientClick } = props;
  return (
    <>
      <ul className={cardsStyle.cards}>
        {data?.map((card: TIngredient) => {
          return card.type === typesItem ? (
            <Card
              data={data}
              key={card._id}
              card={card}
              handleIngredientClick={handleIngredientClick}
            />
          ) : null;
        })}
      </ul>
    </>
  );
};

export default memo(Cards);
