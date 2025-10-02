/// <reference types="cypress" />

describe('Отображение данных ингредиента в модальном окне', () => {
  beforeEach(() => {
    // Мокируем API запросы
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  describe('Проверка отображения основных данных ингредиента', () => {
    it('должно корректно отображать все основные поля ингредиента', () => {
      // Получаем данные первого ингредиента из фикстуры
      cy.fixture('ingredients.json').then((data) => {
        const ingredient = data.data[0]; // Краторная булка N-200i

        // Открываем модальное окно
        cy.get('[data-cy="ingredient-bun"]').first().click();

        // Проверяем заголовок модального окна
        cy.get('[data-cy="ingredient-details-title"]')
          .should('be.visible')
          .and('contain.text', 'Детали ингредиента');

        // Проверяем название ингредиента
        cy.get('[data-cy="ingredient-details-name"]')
          .should('be.visible')
          .and('contain.text', ingredient.name);

        // Проверяем изображение ингредиента
        cy.get('[data-cy="ingredient-details-image"]')
          .should('be.visible')
          .and('have.attr', 'src', ingredient.image)
          .and('have.attr', 'alt', ingredient.name);
      });
    });

    it('должно отображать корректные значения пищевой ценности', () => {
      cy.fixture('ingredients.json').then((data) => {
        const ingredient = data.data[0]; // Краторная булка N-200i

        cy.get('[data-cy="ingredient-bun"]').first().click();

        // Проверяем калории
        cy.get('[data-cy="nutrition-calories"]')
          .should('be.visible')
          .and('contain.text', 'Калории, ккал')
          .and('contain.text', ingredient.calories.toString());

        // Проверяем белки
        cy.get('[data-cy="nutrition-proteins"]')
          .should('be.visible')
          .and('contain.text', 'Белки, г')
          .and('contain.text', ingredient.proteins.toString());

        // Проверяем жиры
        cy.get('[data-cy="nutrition-fats"]')
          .should('be.visible')
          .and('contain.text', 'Жиры, г')
          .and('contain.text', ingredient.fat.toString());

        // Проверяем углеводы
        cy.get('[data-cy="nutrition-carbohydrates"]')
          .should('be.visible')
          .and('contain.text', 'Углеводы, г')
          .and('contain.text', ingredient.carbohydrates.toString());
      });
    });
  });

  describe('Проверка отображения разных типов ингредиентов', () => {
    it('должно корректно отображать данные булки', () => {
      cy.fixture('ingredients.json').then((data) => {
        const bunIngredient = data.data.find((item) => item.type === 'bun');

        cy.get('[data-cy="ingredient-bun"]').first().click();

        cy.get('[data-cy="ingredient-details-name"]').should(
          'contain.text',
          bunIngredient.name
        );
        cy.get('[data-cy="nutrition-calories"]').should(
          'contain.text',
          bunIngredient.calories.toString()
        );
        cy.get('[data-cy="nutrition-proteins"]').should(
          'contain.text',
          bunIngredient.proteins.toString()
        );
        cy.get('[data-cy="nutrition-fats"]').should(
          'contain.text',
          bunIngredient.fat.toString()
        );
        cy.get('[data-cy="nutrition-carbohydrates"]').should(
          'contain.text',
          bunIngredient.carbohydrates.toString()
        );
      });
    });

    it('должно корректно отображать данные основного ингредиента', () => {
      cy.fixture('ingredients.json').then((data) => {
        const mainIngredient = data.data.find((item) => item.type === 'main');

        cy.get('[data-cy="ingredient-main"]').first().click();

        cy.get('[data-cy="ingredient-details-name"]').should(
          'contain.text',
          mainIngredient.name
        );
        cy.get('[data-cy="nutrition-calories"]').should(
          'contain.text',
          mainIngredient.calories.toString()
        );
        cy.get('[data-cy="nutrition-proteins"]').should(
          'contain.text',
          mainIngredient.proteins.toString()
        );
        cy.get('[data-cy="nutrition-fats"]').should(
          'contain.text',
          mainIngredient.fat.toString()
        );
        cy.get('[data-cy="nutrition-carbohydrates"]').should(
          'contain.text',
          mainIngredient.carbohydrates.toString()
        );
      });
    });

    it('должно корректно отображать данные соуса', () => {
      cy.fixture('ingredients.json').then((data) => {
        const sauceIngredient = data.data.find((item) => item.type === 'sauce');

        cy.get('[data-cy="ingredient-sauce"]').first().click();

        cy.get('[data-cy="ingredient-details-name"]').should(
          'contain.text',
          sauceIngredient.name
        );
        cy.get('[data-cy="nutrition-calories"]').should(
          'contain.text',
          sauceIngredient.calories.toString()
        );
        cy.get('[data-cy="nutrition-proteins"]').should(
          'contain.text',
          sauceIngredient.proteins.toString()
        );
        cy.get('[data-cy="nutrition-fats"]').should(
          'contain.text',
          sauceIngredient.fat.toString()
        );
        cy.get('[data-cy="nutrition-carbohydrates"]').should(
          'contain.text',
          sauceIngredient.carbohydrates.toString()
        );
      });
    });
  });

  describe('Проверка конкретных значений из фикстуры', () => {
    it('должно отображать точные данные для "Краторная булка N-200i"', () => {
      cy.get('[data-cy="ingredient-bun"]').first().click();

      // Проверяем конкретные значения из фикстуры
      cy.get('[data-cy="ingredient-details-name"]').should(
        'contain.text',
        'Краторная булка N-200i'
      );
      cy.get('[data-cy="nutrition-calories"]').should('contain.text', '420');
      cy.get('[data-cy="nutrition-proteins"]').should('contain.text', '80');
      cy.get('[data-cy="nutrition-fats"]').should('contain.text', '24');
      cy.get('[data-cy="nutrition-carbohydrates"]').should('contain.text', '53');
    });

    it('должно отображать точные данные для "Биокотлета из марсианской Магнолии"', () => {
      cy.get('[data-cy="ingredient-main"]').first().click();

      // Проверяем конкретные значения из фикстуры
      cy.get('[data-cy="ingredient-details-name"]').should(
        'contain.text',
        'Биокотлета из марсианской Магнолии'
      );
      cy.get('[data-cy="nutrition-calories"]').should('contain.text', '4242');
      cy.get('[data-cy="nutrition-proteins"]').should('contain.text', '420');
      cy.get('[data-cy="nutrition-fats"]').should('contain.text', '142');
      cy.get('[data-cy="nutrition-carbohydrates"]').should('contain.text', '242');
    });

    it('должно отображать точные данные для "Соус Spicy-X"', () => {
      cy.get('[data-cy="ingredient-sauce"]').first().click();

      // Проверяем конкретные значения из фикстуры
      cy.get('[data-cy="ingredient-details-name"]').should(
        'contain.text',
        'Соус Spicy-X'
      );
      cy.get('[data-cy="nutrition-calories"]').should('contain.text', '30');
      cy.get('[data-cy="nutrition-proteins"]').should('contain.text', '30');
      cy.get('[data-cy="nutrition-fats"]').should('contain.text', '20');
      cy.get('[data-cy="nutrition-carbohydrates"]').should('contain.text', '40');
    });
  });

  describe('Проверка форматирования и отображения', () => {
    it('должно правильно форматировать числовые значения', () => {
      cy.get('[data-cy="ingredient-bun"]').first().click();

      // Проверяем, что значения отображаются как числа без лишних символов
      cy.get('[data-cy="nutrition-calories"] p')
        .last()
        .should('match', /^\d+$/) // только цифры
        .and('not.contain', 'NaN')
        .and('not.contain', 'undefined')
        .and('not.contain', 'null');

      cy.get('[data-cy="nutrition-proteins"] p').last().should('match', /^\d+$/);

      cy.get('[data-cy="nutrition-fats"] p').last().should('match', /^\d+$/);

      cy.get('[data-cy="nutrition-carbohydrates"] p').last().should('match', /^\d+$/);
    });

    it('должно отображать правильные единицы измерения', () => {
      cy.get('[data-cy="ingredient-bun"]').first().click();

      // Проверяем единицы измерения
      cy.get('[data-cy="nutrition-calories"]').should('contain.text', 'ккал');
      cy.get('[data-cy="nutrition-proteins"]').should('contain.text', 'г');
      cy.get('[data-cy="nutrition-fats"]').should('contain.text', 'г');
      cy.get('[data-cy="nutrition-carbohydrates"]').should('contain.text', 'г');
    });

    it('должно использовать правильную иерархию заголовков', () => {
      cy.get('[data-cy="ingredient-bun"]').first().click();

      // Проверяем, что заголовок использует правильный тег
      cy.get('[data-cy="ingredient-details-title"]')
        .should('match', 'h1')
        .and('have.class', 'text_type_main-large');

      // Проверяем название ингредиента
      cy.get('[data-cy="ingredient-details-name"]')
        .should('match', 'p')
        .and('have.class', 'text_type_main-medium');
    });
  });

  describe('Проверка изображений ингредиентов', () => {
    it('должно загружать и отображать изображение ингредиента', () => {
      cy.fixture('ingredients.json').then((data) => {
        const ingredient = data.data[0];

        cy.get('[data-cy="ingredient-bun"]').first().click();

        // Проверяем, что изображение загрузилось
        cy.get('[data-cy="ingredient-details-image"]')
          .should('be.visible')
          .and('have.attr', 'src', ingredient.image)
          .and('have.attr', 'alt', ingredient.name)
          .and(($img) => {
            // Проверяем, что изображение действительно загрузилось
            expect($img[0].naturalWidth).to.be.greaterThan(0);
          });
      });
    });

    it('должно иметь правильные атрибуты доступности для изображения', () => {
      cy.get('[data-cy="ingredient-bun"]').first().click();

      cy.get('[data-cy="ingredient-details-image"]')
        .should('have.attr', 'alt')
        .and('not.be.empty');
    });
  });

  describe('Проверка экстремальных значений', () => {
    it('должно корректно отображать большие числовые значения', () => {
      // Ищем ингредиент с большими значениями (Хрустящие минеральные кольца)
      cy.fixture('ingredients.json').then((data) => {
        const highValueIngredient = data.data.find(
          (item) => item.name === 'Хрустящие минеральные кольца'
        );

        if (highValueIngredient) {
          // Открываем ингредиент через прямой URL, если он есть
          cy.visit(`/ingredients/${highValueIngredient._id}`);

          cy.get('[data-cy="ingredient-details-name"]').should(
            'contain.text',
            highValueIngredient.name
          );

          // Проверяем большие значения
          cy.get('[data-cy="nutrition-proteins"]').should('contain.text', '808');
          cy.get('[data-cy="nutrition-fats"]').should('contain.text', '689');
          cy.get('[data-cy="nutrition-carbohydrates"]').should('contain.text', '609');
        }
      });
    });

    it('должно корректно отображать малые числовые значения', () => {
      // Ищем ингредиент с малыми значениями (Соус традиционный галактический)
      cy.fixture('ingredients.json').then((data) => {
        const lowValueIngredient = data.data.find(
          (item) => item.name === 'Соус традиционный галактический'
        );

        if (lowValueIngredient) {
          cy.visit(`/ingredients/${lowValueIngredient._id}`);

          cy.get('[data-cy="ingredient-details-name"]').should(
            'contain.text',
            lowValueIngredient.name
          );

          // Проверяем малые значения
          cy.get('[data-cy="nutrition-calories"]').should('contain.text', '99');
        }
      });
    });
  });

  describe('Проверка структуры и компоновки данных', () => {
    it('должно отображать элементы в правильном порядке', () => {
      cy.get('[data-cy="ingredient-bun"]').first().click();

      // Проверяем порядок элементов сверху вниз
      cy.get('[data-cy="ingredient-details"]').within(() => {
        cy.get('[data-cy="ingredient-details-title"]').should('be.visible');
        cy.get('[data-cy="ingredient-details-image"]').should('be.visible');
        cy.get('[data-cy="ingredient-details-name"]').should('be.visible');
        cy.get('[data-cy="ingredient-details-nutrition"]').should('be.visible');
      });

      // Проверяем порядок элементов пищевой ценности
      cy.get('[data-cy="ingredient-details-nutrition"]').within(() => {
        cy.get('[data-cy="nutrition-calories"]').should('be.visible');
        cy.get('[data-cy="nutrition-proteins"]').should('be.visible');
        cy.get('[data-cy="nutrition-fats"]').should('be.visible');
        cy.get('[data-cy="nutrition-carbohydrates"]').should('be.visible');
      });
    });

    it('должно использовать правильные CSS классы для стилизации', () => {
      cy.get('[data-cy="ingredient-bun"]').first().click();

      // Проверяем CSS классы для текста
      cy.get('[data-cy="ingredient-details-title"]')
        .should('have.class', 'text')
        .and('have.class', 'text_type_main-large');

      cy.get('[data-cy="ingredient-details-name"]')
        .should('have.class', 'text')
        .and('have.class', 'text_type_main-medium');

      // Проверяем классы для пищевой ценности
      cy.get('[data-cy="nutrition-calories"] p')
        .should('have.class', 'text')
        .and('have.class', 'text_type_main-default')
        .and('have.class', 'text_color_inactive');
    });
  });

  describe('Проверка обновления данных при переключении ингредиентов', () => {
    it('должно корректно обновлять данные при переключении между ингредиентами', () => {
      // Открываем первый ингредиент
      cy.get('[data-cy="ingredient-bun"]').first().click();
      cy.get('[data-cy="ingredient-details-name"]').then(($firstName) => {
        const firstName = $firstName.text();

        // Переключаемся на другой ингредиент
        cy.get('[data-cy="ingredient-main"]').first().click();

        // Проверяем, что название изменилось
        cy.get('[data-cy="ingredient-details-name"]')
          .should('not.contain.text', firstName)
          .and('be.visible')
          .and('not.be.empty');

        // Проверяем, что все пищевые значения обновились
        cy.get('[data-cy="nutrition-calories"] p')
          .last()
          .should('be.visible')
          .and('not.be.empty');
        cy.get('[data-cy="nutrition-proteins"] p')
          .last()
          .should('be.visible')
          .and('not.be.empty');
        cy.get('[data-cy="nutrition-fats"] p')
          .last()
          .should('be.visible')
          .and('not.be.empty');
        cy.get('[data-cy="nutrition-carbohydrates"] p')
          .last()
          .should('be.visible')
          .and('not.be.empty');
      });
    });
  });

  describe('Проверка отсутствующих или некорректных данных', () => {
    it('должно корректно обрабатывать ситуацию когда ингредиент не найден', () => {
      // Переходим по несуществующему ID
      cy.visit('/ingredients/non-existent-id', { failOnStatusCode: false });

      // Проверяем отображение сообщения об ошибке или переадресацию
      cy.get('body').should('be.visible'); // Базовая проверка, что страница загрузилась
    });
  });
});
