import { memo, useCallback, useEffect, useState } from 'react';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-contructor/burger-constructor';
import BurgerIngredients from '@components/burger-ingredients/burger-ingredients.tsx';
import IngredientDetails from '@components/ingredient-details/ingredient-details.tsx';
import { Modal } from '@components/modal/modal.tsx';
import OrderDetails from '@components/order-details/order-details.tsx';
import { apiConfig } from '@utils/constants.ts';

import type { TIngredient, TIngredientsResponse } from '@utils/types.ts';
import type { JSX } from 'react';

import styles from './app.module.css';

export const App = (): JSX.Element => {
  const [ingredients, setIngredients] = useState<TIngredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [item, setItem] = useState<TIngredient | null>(null);

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
        .finally(() => setLoading(false))
        .catch((err) => {
          console.log(err);
        });
    }

    getData();
  }, []);

  const handleIngredientClick = useCallback(
    (ingridientItem: TIngredient) => {
      setItem(ingridientItem);
      setOpenModal(!openModal);
    },
    [openModal]
  );

  const handleOrderButtonClick = useCallback(() => {
    setItem(null);
    setOpenModal(!openModal);
  }, [openModal]);

  const closeModal = useCallback(() => {
    setOpenModal(!openModal);
  }, [openModal]);

  return (
    <>
      {loading ? (
        <p>Загрузка…</p>
      ) : (
        <div className={styles.app} id="app">
          <AppHeader />
          <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
            Соберите бургер
          </h1>
          <main className={`${styles.main} pl-5 pr-5`}>
            <BurgerIngredients
              ingredients={ingredients}
              handleIngredientClick={handleIngredientClick}
              extendedClass={styles.scroll}
            />
            <BurgerConstructor
              ingredients={ingredients}
              handleOrderButtonClick={handleOrderButtonClick}
              extendedClass={styles.scroll}
            />
          </main>
          {openModal && (
            <Modal onClose={closeModal}>
              {item ? <IngredientDetails card={item} /> : <OrderDetails />}
            </Modal>
          )}
        </div>
      )}
    </>
  );
};

export default memo(App);
