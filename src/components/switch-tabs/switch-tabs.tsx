import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { memo, useState } from 'react';

import type { TIngredientType } from '@utils/types.ts';
import type { JSX } from 'react';

import styles from './switch-tabs.module.css';

type SwitchTabsProps = {
  ingredients: TIngredientType[];
};

const SwitchTabs = ({ ingredients }: SwitchTabsProps): JSX.Element => {
  const defaultIngredient = ingredients[0].type;
  const [current, setCurrent] = useState(defaultIngredient);

  return (
    <nav>
      <ul className={styles.menu}>
        {ingredients.map((ingredient, index: number) => (
          <li key={index}>
            <Tab
              active={current === ingredient.type}
              value={ingredient.type}
              onClick={setCurrent}
            >
              {ingredient.text}
            </Tab>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default memo(SwitchTabs);
