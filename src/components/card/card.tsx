import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { memo } from 'react';
import { useDrag } from 'react-dnd';

import type { TCard } from '@utils/types.ts';
import type { JSX } from 'react';

import cardStyle from './card.module.css';

const Card = (props: TCard): JSX.Element => {
  const [{ opacity }, dragIngredient] = useDrag({
    type: 'ingredient',
    item: { ingredient: props.card, id: props.card._id, type: props.card.type },
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.5 : 1,
    }),
  });
  return (
    <div
      ref={dragIngredient as unknown as React.Ref<HTMLDivElement>}
      style={{ opacity: opacity }}
      className={cardStyle.card}
      onClick={() => props.handleIngredientClick(props.card)}
    >
      <Counter count={1} size={'default'} />
      <div className={cardStyle.cardWrap} key={props.card._id}>
        <img
          className={cardStyle.card__image}
          src={props.card.image}
          alt={props.card.name}
        />
        <div className={`${cardStyle.card__price} pb-1 pt-1`}>
          <p className="text text_type_digits-default mr-2">{props.card.price}</p>
          <CurrencyIcon type="primary" />
        </div>
        <h3 className={`${cardStyle.card__title} text text_type_main-default ml-2`}>
          {props.card.name}
        </h3>
      </div>
    </div>
  ) as JSX.Element;
};

export default memo(Card);
