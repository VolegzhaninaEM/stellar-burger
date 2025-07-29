import { memo, useCallback, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { useAppDispatch, useAppSelector } from '../../services/hooks.ts';
import {
  clearIngredient,
  setIngredient,
} from '../../services/ingredientDetailsSlice.ts';
import { fetchIngredients } from '../../services/ingredientsSlice.ts';
import { closeOrderModal, createOrder } from '../../services/orderSlice.ts';
import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-contructor/burger-constructor';
import BurgerIngredients from '@components/burger-ingredients/burger-ingredients.tsx';
import IngredientDetails from '@components/ingredient-details/ingredient-details.tsx';
import { Modal } from '@components/modal/modal.tsx';
import OrderDetails from '@components/order-details/order-details.tsx';

import type { AppDispatch } from '@services/store.ts';
import type { TIngredient } from '@utils/types.ts';
import type { JSX } from 'react';

import styles from './app.module.css';

export const App = (): JSX.Element => {
  const dispatch: AppDispatch = useAppDispatch();

  const loading = useAppSelector((s) => s.ingredients.status === 'loading');
  const item = useAppSelector((s) => s.ingredientDetails);
  const orderNumber = useAppSelector((s) => s.order.number);

  useEffect(() => {
    dispatch(fetchIngredients()).catch((err) => {
      console.error(err);
    });
  }, [dispatch]);

  const handleIngredientClick = useCallback(
    (ingredientItem: TIngredient) => {
      dispatch(setIngredient(ingredientItem));
    },
    [dispatch]
  );
  const { buns, ingredients } = useAppSelector((s) => s.burgerConstructor);
  const handleOrderButtonClick = useCallback(() => {
    if (!buns) return;
    const ids: string[] = [
      buns._id,
      ...ingredients.map((i: TIngredient): string => i._id),
      buns._id,
    ];
    dispatch(createOrder(ids)).unwrap().catch(console.error);
  }, [dispatch, buns, ingredients]);

  const closeModal = useCallback(() => {
    dispatch(clearIngredient());
    dispatch(closeOrderModal());
  }, [dispatch]);

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
          <DndProvider backend={HTML5Backend}>
            <main className={`${styles.main} pl-5 pr-5`}>
              <BurgerIngredients
                handleIngredientClick={handleIngredientClick}
                extendedClass={styles.scroll}
              />
              <BurgerConstructor
                handleOrderButtonClick={handleOrderButtonClick}
                extendedClass={styles.scroll}
              />
            </main>
          </DndProvider>
          {item && (
            <Modal onClose={closeModal}>
              <IngredientDetails card={item} />
            </Modal>
          )}
          {orderNumber !== null && (
            <Modal onClose={closeModal}>
              <OrderDetails />
            </Modal>
          )}
        </div>
      )}
    </>
  );
};

export default memo(App);
