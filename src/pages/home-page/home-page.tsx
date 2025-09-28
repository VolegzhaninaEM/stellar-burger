import { memo, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../services/hooks.ts';
import {
  clearIngredient,
  setIngredient,
} from '../../services/ingredientDetailsSlice.ts';
import { closeOrderModal, createOrder } from '../../services/orderSlice.ts';
import { BurgerConstructor } from '@components/burger-contructor/burger-constructor';
import BurgerIngredients from '@components/burger-ingredients/burger-ingredients.tsx';
import Modal from '@components/modal/modal.tsx';
import OrderDetails from '@components/order-details/order-details.tsx';
import { ROUTES } from '@utils/constants.ts';

import type { AppDispatch } from '@services/store.ts';
import type { TIngredient } from '@utils/types.ts';
import type { JSX } from 'react';

import styles from './home-page.module.css';

const HomePage = (): JSX.Element => {
  const dispatch: AppDispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuth = useAppSelector((s) => s.auth.accessToken);
  const orderNumber = useAppSelector((s) => s.order.number);

  const handleIngredientClick = useCallback(
    (ingredientItem: TIngredient) => {
      dispatch(setIngredient(ingredientItem));
      void navigate(`/ingredients/${ingredientItem._id}`, {
        state: { background: location },
      });
    },
    [dispatch, location]
  );
  const { buns, ingredients } = useAppSelector((s) => s.burgerConstructor);
  const handleOrderButtonClick = useCallback(() => {
    if (!isAuth) {
      void navigate(ROUTES.LOGIN, { state: { from: '/' } });
      return;
    }
    if (!buns) return;
    const ids: string[] = [
      buns._id,
      ...ingredients.map((i: TIngredient): string => i._id),
      buns._id,
    ];
    void dispatch(createOrder(ids));
  }, [dispatch, buns, ingredients]);

  const closeModal = useCallback(() => {
    dispatch(clearIngredient());
    dispatch(closeOrderModal());
  }, [dispatch]);

  return (
    <>
      <div className={styles.app} id="app">
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
              caption={isAuth ? 'Оформить заказ' : 'Войти и оформить'}
            />
          </main>
        </DndProvider>
        {orderNumber !== null && (
          <Modal onClose={closeModal}>
            <OrderDetails orderNumber={orderNumber} />
          </Modal>
        )}
      </div>
    </>
  );
};

export default memo(HomePage);
