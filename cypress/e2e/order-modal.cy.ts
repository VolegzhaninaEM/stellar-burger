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
      cy.get('[data-cy="ingredient-main"]').first().trigger('dragstart');
      cy.get('[data-cy="burger-constructor"]').trigger('dragover').trigger('drop');

      // Проверяем, что кнопка неактивна
      cy.get('[data-cy="order-button"]').should('be.disabled');

      // Пытаемся кликнуть на неактивную кнопку
      cy.get('[data-cy="order-button"]').click({ force: true });

      // Модальное окно не должно открыться
      cy.get('[data-cy="modal"]').should('not.exist');
    });
  });

  describe('Отображение ошибок заказа', () => {
    it('должно показывать ошибку авторизации для неавторизованного пользователя', () => {
      // Удаляем токен авторизации
      cy.window().its('localStorage').invoke('removeItem', 'accessToken');

      // Добавляем булку
      cy.get('[data-cy="ingredient-bun"]').first().trigger('dragstart');
      cy.get('[data-cy="burger-constructor"]').trigger('dragover').trigger('drop');

      // Кликаем на кнопку заказа
      cy.get('[data-cy="order-button"]').click();

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
      cy.get('[data-cy="ingredient-bun"]').first().trigger('dragstart');
      cy.get('[data-cy="burger-constructor"]').trigger('dragover').trigger('drop');

      // Кликаем на кнопку заказа
      cy.get('[data-cy="order-button"]').click();

      // Должны быть перенаправлены на страницу логина
      cy.url().should('include', '/login');
    });

    it('должно сохранить состояние конструктора при переходе на логин', () => {
      cy.window().its('localStorage').invoke('removeItem', 'accessToken');

      // Добавляем ингредиенты
      cy.get('[data-cy="ingredient-bun"]').first().trigger('dragstart');
      cy.get('[data-cy="burger-constructor"]').trigger('dragover').trigger('drop');
      cy.get('[data-cy="ingredient-main"]').first().trigger('dragstart');
      cy.get('[data-cy="burger-constructor"]').trigger('dragover').trigger('drop');

      // Кликаем на кнопку заказа
      cy.get('[data-cy="order-button"]').click();

      // Возвращаемся на главную страницу
      cy.visit('/');
      cy.wait('@getIngredients');

      // Проверяем базовое состояние
      cy.get('[data-cy="burger-constructor"]').should('be.visible');
    });
  });
});
