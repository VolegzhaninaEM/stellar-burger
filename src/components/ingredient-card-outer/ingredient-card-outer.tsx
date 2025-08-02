import { ConstructorElement } from '@krgaa/react-developer-burger-ui-components';

import type { TIngredient } from '@utils/types.ts';
import type { JSX } from 'react';

import styles from './ingredient-card-outer.module.css';

const IngredientCardOuter = (props: {
  position: 'top' | 'bottom' | undefined;
  bun: TIngredient;
}): JSX.Element => {
  return (
    <div className={`${styles.card__outer} ml-8 mr-4 mb-4 mt-4`}>
      <ConstructorElement
        type={props.position}
        isLocked={true}
        text={`${props.bun?.name} ${props.position === 'top' ? '(верх)' : '(низ)'}`}
        price={props.bun?.price}
        thumbnail={props.bun?.image}
      />
    </div>
  );
};

export default IngredientCardOuter;
