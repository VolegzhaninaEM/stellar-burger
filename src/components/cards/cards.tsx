import { memo } from 'react';

import Card from '@components/card/card.tsx';

import type { TCards, TIngredient } from '@utils/types.ts';
import type { JSX } from 'react';

import cardsStyle from './cards.module.css';

const Cards = (props: TCards): JSX.Element => {
  const { typesText, data, typesItem, handleIngredientClick } = props;
  return (
    <div>
      <h2 className="text text_type_main-medium pb-5 mb-1 mt-5 pt-5" id={typesText}>
        {typesText}
      </h2>
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
    </div>
  );
};

export default memo(Cards);
