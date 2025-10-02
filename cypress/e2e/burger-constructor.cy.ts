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

      // Проверяем, что счетчик булки увеличился до 2 (верх + низ)
      cy.get('@bunIngredient')
        .find('[data-cy="ingredient-count"]')
        .should('contain', '2');
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

      // Проверяем, что счетчик начинки увеличился
      cy.get('@mainIngredient')
        .find('[data-cy="ingredient-count"]')
        .should('contain', '1');
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

      // Проверяем, что счетчик соуса увеличился
      cy.get('@sauceIngredient')
        .find('[data-cy="ingredient-count"]')
        .should('contain', '1');
    });
  });

  describe('Закрытие модальных окон', () => {
    it('должен закрывать модальное окно ингредиента при клике на кнопку закрытия', () => {
      // Кликаем на ингредиент, чтобы открыть модальное окно
      cy.get('[data-cy="ingredient-item"]').first().click();

      // Проверяем, что модальное окно открылось
      cy.get('[data-cy="modal"]').should('be.visible');
      cy.get('[data-cy="ingredient-details"]').should('be.visible');

      // Кликаем на кнопку закрытия
      cy.get('[data-cy="modal-close-button"]').click();

      // Проверяем, что модальное окно закрылось
      cy.get('[data-cy="modal"]').should('not.exist');
    });

    it('должен закрывать модальное окно заказа при клике на кнопку закрытия', () => {
      // Мокируем токен для авторизованного пользователя
      cy.window().then((window) => {
        window.localStorage.setItem('accessToken', 'mock-access-token');
        window.localStorage.setItem('refreshToken', 'mock-refresh-token');
      });

      // Добавляем булку в конструктор
      cy.get('[data-cy="ingredient-bun"]').first().trigger('dragstart');
      cy.get('[data-cy="burger-constructor"]').trigger('dragover').trigger('drop');

      // Добавляем начинку в конструктор
      cy.get('[data-cy="ingredient-main"]').first().trigger('dragstart');
      cy.get('[data-cy="burger-constructor"]').trigger('dragover').trigger('drop');

      // Кликаем на кнопку "Оформить заказ"
      cy.get('[data-cy="order-button"]').click();

      // Ждём создания заказа
      cy.wait('@createOrder');

      // Проверяем, что модальное окно заказа открылось
      cy.get('[data-cy="modal"]').should('be.visible');
      cy.get('[data-cy="order-details"]').should('be.visible');

      // Кликаем на кнопку закрытия
      cy.get('[data-cy="modal-close-button"]').click();

      // Проверяем, что модальное окно закрылось
      cy.get('[data-cy="modal"]').should('not.exist');
    });

    it('должен закрывать модальное окно при клике на оверлей', () => {
      // Кликаем на ингредиент, чтобы открыть модальное окно
      cy.get('[data-cy="ingredient-item"]').first().click();

      // Проверяем, что модальное окно открылось
      cy.get('[data-cy="modal"]').should('be.visible');

      // Кликаем на оверлей (фон модального окна)
      cy.get('[data-cy="modal-overlay"]').click({ force: true });

      // Проверяем, что модальное окно закрылось
      cy.get('[data-cy="modal"]').should('not.exist');
    });

    it('должен закрывать модальное окно при нажатии клавиши Escape', () => {
      // Кликаем на ингредиент, чтобы открыть модальное окно
      cy.get('[data-cy="ingredient-item"]').first().click();

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
      cy.get('[data-cy="ingredient-item"]').first().click();

      // Проверяем, что модальное окно открылось
      cy.get('[data-cy="modal"]').should('be.visible');
      cy.get('[data-cy="ingredient-details"]').should('be.visible');

      // Проверяем, что URL изменился
      cy.url().should('include', '/ingredients/');
    });

    it('должен отображать корректные данные ингредиента в модальном окне', () => {
      // Получаем данные первого ингредиента
      cy.get('[data-cy="ingredient-item"]').first().as('firstIngredient');

      // Запоминаем название ингредиента
      cy.get('@firstIngredient')
        .find('[data-cy="ingredient-name"]')
        .invoke('text')
        .as('ingredientName');

      // Кликаем на ингредиент
      cy.get('@firstIngredient').click();

      // Проверяем, что в модальном окне отображается то же название
      cy.get('@ingredientName').then((name) => {
        cy.get('[data-cy="ingredient-details-name"]').should('contain', name);
      });

      // Проверяем наличие изображения ингредиента
      cy.get('[data-cy="ingredient-details-image"]').should('be.visible');

      // Проверяем наличие пищевой ценности
      cy.get('[data-cy="ingredient-details-calories"]').should('be.visible');
      cy.get('[data-cy="ingredient-details-proteins"]').should('be.visible');
      cy.get('[data-cy="ingredient-details-fat"]').should('be.visible');
      cy.get('[data-cy="ingredient-details-carbohydrates"]').should('be.visible');
    });
  });

  describe('Оформление заказа', () => {
    it('должен создавать заказ при клике на кнопку "Оформить заказ"', () => {
      // Мокируем токен для авторизованного пользователя
      cy.window().then((window) => {
        window.localStorage.setItem('accessToken', 'mock-access-token');
        window.localStorage.setItem('refreshToken', 'mock-refresh-token');
      });

      // Добавляем булку в конструктор
      cy.get('[data-cy="ingredient-bun"]').first().trigger('dragstart');
      cy.get('[data-cy="burger-constructor"]').trigger('dragover').trigger('drop');

      // Добавляем начинку в конструктор
      cy.get('[data-cy="ingredient-main"]').first().trigger('dragstart');
      cy.get('[data-cy="burger-constructor"]').trigger('dragover').trigger('drop');

      // Кликаем на кнопку "Оформить заказ"
      cy.get('[data-cy="order-button"]').click();

      // Ждём создания заказа
      cy.wait('@createOrder');

      // Проверяем, что модальное окно с данными заказа открылось
      cy.get('[data-cy="modal"]').should('be.visible');
      cy.get('[data-cy="order-details"]').should('be.visible');
      cy.get('[data-cy="order-number"]').should('be.visible');
    });

    it('должен перенаправлять на страницу логина если пользователь не авторизован', () => {
      // Очищаем токены
      cy.window().then((window) => {
        window.localStorage.removeItem('accessToken');
        window.localStorage.removeItem('refreshToken');
      });

      // Добавляем булку в конструктор
      cy.get('[data-cy="ingredient-bun"]').first().trigger('dragstart');
      cy.get('[data-cy="burger-constructor"]').trigger('dragover').trigger('drop');

      // Кликаем на кнопку "Оформить заказ"
      cy.get('[data-cy="order-button"]').click();

      // Проверяем, что произошло перенаправление на страницу логина
      cy.url().should('include', '/login');
    });
  });
});
