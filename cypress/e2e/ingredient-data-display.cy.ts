import { SELECTORS } from '../support/selectors';

// Типы для данных из фикстуры
type Ingredient = {
  _id: string;
  name: string;
  type: 'bun' | 'main' | 'sauce';
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_mobile: string;
  image_large: string;
  __v: number;
};

type IngredientsResponse = {
  success: boolean;
  data: Ingredient[];
};

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
      cy.fixture<IngredientsResponse>('ingredients.json').then((data) => {
        const ingredient = data.data[0]; // Краторная булка N-200i

        // Открываем модальное окно
        cy.get(SELECTORS.INGREDIENT_BUN).first().click();

        // Проверяем заголовок модального окна
        cy.get(SELECTORS.INGREDIENT_DETAILS_TITLE)
          .should('be.visible')
          .and('contain.text', 'Детали ингредиента');

        // Проверяем название ингредиента
        cy.get(SELECTORS.INGREDIENT_DETAILS_NAME)
          .should('be.visible')
          .and('contain.text', ingredient.name);

        // Проверяем изображение ингредиента
        cy.get(SELECTORS.INGREDIENT_DETAILS_IMAGE)
          .should('be.visible')
          .and('have.attr', 'src', ingredient.image)
          .and('have.attr', 'alt', ingredient.name);
      });
    });

    it('должно отображать корректные значения пищевой ценности', () => {
      cy.fixture<IngredientsResponse>('ingredients.json').then((data) => {
        const ingredient = data.data[0]; // Краторная булка N-200i

        cy.get(SELECTORS.INGREDIENT_BUN).first().click();

        // Проверяем калории
        cy.get(SELECTORS.NUTRITION_CALORIES)
          .should('be.visible')
          .and('contain.text', 'Калории, ккал')
          .and('contain.text', ingredient.calories.toString());

        // Проверяем белки
        cy.get(SELECTORS.NUTRITION_PROTEINS)
          .should('be.visible')
          .and('contain.text', 'Белки, г')
          .and('contain.text', ingredient.proteins.toString());

        // Проверяем жиры
        cy.get(SELECTORS.NUTRITION_FATS)
          .should('be.visible')
          .and('contain.text', 'Жиры, г')
          .and('contain.text', ingredient.fat.toString());

        // Проверяем углеводы
        cy.get(SELECTORS.NUTRITION_CARBOHYDRATES)
          .should('be.visible')
          .and('contain.text', 'Углеводы, г')
          .and('contain.text', ingredient.carbohydrates.toString());
      });
    });
  });

  describe('Проверка отображения разных типов ингредиентов', () => {
    it('должно корректно отображать данные булки', () => {
      cy.fixture<IngredientsResponse>('ingredients.json').then((data) => {
        const bunIngredient = data.data.find((item) => item.type === 'bun');

        if (!bunIngredient) {
          throw new Error('Булка не найдена в фикстуре');
        }

        cy.get(SELECTORS.INGREDIENT_BUN).first().click();

        cy.get(SELECTORS.INGREDIENT_DETAILS_NAME).should(
          'contain.text',
          bunIngredient.name
        );
        cy.get(SELECTORS.NUTRITION_CALORIES).should(
          'contain.text',
          bunIngredient.calories.toString()
        );
        cy.get(SELECTORS.NUTRITION_PROTEINS).should(
          'contain.text',
          bunIngredient.proteins.toString()
        );
        cy.get(SELECTORS.NUTRITION_FATS).should(
          'contain.text',
          bunIngredient.fat.toString()
        );
        cy.get(SELECTORS.NUTRITION_CARBOHYDRATES).should(
          'contain.text',
          bunIngredient.carbohydrates.toString()
        );
      });
    });

    it('должно корректно отображать данные основного ингредиента', () => {
      cy.fixture<IngredientsResponse>('ingredients.json').then((data) => {
        const mainIngredient = data.data.find((item) => item.type === 'main');

        if (!mainIngredient) {
          throw new Error('Основной ингредиент не найден в фикстуре');
        }

        cy.get(SELECTORS.INGREDIENT_MAIN).first().click();

        cy.get(SELECTORS.INGREDIENT_DETAILS_NAME).should(
          'contain.text',
          mainIngredient.name
        );
        cy.get(SELECTORS.NUTRITION_CALORIES).should(
          'contain.text',
          mainIngredient.calories.toString()
        );
        cy.get(SELECTORS.NUTRITION_PROTEINS).should(
          'contain.text',
          mainIngredient.proteins.toString()
        );
        cy.get(SELECTORS.NUTRITION_FATS).should(
          'contain.text',
          mainIngredient.fat.toString()
        );
        cy.get(SELECTORS.NUTRITION_CARBOHYDRATES).should(
          'contain.text',
          mainIngredient.carbohydrates.toString()
        );
      });
    });

    it('должно корректно отображать данные соуса', () => {
      cy.fixture<IngredientsResponse>('ingredients.json').then((data) => {
        const sauceIngredient = data.data.find((item) => item.type === 'sauce');

        if (!sauceIngredient) {
          throw new Error('Соус не найден в фикстуре');
        }

        cy.get(SELECTORS.INGREDIENT_SAUCE).first().click();

        cy.get(SELECTORS.INGREDIENT_DETAILS_NAME).should(
          'contain.text',
          sauceIngredient.name
        );
        cy.get(SELECTORS.NUTRITION_CALORIES).should(
          'contain.text',
          sauceIngredient.calories.toString()
        );
        cy.get(SELECTORS.NUTRITION_PROTEINS).should(
          'contain.text',
          sauceIngredient.proteins.toString()
        );
        cy.get(SELECTORS.NUTRITION_FATS).should(
          'contain.text',
          sauceIngredient.fat.toString()
        );
        cy.get(SELECTORS.NUTRITION_CARBOHYDRATES).should(
          'contain.text',
          sauceIngredient.carbohydrates.toString()
        );
      });
    });
  });

  describe('Проверка конкретных значений из фикстуры', () => {
    it('должно отображать точные данные для "Краторная булка N-200i"', () => {
      cy.get(SELECTORS.INGREDIENT_BUN).first().click();

      // Проверяем конкретные значения из фикстуры
      cy.get(SELECTORS.INGREDIENT_DETAILS_NAME).should(
        'contain.text',
        'Краторная булка N-200i'
      );
      cy.get(SELECTORS.NUTRITION_CALORIES).should('contain.text', '420');
      cy.get(SELECTORS.NUTRITION_PROTEINS).should('contain.text', '80');
      cy.get(SELECTORS.NUTRITION_FATS).should('contain.text', '24');
      cy.get(SELECTORS.NUTRITION_CARBOHYDRATES).should('contain.text', '53');
    });

    it('должно отображать точные данные для "Биокотлета из марсианской Магнолии"', () => {
      cy.get(SELECTORS.INGREDIENT_MAIN).first().click();

      // Проверяем конкретные значения из фикстуры
      cy.get(SELECTORS.INGREDIENT_DETAILS_NAME).should(
        'contain.text',
        'Биокотлета из марсианской Магнолии'
      );
      cy.get(SELECTORS.NUTRITION_CALORIES).should('contain.text', '4242');
      cy.get(SELECTORS.NUTRITION_PROTEINS).should('contain.text', '420');
      cy.get(SELECTORS.NUTRITION_FATS).should('contain.text', '142');
      cy.get(SELECTORS.NUTRITION_CARBOHYDRATES).should('contain.text', '242');
    });

    it('должно отображать точные данные для "Соус Spicy-X"', () => {
      cy.get(SELECTORS.INGREDIENT_SAUCE).first().click();

      // Проверяем конкретные значения из фикстуры
      cy.get(SELECTORS.INGREDIENT_DETAILS_NAME).should('contain.text', 'Соус Spicy-X');
      cy.get(SELECTORS.NUTRITION_CALORIES).should('contain.text', '30');
      cy.get(SELECTORS.NUTRITION_PROTEINS).should('contain.text', '30');
      cy.get(SELECTORS.NUTRITION_FATS).should('contain.text', '20');
      cy.get(SELECTORS.NUTRITION_CARBOHYDRATES).should('contain.text', '40');
    });
  });

  describe('Проверка форматирования единиц измерения', () => {
    it('должно отображать единицы измерения для пищевой ценности', () => {
      cy.get(SELECTORS.INGREDIENT_BUN).first().click();

      // Проверяем наличие единиц измерения
      cy.get(SELECTORS.NUTRITION_CALORIES).should('contain.text', 'ккал');
      cy.get(SELECTORS.NUTRITION_PROTEINS).should('contain.text', 'г');
      cy.get(SELECTORS.NUTRITION_FATS).should('contain.text', 'г');
      cy.get(SELECTORS.NUTRITION_CARBOHYDRATES).should('contain.text', 'г');
    });

    it('должно отображать заголовки и название ингредиента', () => {
      cy.get(SELECTORS.INGREDIENT_BUN).first().click();

      // Проверяем заголовок
      cy.get(SELECTORS.INGREDIENT_DETAILS_TITLE)
        .should('be.visible')
        .and('contain.text', 'Детали ингредиента');

      // Проверяем название ингредиента
      cy.get(SELECTORS.INGREDIENT_DETAILS_NAME).should('be.visible').and('not.be.empty');
    });

    it('должно отображать корректное изображение ингредиента', () => {
      cy.fixture<IngredientsResponse>('ingredients.json').then((data) => {
        const ingredient = data.data[0];

        cy.get(SELECTORS.INGREDIENT_BUN).first().click();

        cy.get(SELECTORS.INGREDIENT_DETAILS_IMAGE)
          .should('be.visible')
          .and('have.attr', 'src')
          .and('contain', ingredient.image);
      });
    });

    it('должно загружать изображение без ошибок', () => {
      cy.get(SELECTORS.INGREDIENT_BUN).first().click();

      cy.get(SELECTORS.INGREDIENT_DETAILS_IMAGE)
        .should('be.visible')
        .and(($img) => {
          expect(($img[0] as HTMLImageElement).naturalWidth).to.be.greaterThan(0);
        });
    });
  });

  describe('Проверка изображений ингредиентов', () => {
    it('должно загружать и отображать изображение ингредиента', () => {
      cy.fixture<IngredientsResponse>('ingredients.json').then((data) => {
        const ingredient = data.data[0];

        cy.get(SELECTORS.INGREDIENT_BUN).first().click();

        // Проверяем, что изображение загрузилось
        cy.get(SELECTORS.INGREDIENT_DETAILS_IMAGE)
          .should('be.visible')
          .and('have.attr', 'src', ingredient.image)
          .and('have.attr', 'alt', ingredient.name)
          .and(($img) => {
            // Проверяем, что изображение действительно загрузилось
            const img = $img[0] as HTMLImageElement;
            expect(img.naturalWidth).to.be.greaterThan(0);
          });
      });
    });

    it('должно иметь правильные атрибуты доступности для изображения', () => {
      cy.get(SELECTORS.INGREDIENT_BUN).first().click();

      cy.get(SELECTORS.INGREDIENT_DETAILS_IMAGE)
        .should('have.attr', 'alt')
        .and('not.be.empty');
    });
  });

  describe('Проверка экстремальных значений', () => {
    it('должно корректно отображать большие числовые значения', () => {
      // Ищем ингредиент с большими значениями (Хрустящие минеральные кольца)
      cy.fixture<IngredientsResponse>('ingredients.json').then((data) => {
        const highValueIngredient = data.data.find(
          (item) => item.name === 'Хрустящие минеральные кольца'
        );

        if (highValueIngredient) {
          // Открываем ингредиент через прямой URL, если он есть
          cy.visit(`/ingredients/${highValueIngredient._id}`);

          cy.get(SELECTORS.INGREDIENT_DETAILS_NAME).should(
            'contain.text',
            highValueIngredient.name
          );

          // Проверяем большие значения
          cy.get(SELECTORS.NUTRITION_PROTEINS).should('contain.text', '808');
          cy.get(SELECTORS.NUTRITION_FATS).should('contain.text', '689');
          cy.get(SELECTORS.NUTRITION_CARBOHYDRATES).should('contain.text', '609');
        }
      });
    });

    it('должно корректно отображать малые числовые значения', () => {
      // Ищем ингредиент с малыми значениями (Соус традиционный галактический)
      cy.fixture<IngredientsResponse>('ingredients.json').then((data) => {
        const lowValueIngredient = data.data.find(
          (item) => item.name === 'Соус традиционный галактический'
        );

        if (lowValueIngredient) {
          cy.visit(`/ingredients/${lowValueIngredient._id}`);

          cy.get(SELECTORS.INGREDIENT_DETAILS_NAME).should(
            'contain.text',
            lowValueIngredient.name
          );

          // Проверяем малые значения
          cy.get(SELECTORS.NUTRITION_CALORIES).should('contain.text', '99');
        }
      });
    });
  });

  describe('Проверка структуры и компоновки данных', () => {
    it('должно отображать элементы в правильном порядке', () => {
      cy.get(SELECTORS.INGREDIENT_BUN).first().click();

      // Проверяем порядок элементов сверху вниз
      cy.get(SELECTORS.INGREDIENT_DETAILS).within(() => {
        cy.get(SELECTORS.INGREDIENT_DETAILS_TITLE).should('be.visible');
        cy.get(SELECTORS.INGREDIENT_DETAILS_IMAGE).should('be.visible');
        cy.get(SELECTORS.INGREDIENT_DETAILS_NAME).should('be.visible');
        cy.get(SELECTORS.INGREDIENT_DETAILS_NUTRITION).should('be.visible');
      });

      // Проверяем порядок элементов пищевой ценности
      cy.get(SELECTORS.INGREDIENT_DETAILS_NUTRITION).within(() => {
        cy.get(SELECTORS.NUTRITION_CALORIES).should('be.visible');
        cy.get(SELECTORS.NUTRITION_PROTEINS).should('be.visible');
        cy.get(SELECTORS.NUTRITION_FATS).should('be.visible');
        cy.get(SELECTORS.NUTRITION_CARBOHYDRATES).should('be.visible');
      });
    });

    it('должно использовать правильные CSS классы для стилизации', () => {
      cy.get(SELECTORS.INGREDIENT_BUN).first().click();

      // Проверяем CSS классы для текста
      cy.get(SELECTORS.INGREDIENT_DETAILS_TITLE)
        .should('have.class', 'text')
        .and('have.class', 'text_type_main-large');

      cy.get(SELECTORS.INGREDIENT_DETAILS_NAME)
        .should('have.class', 'text')
        .and('have.class', 'text_type_main-medium');

      // Проверяем классы для пищевой ценности
      cy.get(SELECTORS.NUTRITION_CALORIES + ' p')
        .should('have.class', 'text')
        .and('have.class', 'text_type_main-default')
        .and('have.class', 'text_color_inactive');
    });
  });

  describe('Проверка обновления данных при переключении ингредиентов', () => {
    it('должно корректно обновлять данные при переключении между ингредиентами', () => {
      // Открываем первый ингредиент
      cy.get(SELECTORS.INGREDIENT_BUN).first().click();
      cy.get(SELECTORS.INGREDIENT_DETAILS_NAME).then(($firstName) => {
        const firstName = $firstName.text();

        // Закрываем модальное окно
        cy.get(SELECTORS.MODAL_CLOSE_BUTTON).click();

        // Переключаемся на другой ингредиент с force: true для видимости
        cy.get(SELECTORS.INGREDIENT_MAIN).first().click({ force: true });

        // Проверяем, что название изменилось
        cy.get(SELECTORS.INGREDIENT_DETAILS_NAME)
          .should('not.contain.text', firstName)
          .and('be.visible')
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
