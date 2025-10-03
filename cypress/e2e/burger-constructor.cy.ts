/// <reference types="cypress" />

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
      cy.get('[data-cy="burger-constructor"]').should('exist');
      cy.get('[data-cy="constructor-bun-top"]').should('not.exist');
      cy.get('[data-cy="constructor-bun-bottom"]').should('not.exist');

      // Находим первую булку в списке ингредиентов
      cy.get('[data-cy="ingredient-bun"]').first().as('bunIngredient');

      // Перетаскиваем булку в конструктор
      cy.get('@bunIngredient').trigger('dragstart');
      cy.get('[data-cy="burger-constructor"]').trigger('dragover').trigger('drop');

      // Проверяем, что булка появилась в конструкторе
      cy.get('[data-cy="constructor-bun-top"]').should('exist');
      cy.get('[data-cy="constructor-bun-bottom"]').should('exist');
    });

    it('должен перетащить основной ингредиент в конструктор', () => {
      // Сначала добавляем булку
      cy.get('[data-cy="ingredient-bun"]').first().trigger('dragstart');
      cy.get('[data-cy="burger-constructor"]').trigger('dragover').trigger('drop');

      // Находим первую начинку
      cy.get('[data-cy="ingredient-main"]').first().as('mainIngredient');

      // Перетаскиваем начинку в конструктор
      cy.get('@mainIngredient').trigger('dragstart');
      cy.get('[data-cy="burger-constructor"]').trigger('dragover').trigger('drop');

      // Проверяем, что начинка появилась в конструкторе
      cy.get('[data-cy="constructor-ingredients"]')
        .children()
        .should('have.length.at.least', 1);
    });

    it('должен перетащить соус в конструктор', () => {
      // Сначала добавляем булку
      cy.get('[data-cy="ingredient-bun"]').first().trigger('dragstart');
      cy.get('[data-cy="burger-constructor"]').trigger('dragover').trigger('drop');

      // Находим первый соус
      cy.get('[data-cy="ingredient-sauce"]').first().as('sauceIngredient');

      // Перетаскиваем соус в конструктор
      cy.get('@sauceIngredient').trigger('dragstart');
      cy.get('[data-cy="burger-constructor"]').trigger('dragover').trigger('drop');

      // Проверяем, что соус появился в конструкторе
      cy.get('[data-cy="constructor-ingredients"]')
        .children()
        .should('have.length.at.least', 1);
    });
  });

  describe('Закрытие модальных окон', () => {
    it('должен закрывать модальное окно ингредиента при клике на кнопку закрытия', () => {
      // Кликаем на ингредиент, чтобы открыть модальное окно
      cy.get('[data-testid="ingredient-item"]').first().click();

      // Проверяем, что модальное окно открылось
      cy.get('[data-cy="modal"]').should('be.visible');
      cy.get('[data-cy="ingredient-details"]').should('be.visible');

      // Кликаем на кнопку закрытия
      cy.get('[data-cy="modal-close-button"]').click();

      // Проверяем, что модальное окно закрылось
      cy.get('[data-cy="modal"]').should('not.exist');
    });

    it('должен закрывать модальное окно заказа при клике на кнопку закрытия', () => {
      // Добавляем булку в конструктор
      cy.get('[data-cy="ingredient-bun"]').first().trigger('dragstart');
      cy.get('[data-cy="burger-constructor"]').trigger('dragover').trigger('drop');

      // Кликаем на кнопку оформления заказа
      cy.get('[data-cy="order-button"]').click();

      // Проверяем, что происходит редирект на логин (для неавторизованных)
      cy.url().should('include', '/login');
    });

    it('должен закрывать модальное окно при клике на оверлей', () => {
      // Кликаем на ингредиент, чтобы открыть модальное окно
      cy.get('[data-testid="ingredient-item"]').first().click();

      // Проверяем, что модальное окно открылось
      cy.get('[data-cy="modal"]').should('be.visible');

      // Кликаем на оверлей
      cy.get('[data-cy="modal-overlay"]').click({ force: true });

      // Проверяем, что модальное окно закрылось
      cy.get('[data-cy="modal"]').should('not.exist');
    });

    it('должен закрывать модальное окно при нажатии клавиши Escape', () => {
      // Кликаем на ингредиент, чтобы открыть модальное окно
      cy.get('[data-testid="ingredient-item"]').first().click();

      // Проверяем, что модальное окно открылось
      cy.get('[data-cy="modal"]').should('be.visible');

      // Нажимаем клавишу Escape
      cy.get('body').type('{esc}');

      // Проверяем, что модальное окно закрылось
      cy.get('[data-cy="modal"]').should('not.exist');
    });
  });

  describe('Открытие модальных окон', () => {
    it('должен открывать модальное окно с описанием ингредиента при клике', () => {
      // Кликаем на первый ингредиент
      cy.get('[data-testid="ingredient-item"]').first().click();

      // Проверяем, что модальное окно открылось
      cy.get('[data-cy="modal"]').should('be.visible');
      cy.get('[data-cy="ingredient-details"]').should('be.visible');
      cy.get('[data-cy="ingredient-details-title"]').should(
        'contain',
        'Детали ингредиента'
      );
    });

    it('должен отображать корректные данные ингредиента в модальном окне', () => {
      // Кликаем на первый ингредиент
      cy.get('[data-testid="ingredient-item"]').first().click();

      // Проверяем содержимое модального окна
      cy.get('[data-cy="ingredient-details-name"]')
        .should('be.visible')
        .and('not.be.empty');
      cy.get('[data-cy="ingredient-details-image"]')
        .should('be.visible')
        .and('have.attr', 'src')
        .and('not.be.empty');

      // Проверяем пищевую ценность
      cy.get('[data-cy="ingredient-details-nutrition"]').should('be.visible');
      cy.get('[data-cy="nutrition-calories"]')
        .should('be.visible')
        .and('contain', 'Калории');
      cy.get('[data-cy="nutrition-proteins"]')
        .should('be.visible')
        .and('contain', 'Белки');
      cy.get('[data-cy="nutrition-fats"]').should('be.visible').and('contain', 'Жиры');
      cy.get('[data-cy="nutrition-carbohydrates"]')
        .should('be.visible')
        .and('contain', 'Углеводы');
    });
  });

  describe('Оформление заказа', () => {
    it('должен создавать заказ при клике на кнопку "Оформить заказ"', () => {
      // Добавляем булку в конструктор
      cy.get('[data-cy="ingredient-bun"]').first().trigger('dragstart');
      cy.get('[data-cy="burger-constructor"]').trigger('dragover').trigger('drop');

      // Добавляем основной ингредиент
      cy.get('[data-cy="ingredient-main"]').first().trigger('dragstart');
      cy.get('[data-cy="burger-constructor"]').trigger('dragover').trigger('drop');

      // Проверяем, что кнопка активна
      cy.get('[data-cy="order-button"]').should('not.be.disabled');

      // Кликаем на кнопку оформления заказа
      cy.get('[data-cy="order-button"]').click();

      // Проверяем редирект на логин (для неавторизованного пользователя)
      cy.url().should('include', '/login');
    });
  });
});
