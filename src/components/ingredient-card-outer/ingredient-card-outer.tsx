import { ConstructorElement } from '@ya.praktikum/react-developer-burger-ui-components';

import type { TIngredient } from '@utils/types.ts';
import type { JSX } from 'react';

import styles from './ingredient-card-outer.module.css';

const IngredientCardOuter = (props: {
  position: 'top' | 'bottom' | undefined;
  data: TIngredient[];
  positionText: string;
}): JSX.Element => {
  return (
    <div className={`${styles.card__outer} ml-8 mr-4 mb-4 mt-4`}>
      <ConstructorElement
        type={props.position}
        isLocked={true}
        text={`${props.data[0]?.name} ${props.positionText}`}
        price={props.data[0]?.price}
        thumbnail={props.data[0]?.image}
      />
    </div>
  );
};

export default IngredientCardOuter;
