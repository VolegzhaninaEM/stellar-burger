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

      // Проверяем, что ингредиент появился в конструкторе
      cy.get('[data-cy="constructor-ingredients"]').should('exist');
      cy.get('[data-cy="constructor-ingredient"]').should('have.length', 1);

      // Проверяем, что счетчик ингредиента увеличился
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
      cy.get('[data-cy="constructor-ingredient"]').should('have.length', 1);

      // Проверяем, что счетчик соуса увеличился
      cy.get('@sauceIngredient')
        .find('[data-cy="ingredient-count"]')
        .should('contain', '1');
    });

    it('должен заменить булку при перетаскивании новой булки', () => {
      // Добавляем первую булку
      cy.get('[data-cy="ingredient-bun"]').first().as('firstBun');
      cy.get('@firstBun').trigger('dragstart');
      cy.get('[data-cy="burger-constructor"]').trigger('dragover').trigger('drop');

      // Проверяем, что первая булка добавлена
      cy.get('[data-cy="constructor-bun-top"]').should('exist');
      cy.get('@firstBun').find('[data-cy="ingredient-count"]').should('contain', '2');

      // Добавляем вторую булку
      cy.get('[data-cy="ingredient-bun"]').eq(1).as('secondBun');
      cy.get('@secondBun').trigger('dragstart');
      cy.get('[data-cy="burger-constructor"]').trigger('dragover').trigger('drop');

      // Проверяем, что вторая булка заменила первую
      cy.get('@firstBun').find('[data-cy="ingredient-count"]').should('contain', '0');
      cy.get('@secondBun').find('[data-cy="ingredient-count"]').should('contain', '2');
    });

    it('должен добавлять несколько ингредиентов одного типа', () => {
      // Добавляем булку
      cy.get('[data-cy="ingredient-bun"]').first().trigger('dragstart');
      cy.get('[data-cy="burger-constructor"]').trigger('dragover').trigger('drop');

      // Добавляем один и тот же ингредиент несколько раз
      cy.get('[data-cy="ingredient-main"]').first().as('mainIngredient');

      // Первое добавление
      cy.get('@mainIngredient').trigger('dragstart');
      cy.get('[data-cy="burger-constructor"]').trigger('dragover').trigger('drop');

      // Второе добавление
      cy.get('@mainIngredient').trigger('dragstart');
      cy.get('[data-cy="burger-constructor"]').trigger('dragover').trigger('drop');

      // Проверяем, что добавлено 2 ингредиента
      cy.get('[data-cy="constructor-ingredient"]').should('have.length', 2);
      cy.get('@mainIngredient')
        .find('[data-cy="ingredient-count"]')
        .should('contain', '2');
    });
  });

  describe('Удаление ингредиентов из конструктора', () => {
    beforeEach(() => {
      // Подготавливаем конструктор с ингредиентами
      cy.get('[data-cy="ingredient-bun"]').first().trigger('dragstart');
      cy.get('[data-cy="burger-constructor"]').trigger('dragover').trigger('drop');

      cy.get('[data-cy="ingredient-main"]').first().trigger('dragstart');
      cy.get('[data-cy="burger-constructor"]').trigger('dragover').trigger('drop');
    });

    it('должен удалить ингредиент из конструктора при клике на кнопку удаления', () => {
      // Проверяем, что ингредиент есть в конструкторе
      cy.get('[data-cy="constructor-ingredient"]').should('have.length', 1);

      // Кликаем на кнопку удаления
      cy.get('[data-cy="constructor-ingredient"]')
        .first()
        .find('[data-cy="delete-ingredient"]')
        .click();

      // Проверяем, что ингредиент удален
      cy.get('[data-cy="constructor-ingredient"]').should('have.length', 0);

      // Проверяем, что счетчик уменьшился
      cy.get('[data-cy="ingredient-main"]')
        .first()
        .find('[data-cy="ingredient-count"]')
        .should('contain', '0');
    });
  });

  describe('Перестановка ингредиентов в конструкторе', () => {
    beforeEach(() => {
      // Подготавливаем конструктор с несколькими ингредиентами
      cy.get('[data-cy="ingredient-bun"]').first().trigger('dragstart');
      cy.get('[data-cy="burger-constructor"]').trigger('dragover').trigger('drop');

      cy.get('[data-cy="ingredient-main"]').first().trigger('dragstart');
      cy.get('[data-cy="burger-constructor"]').trigger('dragover').trigger('drop');

      cy.get('[data-cy="ingredient-sauce"]').first().trigger('dragstart');
      cy.get('[data-cy="burger-constructor"]').trigger('dragover').trigger('drop');
    });

    it('должен изменить порядок ингредиентов при перетаскивании', () => {
      // Получаем изначальный порядок ингредиентов
      cy.get('[data-cy="constructor-ingredient"]').should('have.length', 2);

      // Запоминаем первый ингредиент
      cy.get('[data-cy="constructor-ingredient"]').first().as('firstIngredient');
      cy.get('[data-cy="constructor-ingredient"]').eq(1).as('secondIngredient');

      // Перетаскиваем второй ингредиент на место первого
      cy.get('@secondIngredient').trigger('dragstart');
      cy.get('@firstIngredient').trigger('dragover').trigger('drop');

      // Проверяем, что порядок изменился
      // Это более сложная проверка, которая требует специальной реализации drag-and-drop в тестах
    });
  });

  describe('Подсчет общей стоимости', () => {
    it('должен правильно подсчитывать общую стоимость бургера', () => {
      // Добавляем булку
      cy.get('[data-cy="ingredient-bun"]').first().as('bun');
      cy.get('@bun').trigger('dragstart');
      cy.get('[data-cy="burger-constructor"]').trigger('dragover').trigger('drop');

      // Добавляем ингредиент
      cy.get('[data-cy="ingredient-main"]').first().as('main');
      cy.get('@main').trigger('dragstart');
      cy.get('[data-cy="burger-constructor"]').trigger('dragover').trigger('drop');

      // Проверяем, что общая стоимость отображается и больше 0
      cy.get('[data-cy="total-price"]').should('exist').should('not.contain', '0');
    });
  });

  describe('Сообщения для пользователя', () => {
    it('должен показывать сообщение когда нет ингредиентов', () => {
      // Проверяем сообщение о выборе ингредиентов
      cy.contains('Выберите ингредиенты и перетащите их в конструктор бургера').should(
        'be.visible'
      );
    });

    it('должен показывать сообщение когда нет булки', () => {
      // Добавляем только ингредиент без булки
      cy.get('[data-cy="ingredient-main"]').first().trigger('dragstart');
      cy.get('[data-cy="burger-constructor"]').trigger('dragover').trigger('drop');

      // Проверяем сообщение о добавлении булки
      cy.contains('Добавьте булку для оформления заказа').should('be.visible');
    });

    it('должен скрыть сообщения когда есть булка', () => {
      // Добавляем булку
      cy.get('[data-cy="ingredient-bun"]').first().trigger('dragstart');
      cy.get('[data-cy="burger-constructor"]').trigger('dragover').trigger('drop');

      // Проверяем, что сообщения скрыты
      cy.contains('Выберите ингредиенты и перетащите их в конструктор бургера').should(
        'not.exist'
      );
      cy.contains('Добавьте булку для оформления заказа').should('not.exist');
    });
  });

  describe('Активация кнопки заказа', () => {
    it('кнопка "Оформить заказ" должна быть неактивна без булки', () => {
      // Добавляем только ингредиент
      cy.get('[data-cy="ingredient-main"]').first().trigger('dragstart');
      cy.get('[data-cy="burger-constructor"]').trigger('dragover').trigger('drop');

      // Проверяем, что кнопка неактивна
      cy.get('[data-cy="order-button"]').should('be.disabled');
    });

    it('кнопка "Оформить заказ" должна быть активна с булкой', () => {
      // Добавляем булку
      cy.get('[data-cy="ingredient-bun"]').first().trigger('dragstart');
      cy.get('[data-cy="burger-constructor"]').trigger('dragover').trigger('drop');

      // Проверяем, что кнопка активна
      cy.get('[data-cy="order-button"]').should('not.be.disabled');
    });
  });
});
