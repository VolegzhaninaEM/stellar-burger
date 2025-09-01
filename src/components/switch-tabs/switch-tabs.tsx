import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { memo } from 'react';

import type { TIngredientType } from '@utils/types.ts';
import type { JSX, FC } from 'react';

import styles from './switch-tabs.module.css';

type TSwitchTabsProps = {
  ingredients: TIngredientType[];
  activeTab: string;
  onClick: (value: string) => void;
};

const SwitchTabs: FC<TSwitchTabsProps> = ({
  ingredients,
  activeTab,
  onClick,
}): JSX.Element => {
  return (
    <nav>
      <ul className={styles.menu}>
        {ingredients.map((ingredient, index: number) => (
          <li key={index}>
            <Tab
              active={activeTab === ingredient.type}
              value={ingredient.type}
              onClick={onClick}
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
