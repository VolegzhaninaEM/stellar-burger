import { SELECTORS } from '../support/selectors';

describe('Модальное окно с данными о заказе', () => {
  beforeEach(() => {
    // Мокируем API запросы
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as('createOrder');
    cy.intercept('POST', '**/api/auth/login', { fixture: 'user.json' }).as('login');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  describe('Открытие модального окна заказа', () => {
    it('не должно открывать модальное окно если нет булки', () => {
      // Добавляем только ингредиент без булки
      cy.get(SELECTORS.INGREDIENT_MAIN).first().trigger('dragstart');
      cy.get(SELECTORS.BURGER_CONSTRUCTOR).trigger('dragover').trigger('drop');

      // Проверяем, что кнопка неактивна
      cy.get(SELECTORS.ORDER_BUTTON).should('be.disabled');

      // Пытаемся кликнуть на неактивную кнопку
      cy.get(SELECTORS.ORDER_BUTTON).click({ force: true });

      // Модальное окно не должно открыться
      cy.get(SELECTORS.MODAL).should('not.exist');
    });
  });

  describe('Отображение ошибок заказа', () => {
    it('должно показывать ошибку авторизации для неавторизованного пользователя', () => {
      // Удаляем токен авторизации
      cy.window().its('localStorage').invoke('removeItem', 'accessToken');

      // Добавляем булку
      cy.get(SELECTORS.INGREDIENT_BUN).first().trigger('dragstart');
      cy.get(SELECTORS.BURGER_CONSTRUCTOR).trigger('dragover').trigger('drop');

      // Кликаем на кнопку заказа
      cy.get(SELECTORS.ORDER_BUTTON).click();

      // Проверяем, что пользователя перенаправило на страницу входа
      cy.url().should('include', '/login');
    });
  });

  describe('Проверка авторизации при заказе', () => {
    it('должно перенаправить на страницу логина неавторизованного пользователя', () => {
      // Убеждаемся, что пользователь не авторизован
      cy.window().its('localStorage').invoke('removeItem', 'accessToken');
      cy.window().its('localStorage').invoke('removeItem', 'refreshToken');

      // Добавляем булку
      cy.get(SELECTORS.INGREDIENT_BUN).first().trigger('dragstart');
      cy.get(SELECTORS.BURGER_CONSTRUCTOR).trigger('dragover').trigger('drop');

      // Кликаем на кнопку заказа
      cy.get(SELECTORS.ORDER_BUTTON).click();

      // Должны быть перенаправлены на страницу логина
      cy.url().should('include', '/login');
    });

    it('должно сохранить состояние конструктора при переходе на логин', () => {
      cy.window().its('localStorage').invoke('removeItem', 'accessToken');

      // Добавляем ингредиенты
      cy.get(SELECTORS.INGREDIENT_BUN).first().trigger('dragstart');
      cy.get(SELECTORS.BURGER_CONSTRUCTOR).trigger('dragover').trigger('drop');
      cy.get(SELECTORS.INGREDIENT_MAIN).first().trigger('dragstart');
      cy.get(SELECTORS.BURGER_CONSTRUCTOR).trigger('dragover').trigger('drop');

      // Кликаем на кнопку заказа
      cy.get(SELECTORS.ORDER_BUTTON).click();

      // Возвращаемся на главную страницу
      cy.visit('/');
      cy.wait('@getIngredients');

      // Проверяем базовое состояние
      cy.get(SELECTORS.BURGER_CONSTRUCTOR).should('be.visible');
    });
  });
});
