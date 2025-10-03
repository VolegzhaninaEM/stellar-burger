describe('Модальное окно с описанием ингредиента', () => {
  beforeEach(() => {
    // Мокируем API запросы
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  describe('Открытие модального окна', () => {
    it('должно открыть модальное окно при клике на ингредиент', () => {
      // Кликаем на первый ингредиент булку
      cy.get('[data-cy="ingredient-bun"]').first().click();

      // Проверяем, что модальное окно открылось
      cy.get('[data-cy="modal"]').should('be.visible');
      cy.get('[data-cy="ingredient-details"]').should('be.visible');
      cy.get('[data-cy="ingredient-details-title"]').should(
        'contain',
        'Детали ингредиента'
      );
    });

    it('должно отображать правильную информацию об ингредиенте в модальном окне', () => {
      // Кликаем на конкретный ингредиент
      cy.get('[data-cy="ingredient-bun"]').first().click();

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

    it('должно открывать модальное окно для разных типов ингредиентов', () => {
      // Тестируем булку
      cy.get('[data-cy="ingredient-bun"]').first().click();
      cy.get('[data-cy="ingredient-details-name"]').should('be.visible');
      cy.get('[data-cy="modal-close-button"]').click();
      cy.get('[data-cy="modal"]').should('not.exist');

      // Тестируем основной ингредиент
      cy.get('[data-cy="ingredient-main"]').first().click();
      cy.get('[data-cy="ingredient-details-name"]').should('be.visible');
      cy.get('[data-cy="modal-close-button"]').click();
      cy.get('[data-cy="modal"]').should('not.exist');

      // Тестируем соус
      cy.get('[data-cy="ingredient-sauce"]').first().click();
      cy.get('[data-cy="ingredient-details-name"]').should('be.visible');
      cy.get('[data-cy="modal-close-button"]').click();
      cy.get('[data-cy="modal"]').should('not.exist');
    });

    it('должно отображать корректные значения пищевой ценности', () => {
      cy.get('[data-cy="ingredient-bun"]').first().click();

      // Проверяем, что значения пищевой ценности не пустые и являются числами
      cy.get('[data-cy="nutrition-calories"]')
        .find('p')
        .last()
        .should('not.be.empty')
        .invoke('text')
        .should('match', /^\d+$/);
      cy.get('[data-cy="nutrition-proteins"]')
        .find('p')
        .last()
        .should('not.be.empty')
        .invoke('text')
        .should('match', /^\d+$/);
      cy.get('[data-cy="nutrition-fats"]')
        .find('p')
        .last()
        .should('not.be.empty')
        .invoke('text')
        .should('match', /^\d+$/);
      cy.get('[data-cy="nutrition-carbohydrates"]')
        .find('p')
        .last()
        .should('not.be.empty')
        .invoke('text')
        .should('match', /^\d+$/);
    });
  });

  describe('Закрытие модального окна', () => {
    beforeEach(() => {
      // Открываем модальное окно перед каждым тестом
      cy.get('[data-cy="ingredient-bun"]').first().click();
      cy.get('[data-cy="modal"]').should('be.visible');
    });

    it('должно закрыть модальное окно при клике на кнопку закрытия', () => {
      // Кликаем на кнопку закрытия
      cy.get('[data-cy="modal-close-button"]').click();

      // Проверяем, что модальное окно закрылось
      cy.get('[data-cy="modal"]').should('not.exist');
    });

    it('должно закрыть модальное окно при клике на оверлей', () => {
      // Кликаем на оверлей
      cy.get('[data-cy="modal-overlay"]').click({ force: true });

      // Проверяем, что модальное окно закрылось
      cy.get('[data-cy="modal"]').should('not.exist');
    });

    it('должно закрыть модальное окно при нажатии клавиши Escape', () => {
      // Нажимаем клавишу Escape
      cy.get('body').type('{esc}');

      // Проверяем, что модальное окно закрылось
      cy.get('[data-cy="modal"]').should('not.exist');
    });

    it('не должно закрыть модальное окно при клике внутри модального окна', () => {
      // Кликаем внутри модального окна (на детали ингредиента)
      cy.get('[data-cy="ingredient-details"]').click();

      // Проверяем, что модальное окно остается открытым
      cy.get('[data-cy="modal"]').should('be.visible');
    });
  });

  describe('Навигация и URL', () => {
    it('должно изменить URL при открытии модального окна', () => {
      // Сохраняем изначальный URL
      cy.url().then((initialUrl) => {
        // Кликаем на ингредиент
        cy.get('[data-cy="ingredient-bun"]').first().click();

        // Проверяем, что URL изменился
        cy.url().should('not.equal', initialUrl);
        cy.url().should('include', '/ingredients/');
      });
    });

    it('должно восстановить URL при закрытии модального окна', () => {
      // Запоминаем начальный URL
      cy.url().as('initialUrl');

      // Открываем модальное окно
      cy.get('[data-cy="ingredient-bun"]').first().click();
      cy.get('[data-cy="modal"]').should('be.visible');

      // Закрываем модальное окно
      cy.get('[data-cy="modal-close-button"]').click();

      // Проверяем, что URL восстановился
      cy.get('@initialUrl').then((initialUrl) => {
        cy.url().should('equal', initialUrl);
      });
    });
  });

  describe('Доступность (accessibility)', () => {
    beforeEach(() => {
      cy.get('[data-cy="ingredient-bun"]').first().click();
      cy.get('[data-cy="modal"]').should('be.visible');
    });

    it('должно иметь правильные ARIA атрибуты', () => {
      // Проверяем ARIA атрибуты модального окна
      cy.get('[data-cy="modal"]').should('have.attr', 'role', 'dialog');
      cy.get('[data-cy="modal"]').should('have.attr', 'aria-modal', 'true');
    });

    it('должно иметь доступную кнопку закрытия', () => {
      // Проверяем aria-label кнопки закрытия
      cy.get('[data-cy="modal-close-button"]').should(
        'have.attr',
        'aria-label',
        'Закрыть модальное окно'
      );
    });
  });

  describe('Производительность и стабильность', () => {
    it('должно корректно открывать и закрывать модальное окно несколько раз подряд', () => {
      // Повторяем открытие/закрытие 3 раза
      for (let i = 0; i < 3; i++) {
        cy.get('[data-cy="ingredient-bun"]').first().click();
        cy.get('[data-cy="modal"]').should('be.visible');
        cy.get('[data-cy="modal-close-button"]').click();
        cy.get('[data-cy="modal"]').should('not.exist');
      }
    });

    it('должно корректно обрабатывать отсутствующий ингредиент', () => {
      // Переходим по несуществующему ID ингредиента
      cy.visit('/ingredients/non-existent-id', { failOnStatusCode: false });

      // Проверяем обработку ошибки (в зависимости от реализации)
      // Это может быть 404 страница или модальное окно с сообщением об ошибке
    });
  });

  describe('Взаимодействие с конструктором', () => {
    it('должно сохранять состояние конструктора при открытии/закрытии модального окна', () => {
      // Добавляем ингредиент в конструктор
      cy.get('[data-cy="ingredient-bun"]').first().trigger('dragstart');
      cy.get('[data-cy="burger-constructor"]').trigger('dragover').trigger('drop');

      // Проверяем, что ингредиент добавлен
      cy.get('[data-cy="constructor-bun-top"]').should('exist');

      // Открываем модальное окно
      cy.get('[data-cy="ingredient-main"]').first().click();
      cy.get('[data-cy="modal"]').should('be.visible');

      // Закрываем модальное окно
      cy.get('[data-cy="modal-close-button"]').click();

      // Проверяем, что состояние конструктора сохранилось
      cy.get('[data-cy="constructor-bun-top"]').should('exist');
    });
  });
});
