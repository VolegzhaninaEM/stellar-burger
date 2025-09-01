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
            <li key={card._id}>
              <Card
                data={data}
                card={card}
                handleIngredientClick={handleIngredientClick}
              />
            </li>
          ) : null;
        })}
      </ul>
    </>
  );
};

export default memo(Cards);

// const navigate = useNavigate();
// const location = useLocation();
//
// const openModal = (): void => {
//   void navigate(`/ingredients/${ingredient._id}`, {
//     state: { background: location }, // запоминаем «фон»
//   });
// };
