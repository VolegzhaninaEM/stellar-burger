import type { TIngredient } from '@utils/types.ts';
import type { JSX } from 'react';

import styles from './ingredients-details.module.css';

type TIngredientDetailsProps = {
  card: TIngredient | undefined;
};

const IngredientDetails = ({ card }: TIngredientDetailsProps): JSX.Element => {
  if (!card) return <p data-cy="ingredient-not-found">Ингредиент не найден</p>;
  return (
    <div className="mb-15 mt-15 ml-10 mr-10" data-cy="ingredient-details">
      <h1
        className={`${styles.label} text text_type_main-large`}
        data-cy="ingredient-details-title"
      >
        Детали ингредиента
      </h1>

      <div className={styles.wrap}>
        <img
          className={`${styles.image} mb-4`}
          src={card.image}
          alt={card.name}
          data-cy="ingredient-details-image"
        />
        <p
          className={`${styles.name} text text_type_main-medium mb-8`}
          data-cy="ingredient-details-name"
        >
          {card.name}
        </p>

        <ul className={styles.energyValueWrap} data-cy="ingredient-details-nutrition">
          <li className={`${styles.energyValue} mr-5`} data-cy="nutrition-calories">
            <p className="text text_type_main-default text_color_inactive">
              Калории, ккал
            </p>
            <p className="text text_type_main-default text_color_inactive">
              {card.calories}
            </p>
          </li>

          <li className={`${styles.energyValue} mr-5`} data-cy="nutrition-proteins">
            <p className="text text_type_main-default text_color_inactive">Белки, г</p>
            <p className="text text_type_main-default text_color_inactive">
              {card.proteins}
            </p>
          </li>

          <li className={`${styles.energyValue} mr-5`} data-cy="nutrition-fats">
            <p className="text text_type_main-default text_color_inactive">Жиры, г</p>
            <p className="text text_type_main-default text_color_inactive">{card.fat}</p>
          </li>

          <li className={styles.energyValue} data-cy="nutrition-carbohydrates">
            <p className="text text_type_main-default text_color_inactive">
              Углеводы, г
            </p>
            <p className="text text_type_main-default text_color_inactive">
              {card.carbohydrates}
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default IngredientDetails;
