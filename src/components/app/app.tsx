import { useEffect, useState } from 'react';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-contructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { apiConfig } from '@utils/constants.ts';

import type { TIngredient, TIngredientsResponse } from '@utils/types.ts';
import type { JSX } from 'react';

import styles from './app.module.css';

export const App = (): JSX.Element => {
  const [ingredients, setIngredients] = useState<TIngredient[]>([]);

  const getIngredients = async (): Promise<TIngredientsResponse> => {
    const response: Response = await fetch(`${apiConfig.baseUrl}/ingredients`);
    if (!response.ok) {
      throw new Error(`Ошибка: ${response.status}`);
    }
    return (await response.json()) as TIngredientsResponse;
  };

  useEffect(() => {
    function getData(): void {
      getIngredients()
        .then((res: TIngredientsResponse) => {
          if (res.success) {
            setIngredients(res.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }

    getData();
  }, []);
  return (
    <div className={styles.app}>
      <AppHeader />
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Соберите бургер
      </h1>
      <main className={`${styles.main} pl-5 pr-5`}>
        <BurgerIngredients ingredients={ingredients} />
        <BurgerConstructor ingredients={ingredients} />
      </main>
    </div>
  );
};

export default App;
