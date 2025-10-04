/// <reference types="cypress" />

import { SELECTORS } from '../support/selectors';

describe('Конструктор бургера', () => {
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

  describe('Перетаскивание ингредиентов', () => {
    it('должен перетащить булку в конструктор', () => {
      // Проверяем, что конструктор изначально пуст
      cy.get(SELECTORS.BURGER_CONSTRUCTOR).should('exist');
      cy.get(SELECTORS.CONSTRUCTOR_BUN_TOP).should('not.exist');
      cy.get(SELECTORS.CONSTRUCTOR_BUN_BOTTOM).should('not.exist');

      // Находим первую булку в списке ингредиентов
      cy.get(SELECTORS.INGREDIENT_BUN).first().as('bunIngredient');

      // Перетаскиваем булку в конструктор
      cy.get('@bunIngredient').trigger('dragstart');
      cy.get(SELECTORS.BURGER_CONSTRUCTOR).trigger('dragover').trigger('drop');

      // Проверяем, что булка появилась в конструкторе
      cy.get(SELECTORS.CONSTRUCTOR_BUN_TOP).should('exist');
      cy.get(SELECTORS.CONSTRUCTOR_BUN_BOTTOM).should('exist');
    });

    it('должен перетащить основной ингредиент в конструктор', () => {
      // Сначала добавляем булку
      cy.get(SELECTORS.INGREDIENT_BUN).first().trigger('dragstart');
      cy.get(SELECTORS.BURGER_CONSTRUCTOR).trigger('dragover').trigger('drop');

      // Находим первую начинку
      cy.get(SELECTORS.INGREDIENT_MAIN).first().as('mainIngredient');

      // Перетаскиваем начинку в конструктор
      cy.get('@mainIngredient').trigger('dragstart');
      cy.get(SELECTORS.BURGER_CONSTRUCTOR).trigger('dragover').trigger('drop');

      // Проверяем, что начинка появилась в конструкторе
      cy.get(SELECTORS.CONSTRUCTOR_INGREDIENTS)
        .children()
        .should('have.length.at.least', 1);
    });

    it('должен перетащить соус в конструктор', () => {
      // Сначала добавляем булку
      cy.get(SELECTORS.INGREDIENT_BUN).first().trigger('dragstart');
      cy.get(SELECTORS.BURGER_CONSTRUCTOR).trigger('dragover').trigger('drop');

      // Находим первый соус
      cy.get(SELECTORS.INGREDIENT_SAUCE).first().as('sauceIngredient');

      // Перетаскиваем соус в конструктор
      cy.get('@sauceIngredient').trigger('dragstart');
      cy.get(SELECTORS.BURGER_CONSTRUCTOR).trigger('dragover').trigger('drop');

      // Проверяем, что соус появился в конструкторе
      cy.get(SELECTORS.CONSTRUCTOR_INGREDIENTS)
        .children()
        .should('have.length.at.least', 1);
    });
  });

  describe('Закрытие модальных окон', () => {
    it('должен закрывать модальное окно ингредиента при клике на кнопку закрытия', () => {
      // Кликаем на ингредиент, чтобы открыть модальное окно
      cy.get(SELECTORS.INGREDIENT_ITEM).first().click();

      // Проверяем, что модальное окно открылось
      cy.get(SELECTORS.MODAL).should('be.visible');
      cy.get(SELECTORS.INGREDIENT_DETAILS).should('be.visible');

      // Кликаем на кнопку закрытия
      cy.get(SELECTORS.MODAL_CLOSE_BUTTON).click();

      // Проверяем, что модальное окно закрылось
      cy.get(SELECTORS.MODAL).should('not.exist');
    });

    it('должен закрывать модальное окно заказа при клике на кнопку закрытия', () => {
      // Добавляем булку в конструктор
      cy.get(SELECTORS.INGREDIENT_BUN).first().trigger('dragstart');
      cy.get(SELECTORS.BURGER_CONSTRUCTOR).trigger('dragover').trigger('drop');

      // Кликаем на кнопку оформления заказа
      cy.get(SELECTORS.ORDER_BUTTON).click();

      // Проверяем, что происходит редирект на логин (для неавторизованных)
      cy.url().should('include', '/login');
    });

    it('должен закрывать модальное окно при клике на оверлей', () => {
      // Кликаем на ингредиент, чтобы открыть модальное окно
      cy.get(SELECTORS.INGREDIENT_ITEM).first().click();

      // Проверяем, что модальное окно открылось
      cy.get(SELECTORS.MODAL).should('be.visible');

      // Кликаем на оверлей
      cy.get(SELECTORS.MODAL_OVERLAY).click({ force: true });

      // Проверяем, что модальное окно закрылось
      cy.get(SELECTORS.MODAL).should('not.exist');
    });

    it('должен закрывать модальное окно при нажатии клавиши Escape', () => {
      // Кликаем на ингредиент, чтобы открыть модальное окно
      cy.get(SELECTORS.INGREDIENT_ITEM).first().click();

      // Проверяем, что модальное окно открылось
      cy.get(SELECTORS.MODAL).should('be.visible');

      // Нажимаем клавишу Escape
      cy.get('body').type('{esc}');

      // Проверяем, что модальное окно закрылось
      cy.get(SELECTORS.MODAL).should('not.exist');
    });
  });

  describe('Открытие модальных окон', () => {
    it('должен открывать модальное окно с описанием ингредиента при клике', () => {
      // Кликаем на первый ингредиент
      cy.get(SELECTORS.INGREDIENT_ITEM).first().click();

      // Проверяем, что модальное окно открылось
      cy.get(SELECTORS.MODAL).should('be.visible');
      cy.get(SELECTORS.INGREDIENT_DETAILS).should('be.visible');
      cy.get(SELECTORS.INGREDIENT_DETAILS_TITLE).should('contain', 'Детали ингредиента');
    });

    it('должен отображать корректные данные ингредиента в модальном окне', () => {
      // Кликаем на первый ингредиент
      cy.get(SELECTORS.INGREDIENT_ITEM).first().click();

      // Проверяем содержимое модального окна
      cy.get(SELECTORS.INGREDIENT_DETAILS_NAME).should('be.visible').and('not.be.empty');
      cy.get(SELECTORS.INGREDIENT_DETAILS_IMAGE)
        .should('be.visible')
        .and('have.attr', 'src')
        .and('not.be.empty');

      // Проверяем пищевую ценность
      cy.get(SELECTORS.INGREDIENT_DETAILS_NUTRITION).should('be.visible');
      cy.get(SELECTORS.NUTRITION_CALORIES)
        .should('be.visible')
        .and('contain', 'Калории');
      cy.get(SELECTORS.NUTRITION_PROTEINS).should('be.visible').and('contain', 'Белки');
      cy.get(SELECTORS.NUTRITION_FATS).should('be.visible').and('contain', 'Жиры');
      cy.get(SELECTORS.NUTRITION_CARBOHYDRATES)
        .should('be.visible')
        .and('contain', 'Углеводы');
    });
  });

  describe('Оформление заказа', () => {
    it('должен создавать заказ при клике на кнопку "Оформить заказ"', () => {
      // Добавляем булку в конструктор
      cy.get(SELECTORS.INGREDIENT_BUN).first().trigger('dragstart');
      cy.get(SELECTORS.BURGER_CONSTRUCTOR).trigger('dragover').trigger('drop');

      // Добавляем основной ингредиент
      cy.get(SELECTORS.INGREDIENT_MAIN).first().trigger('dragstart');
      cy.get(SELECTORS.BURGER_CONSTRUCTOR).trigger('dragover').trigger('drop');

      // Проверяем, что кнопка активна
      cy.get(SELECTORS.ORDER_BUTTON).should('not.be.disabled');

      // Кликаем на кнопку оформления заказа
      cy.get(SELECTORS.ORDER_BUTTON).click();

      // Проверяем редирект на логин (для неавторизованного пользователя)
      cy.url().should('include', '/login');
    });
  });
});
