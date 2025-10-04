import { SELECTORS } from '../support/selectors';

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
      cy.get(SELECTORS.INGREDIENT_BUN).first().click();

      // Проверяем, что модальное окно открылось
      cy.get(SELECTORS.MODAL).should('be.visible');
      cy.get(SELECTORS.INGREDIENT_DETAILS).should('be.visible');
      cy.get(SELECTORS.INGREDIENT_DETAILS_TITLE).should('contain', 'Детали ингредиента');
    });

    it('должно отображать правильную информацию об ингредиенте в модальном окне', () => {
      // Кликаем на конкретный ингредиент
      cy.get(SELECTORS.INGREDIENT_BUN).first().click();

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

    it('должно открывать модальное окно для разных типов ингредиентов', () => {
      // Тестируем булку
      cy.get(SELECTORS.INGREDIENT_BUN).first().click();
      cy.get(SELECTORS.INGREDIENT_DETAILS_NAME).should('be.visible');
      cy.get(SELECTORS.MODAL_CLOSE_BUTTON).click();
      cy.get(SELECTORS.MODAL).should('not.exist');

      // Тестируем основной ингредиент
      cy.get(SELECTORS.INGREDIENT_MAIN).first().click();
      cy.get(SELECTORS.INGREDIENT_DETAILS_NAME).should('be.visible');
      cy.get(SELECTORS.MODAL_CLOSE_BUTTON).click();
      cy.get(SELECTORS.MODAL).should('not.exist');

      // Тестируем соус
      cy.get(SELECTORS.INGREDIENT_SAUCE).first().click();
      cy.get(SELECTORS.INGREDIENT_DETAILS_NAME).should('be.visible');
      cy.get(SELECTORS.MODAL_CLOSE_BUTTON).click();
      cy.get(SELECTORS.MODAL).should('not.exist');
    });

    it('должно отображать корректные значения пищевой ценности', () => {
      cy.get(SELECTORS.INGREDIENT_BUN).first().click();

      // Проверяем, что значения пищевой ценности не пустые и являются числами
      cy.get(SELECTORS.NUTRITION_CALORIES)
        .find('p')
        .last()
        .should('not.be.empty')
        .invoke('text')
        .should('match', /^\d+$/);
      cy.get(SELECTORS.NUTRITION_PROTEINS)
        .find('p')
        .last()
        .should('not.be.empty')
        .invoke('text')
        .should('match', /^\d+$/);
      cy.get(SELECTORS.NUTRITION_FATS)
        .find('p')
        .last()
        .should('not.be.empty')
        .invoke('text')
        .should('match', /^\d+$/);
      cy.get(SELECTORS.NUTRITION_CARBOHYDRATES)
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
      cy.get(SELECTORS.INGREDIENT_BUN).first().click();
      cy.get(SELECTORS.MODAL).should('be.visible');
    });

    it('должно закрыть модальное окно при клике на кнопку закрытия', () => {
      // Кликаем на кнопку закрытия
      cy.get(SELECTORS.MODAL_CLOSE_BUTTON).click();

      // Проверяем, что модальное окно закрылось
      cy.get(SELECTORS.MODAL).should('not.exist');
    });

    it('должно закрыть модальное окно при клике на оверлей', () => {
      // Кликаем на оверлей
      cy.get(SELECTORS.MODAL_OVERLAY).click({ force: true });

      // Проверяем, что модальное окно закрылось
      cy.get(SELECTORS.MODAL).should('not.exist');
    });

    it('должно закрыть модальное окно при нажатии клавиши Escape', () => {
      // Нажимаем клавишу Escape
      cy.get('body').type('{esc}');

      // Проверяем, что модальное окно закрылось
      cy.get(SELECTORS.MODAL).should('not.exist');
    });

    it('не должно закрыть модальное окно при клике внутри модального окна', () => {
      // Кликаем внутри модального окна (на детали ингредиента)
      cy.get(SELECTORS.INGREDIENT_DETAILS).click();

      // Проверяем, что модальное окно остается открытым
      cy.get(SELECTORS.MODAL).should('be.visible');
    });
  });

  describe('Навигация и URL', () => {
    it('должно изменить URL при открытии модального окна', () => {
      // Сохраняем изначальный URL
      cy.url().then((initialUrl) => {
        // Кликаем на ингредиент
        cy.get(SELECTORS.INGREDIENT_BUN).first().click();

        // Проверяем, что URL изменился
        cy.url().should('not.equal', initialUrl);
        cy.url().should('include', '/ingredients/');
      });
    });

    it('должно восстановить URL при закрытии модального окна', () => {
      // Запоминаем начальный URL
      cy.url().as('initialUrl');

      // Открываем модальное окно
      cy.get(SELECTORS.INGREDIENT_BUN).first().click();
      cy.get(SELECTORS.MODAL).should('be.visible');

      // Закрываем модальное окно
      cy.get(SELECTORS.MODAL_CLOSE_BUTTON).click();

      // Проверяем, что URL восстановился
      cy.get('@initialUrl').then((initialUrl) => {
        cy.url().should('equal', initialUrl);
      });
    });
  });

  describe('Доступность (accessibility)', () => {
    beforeEach(() => {
      cy.get(SELECTORS.INGREDIENT_BUN).first().click();
      cy.get(SELECTORS.MODAL).should('be.visible');
    });

    it('должно иметь правильные ARIA атрибуты', () => {
      // Проверяем ARIA атрибуты модального окна
      cy.get(SELECTORS.MODAL).should('have.attr', 'role', 'dialog');
      cy.get(SELECTORS.MODAL).should('have.attr', 'aria-modal', 'true');
    });

    it('должно иметь доступную кнопку закрытия', () => {
      // Проверяем aria-label кнопки закрытия
      cy.get(SELECTORS.MODAL_CLOSE_BUTTON).should(
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
        cy.get(SELECTORS.INGREDIENT_BUN).first().click();
        cy.get(SELECTORS.MODAL).should('be.visible');
        cy.get(SELECTORS.MODAL_CLOSE_BUTTON).click();
        cy.get(SELECTORS.MODAL).should('not.exist');
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
      cy.get(SELECTORS.INGREDIENT_BUN).first().trigger('dragstart');
      cy.get(SELECTORS.BURGER_CONSTRUCTOR).trigger('dragover').trigger('drop');

      // Проверяем, что ингредиент добавлен
      cy.get(SELECTORS.CONSTRUCTOR_BUN_TOP).should('exist');

      // Открываем модальное окно
      cy.get(SELECTORS.INGREDIENT_MAIN).first().click();
      cy.get(SELECTORS.MODAL).should('be.visible');

      // Закрываем модальное окно
      cy.get(SELECTORS.MODAL_CLOSE_BUTTON).click();

      // Проверяем, что состояние конструктора сохранилось
      cy.get(SELECTORS.CONSTRUCTOR_BUN_TOP).should('exist');
    });
  });
});
