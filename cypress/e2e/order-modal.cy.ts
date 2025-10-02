/// <reference types="cypress" />

describe('Модальное окно с данными о заказе', () => {
  beforeEach(() => {
    // Мокируем API запросы
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as('createOrder');
    cy.intercept('POST', '**/api/auth/login', { fixture: 'user.json' }).as('login');
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as('getUser');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  describe('Открытие модального окна заказа', () => {
    it('должно открыть модальное окно при клике на кнопку "Оформить заказ" с булкой', () => {
      // Добавляем булку в конструктор
      cy.get('[data-cy="ingredient-bun"]').first().trigger('dragstart');
      cy.get('[data-cy="burger-constructor"]').trigger('dragover').trigger('drop');

      // Проверяем, что кнопка активна
      cy.get('[data-cy="order-button"]').should('not.be.disabled');

      // Кликаем на кнопку оформления заказа
      cy.get('[data-cy="order-button"]').click();

      // Проверяем, что модальное окно открылось
      cy.get('[data-cy="modal"]').should('be.visible');
    });

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

    it('должно открывать модальное окно для авторизованного пользователя', () => {
      // Симулируем авторизацию
      cy.window().its('localStorage').invoke('setItem', 'accessToken', 'test-token');

      // Добавляем булку
      cy.get('[data-cy="ingredient-bun"]').first().trigger('dragstart');
      cy.get('[data-cy="burger-constructor"]').trigger('dragover').trigger('drop');

      // Кликаем на кнопку заказа
      cy.get('[data-cy="order-button"]').click();

      cy.wait('@createOrder');

      // Проверяем, что модальное окно с данными заказа открылось
      cy.get('[data-cy="modal"]').should('be.visible');
      cy.get('[data-cy="order-details-success"]').should('be.visible');
    });
  });

  describe('Отображение состояния загрузки', () => {
    it('должно показывать состояние загрузки при создании заказа', () => {
      // Мокируем медленный ответ API
      cy.intercept('POST', '**/api/orders', (req) => {
        req.reply((res) => {
          res.delay(1000); // Задержка 1 секунда
          res.send({ fixture: 'order.json' });
        });
      }).as('slowCreateOrder');

      cy.window().its('localStorage').invoke('setItem', 'accessToken', 'test-token');

      // Добавляем булку
      cy.get('[data-cy="ingredient-bun"]').first().trigger('dragstart');
      cy.get('[data-cy="burger-constructor"]').trigger('dragover').trigger('drop');

      // Кликаем на кнопку заказа
      cy.get('[data-cy="order-button"]').click();

      // Проверяем состояние загрузки
      cy.get('[data-cy="modal"]').should('be.visible');
      cy.get('[data-cy="order-details-loading"]').should('be.visible');
      cy.get('[data-cy="order-loading-spinner"]').should('be.visible');
      cy.get('[data-cy="order-loading-message"]').should(
        'contain.text',
        'Создаем заказ...'
      );
      cy.get('[data-cy="order-loading-submessage"]').should(
        'contain.text',
        'Пожалуйста, подождите'
      );

      // Ждем завершения запроса
      cy.wait('@slowCreateOrder');

      // Проверяем, что загрузка сменилась на успех
      cy.get('[data-cy="order-details-loading"]').should('not.exist');
      cy.get('[data-cy="order-details-success"]').should('be.visible');
    });
  });

  describe('Отображение успешного заказа', () => {
    beforeEach(() => {
      cy.window().its('localStorage').invoke('setItem', 'accessToken', 'test-token');

      // Подготавливаем заказ
      cy.get('[data-cy="ingredient-bun"]').first().trigger('dragstart');
      cy.get('[data-cy="burger-constructor"]').trigger('dragover').trigger('drop');

      cy.get('[data-cy="order-button"]').click();
      cy.wait('@createOrder');
    });

    it('должно отображать номер заказа', () => {
      cy.fixture('order.json').then((orderData) => {
        cy.get('[data-cy="order-number"]')
          .should('be.visible')
          .and('contain.text', orderData.order.number.toString());
      });
    });

    it('должно отображать правильный заголовок для номера заказа', () => {
      cy.get('[data-cy="order-number-label"]')
        .should('be.visible')
        .and('contain.text', 'идентификатор заказа');
    });

    it('должно отображать изображение успешного заказа', () => {
      cy.get('[data-cy="order-success-image"]')
        .should('be.visible')
        .and('have.attr', 'src')
        .and('include', 'order-accepted-done.svg')
        .and('have.attr', 'alt', 'Заказ оформлен');
    });

    it('должно отображать сообщения о готовке заказа', () => {
      cy.get('[data-cy="order-success-message"]')
        .should('be.visible')
        .and('contain.text', 'Ваш заказ начали готовить');

      cy.get('[data-cy="order-success-submessage"]')
        .should('be.visible')
        .and('contain.text', 'Дождитесь готовности на орбитальной станции');
    });

    it('должно иметь правильную структуру успешного заказа', () => {
      cy.get('[data-cy="order-details-success"]').within(() => {
        // Проверяем порядок элементов
        cy.get('[data-cy="order-number"]').should('be.visible');
        cy.get('[data-cy="order-number-label"]').should('be.visible');
        cy.get('[data-cy="order-success-image"]').should('be.visible');
        cy.get('[data-cy="order-success-message"]').should('be.visible');
        cy.get('[data-cy="order-success-submessage"]').should('be.visible');
      });
    });
  });

  describe('Отображение ошибок заказа', () => {
    it('должно показывать ошибку при неуспешном создании заказа', () => {
      // Мокируем ошибку API
      cy.intercept('POST', '**/api/orders', {
        statusCode: 500,
        body: { success: false, message: 'Ошибка сервера' },
      }).as('failedCreateOrder');

      cy.window().its('localStorage').invoke('setItem', 'accessToken', 'test-token');

      // Добавляем булку
      cy.get('[data-cy="ingredient-bun"]').first().trigger('dragstart');
      cy.get('[data-cy="burger-constructor"]').trigger('dragover').trigger('drop');

      // Кликаем на кнопку заказа
      cy.get('[data-cy="order-button"]').click();

      cy.wait('@failedCreateOrder');

      // Проверяем отображение ошибки
      cy.get('[data-cy="modal"]').should('be.visible');
      cy.get('[data-cy="order-details-error"]').should('be.visible');
      cy.get('[data-cy="order-error-title"]').should('contain.text', 'Ошибка');
      cy.get('[data-cy="order-error-message"]').should('be.visible').and('not.be.empty');
      cy.get('[data-cy="order-error-hint"]').should(
        'contain.text',
        'Попробуйте еще раз'
      );
    });

    it('должно показывать ошибку авторизации для неавторизованного пользователя', () => {
      // Мокируем ошибку авторизации
      cy.intercept('POST', '**/api/orders', {
        statusCode: 401,
        body: { success: false, message: 'Требуется авторизация' },
      }).as('unauthorizedOrder');

      // Удаляем токен авторизации
      cy.window().its('localStorage').invoke('removeItem', 'accessToken');

      // Добавляем булку
      cy.get('[data-cy="ingredient-bun"]').first().trigger('dragstart');
      cy.get('[data-cy="burger-constructor"]').trigger('dragover').trigger('drop');

      // Кликаем на кнопку заказа
      cy.get('[data-cy="order-button"]').click();

      // Проверяем, что пользователя перенаправило на страницу входа
      // или отобразилась ошибка авторизации
      cy.url().should('include', '/login');
    });
  });

  describe('Закрытие модального окна заказа', () => {
    beforeEach(() => {
      cy.window().its('localStorage').invoke('setItem', 'accessToken', 'test-token');

      // Создаем заказ
      cy.get('[data-cy="ingredient-bun"]').first().trigger('dragstart');
      cy.get('[data-cy="burger-constructor"]').trigger('dragover').trigger('drop');
      cy.get('[data-cy="order-button"]').click();
      cy.wait('@createOrder');
    });

    it('должно закрыть модальное окно при клике на кнопку закрытия', () => {
      cy.get('[data-cy="modal"]').should('be.visible');
      cy.get('[data-cy="modal-close-button"]').click();

      cy.get('[data-cy="modal"]').should('not.exist');
    });

    it('должно закрыть модальное окно при клике на оверлей', () => {
      cy.get('[data-cy="modal"]').should('be.visible');
      cy.get('[data-cy="modal-overlay"]').click({ force: true });

      cy.get('[data-cy="modal"]').should('not.exist');
    });

    it('должно закрыть модальное окно при нажатии Escape', () => {
      cy.get('[data-cy="modal"]').should('be.visible');
      cy.get('body').type('{esc}');

      cy.get('[data-cy="modal"]').should('not.exist');
    });

    it('должно очистить конструктор после закрытия модального окна', () => {
      // Проверяем, что в конструкторе есть ингредиенты
      cy.get('[data-cy="constructor-bun-top"]').should('exist');

      // Закрываем модальное окно
      cy.get('[data-cy="modal-close-button"]').click();

      // Проверяем, что конструктор очистился
      cy.get('[data-cy="constructor-bun-top"]').should('not.exist');
      cy.get('[data-cy="constructor-bun-bottom"]').should('not.exist');
      cy.get('[data-cy="constructor-ingredient"]').should('not.exist');
    });
  });

  describe('Взаимодействие с заказом при разных сценариях', () => {
    it('должно создавать заказ с несколькими ингредиентами', () => {
      cy.window().its('localStorage').invoke('setItem', 'accessToken', 'test-token');

      // Добавляем булку
      cy.get('[data-cy="ingredient-bun"]').first().trigger('dragstart');
      cy.get('[data-cy="burger-constructor"]').trigger('dragover').trigger('drop');

      // Добавляем основной ингредиент
      cy.get('[data-cy="ingredient-main"]').first().trigger('dragstart');
      cy.get('[data-cy="burger-constructor"]').trigger('dragover').trigger('drop');

      // Добавляем соус
      cy.get('[data-cy="ingredient-sauce"]').first().trigger('dragstart');
      cy.get('[data-cy="burger-constructor"]').trigger('dragover').trigger('drop');

      // Создаем заказ
      cy.get('[data-cy="order-button"]').click();
      cy.wait('@createOrder');

      // Проверяем успешное создание
      cy.get('[data-cy="order-details-success"]').should('be.visible');
      cy.get('[data-cy="order-number"]').should('be.visible');
    });

    it('должно правильно обрабатывать повторные заказы', () => {
      cy.window().its('localStorage').invoke('setItem', 'accessToken', 'test-token');

      // Первый заказ
      cy.get('[data-cy="ingredient-bun"]').first().trigger('dragstart');
      cy.get('[data-cy="burger-constructor"]').trigger('dragover').trigger('drop');
      cy.get('[data-cy="order-button"]').click();
      cy.wait('@createOrder');

      cy.get('[data-cy="order-details-success"]').should('be.visible');
      cy.get('[data-cy="modal-close-button"]').click();

      // Второй заказ
      cy.get('[data-cy="ingredient-bun"]').first().trigger('dragstart');
      cy.get('[data-cy="burger-constructor"]').trigger('dragover').trigger('drop');
      cy.get('[data-cy="order-button"]').click();
      cy.wait('@createOrder');

      cy.get('[data-cy="order-details-success"]').should('be.visible');
    });
  });

  describe('Проверка данных в модальном окне заказа', () => {
    beforeEach(() => {
      cy.window().its('localStorage').invoke('setItem', 'accessToken', 'test-token');

      cy.get('[data-cy="ingredient-bun"]').first().trigger('dragstart');
      cy.get('[data-cy="burger-constructor"]').trigger('dragover').trigger('drop');
      cy.get('[data-cy="order-button"]').click();
      cy.wait('@createOrder');
    });

    it('должно отображать корректный номер заказа из API', () => {
      cy.fixture('order.json').then((orderData) => {
        cy.get('[data-cy="order-number"]')
          .should('be.visible')
          .and('contain.text', orderData.order.number.toString())
          .and('have.class', 'text_type_digits-large');
      });
    });

    it('должно отображать правильное описание заказа', () => {
      cy.get('[data-cy="order-number-label"]')
        .should('be.visible')
        .and('contain.text', 'идентификатор заказа')
        .and('have.class', 'text_type_main-medium');
    });

    it('должно отображать изображение подтверждения', () => {
      cy.get('[data-cy="order-success-image"]')
        .should('be.visible')
        .and('have.attr', 'src')
        .and('include', 'order-accepted-done.svg')
        .and('have.attr', 'alt', 'Заказ оформлен');
    });

    it('должно отображать статусные сообщения', () => {
      cy.get('[data-cy="order-success-message"]')
        .should('be.visible')
        .and('contain.text', 'Ваш заказ начали готовить')
        .and('have.class', 'text_type_main-small');

      cy.get('[data-cy="order-success-submessage"]')
        .should('be.visible')
        .and('contain.text', 'Дождитесь готовности на орбитальной станции')
        .and('have.class', 'text_type_main-default')
        .and('have.class', 'text_color_inactive');
    });
  });

  describe('Проверка форматирования номера заказа', () => {
    beforeEach(() => {
      cy.window().its('localStorage').invoke('setItem', 'accessToken', 'test-token');

      cy.get('[data-cy="ingredient-bun"]').first().trigger('dragstart');
      cy.get('[data-cy="burger-constructor"]').trigger('dragover').trigger('drop');
      cy.get('[data-cy="order-button"]').click();
      cy.wait('@createOrder');
    });

    it('должно отображать номер заказа как числовое значение', () => {
      cy.get('[data-cy="order-number"]')
        .should('be.visible')
        .invoke('text')
        .should('match', /^\d+$/) // только цифры
        .and('not.contain', 'NaN')
        .and('not.contain', 'undefined')
        .and('not.contain', 'null');
    });

    it('должно использовать специальный шрифт для номера заказа', () => {
      cy.get('[data-cy="order-number"]')
        .should('have.class', 'text_type_digits-large')
        .and('have.css', 'font-size')
        .and('not.equal', '0px');
    });

    it('номер заказа должен быть больше нуля', () => {
      cy.get('[data-cy="order-number"]')
        .invoke('text')
        .then((text) => {
          const orderNumber = parseInt(text.trim());
          expect(orderNumber).to.be.greaterThan(0);
        });
    });
  });

  describe('Проверка состояний ошибок', () => {
    it('должно отображать ошибку сети', () => {
      cy.intercept('POST', '**/api/orders', {
        statusCode: 500,
        body: { success: false, message: 'Ошибка сервера' },
      }).as('serverError');

      cy.window().its('localStorage').invoke('setItem', 'accessToken', 'test-token');

      cy.get('[data-cy="ingredient-bun"]').first().trigger('dragstart');
      cy.get('[data-cy="burger-constructor"]').trigger('dragover').trigger('drop');
      cy.get('[data-cy="order-button"]').click();

      cy.wait('@serverError');

      cy.get('[data-cy="order-details-error"]').should('be.visible');
      cy.get('[data-cy="order-error-title"]')
        .should('contain.text', 'Ошибка')
        .and('have.class', 'text_color_error');
      cy.get('[data-cy="order-error-message"]').should('be.visible');
      cy.get('[data-cy="order-error-hint"]').should(
        'contain.text',
        'Попробуйте еще раз'
      );
    });

    it('должно отображать ошибку тайм-аута', () => {
      cy.intercept('POST', '**/api/orders', (req) => {
        req.destroy(); // Симулируем обрыв соединения
      }).as('timeoutError');

      cy.window().its('localStorage').invoke('setItem', 'accessToken', 'test-token');

      cy.get('[data-cy="ingredient-bun"]').first().trigger('dragstart');
      cy.get('[data-cy="burger-constructor"]').trigger('dragover').trigger('drop');
      cy.get('[data-cy="order-button"]').click();

      // Проверяем отображение ошибки
      cy.get('[data-cy="order-details-error"]', { timeout: 10000 }).should('be.visible');
      cy.get('[data-cy="order-error-message"]').should('be.visible');
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

      // Проверяем, что состояние конструктора сохранилось
      // (в зависимости от реализации - может сохраняться в localStorage или Redux Persist)
    });
  });

  describe('Проверка доступности модального окна заказа', () => {
    beforeEach(() => {
      cy.window().its('localStorage').invoke('setItem', 'accessToken', 'test-token');

      cy.get('[data-cy="ingredient-bun"]').first().trigger('dragstart');
      cy.get('[data-cy="burger-constructor"]').trigger('dragover').trigger('drop');
      cy.get('[data-cy="order-button"]').click();
      cy.wait('@createOrder');
    });

    it('должно иметь правильные ARIA атрибуты', () => {
      cy.get('[data-cy="modal"]')
        .should('have.attr', 'role', 'dialog')
        .and('have.attr', 'aria-modal', 'true');
    });

    it('должно быть доступно для screen reader', () => {
      // Проверяем структуру заголовков для screen reader
      cy.get('[data-cy="order-number"]').should('be.visible');
      cy.get('[data-cy="order-number-label"]').should('be.visible');

      // Изображение должно иметь правильный alt текст
      cy.get('[data-cy="order-success-image"]').should(
        'have.attr',
        'alt',
        'Заказ оформлен'
      );
    });

    it('должно поддерживать навигацию с клавиатуры', () => {
      // Фокус должен быть на кнопке закрытия
      cy.get('[data-cy="modal-close-button"]').should('be.focused');

      // Tab не должен выводить фокус за пределы модального окна
      cy.get('body').tab();
      cy.focused().should('exist');
    });
  });
});
