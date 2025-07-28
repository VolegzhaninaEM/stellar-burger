import { memo, useEffect, useRef, useState } from 'react';

import { useAppSelector } from '../../services/hooks';
import Cards from '@components/cards/cards.tsx';
import SwitchTabs from '@components/switch-tabs/switch-tabs.tsx';
import { ingredientTypes } from '@utils/constants.ts';

import type { TBurgerIngredientsProps } from '@utils/types.ts';
import type { JSX } from 'react';

import styles from './burger-ingredients.module.css';

const BurgerIngredients = ({
  handleIngredientClick,
  extendedClass,
}: TBurgerIngredientsProps): JSX.Element => {
  const ingredients = useAppSelector((s) => s.ingredients.items);
  const [activeTab, setActiveTab] = useState(ingredientTypes[0].type);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const setSectionRef =
    (type: string) =>
    (el: HTMLDivElement | null): void => {
      sectionRefs.current[type] = el;
    };

  const handleTabClick = (type: string): void => {
    setActiveTab(type);
    sectionRefs.current[type]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleScroll = (): void => {
    const scrollContainer = containerRef.current;
    if (!scrollContainer) return;

    const containerTop = scrollContainer.getBoundingClientRect().top;

    let closestSectionType = activeTab;
    let minDistance = Infinity;

    ingredientTypes.forEach(({ type: sectionType }) => {
      const sectionElement = sectionRefs.current[sectionType];
      if (!sectionElement) return;

      const headerTop = sectionElement.getBoundingClientRect().top;
      const distance = Math.abs(headerTop - containerTop);

      if (distance < minDistance) {
        minDistance = distance;
        closestSectionType = sectionType;
      }
    });

    setActiveTab(closestSectionType);
  };

  useEffect(() => {
    const scrollElement = containerRef.current;
    if (!scrollElement) return;

    scrollElement.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // первый расчёт
    return (): void => scrollElement.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div>
      <section className={styles.ingredients}>
        <SwitchTabs
          ingredients={ingredientTypes}
          activeTab={activeTab}
          onClick={handleTabClick}
        />
        <div className={extendedClass} ref={containerRef}>
          {ingredientTypes.map((item, index) => {
            return (
              <div key={index}>
                <h2
                  ref={setSectionRef(item.type)}
                  className="text text_type_main-medium pb-5 mb-1 mt-5 pt-5"
                >
                  {item.text}
                </h2>
                <Cards
                  data={ingredients.filter(
                    (ingredient) => ingredient.type === item.type
                  )}
                  types={ingredientTypes}
                  typesItem={item.type}
                  key={index}
                  handleIngredientClick={handleIngredientClick}
                />
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default memo(BurgerIngredients);
