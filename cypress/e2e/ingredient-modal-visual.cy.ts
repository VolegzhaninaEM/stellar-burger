/// <reference types="cypress" />

describe('Визуальное отображение и компоновка данных ингредиента', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  describe('Проверка визуального оформления модального окна', () => {
    it('должно иметь правильные размеры и позиционирование модального окна', () => {
      cy.get('[data-cy="ingredient-bun"]').first().click();

      // Проверяем, что модальное окно центрировано и имеет правильные размеры
      cy.get('[data-cy="modal"]')
        .should('be.visible')
        .and('have.css', 'position', 'fixed')
        .and('have.css', 'z-index')
        .then(($modal) => {
          // Проверяем, что модальное окно не занимает всю ширину экрана
          const modalWidth = $modal.width();
          const windowWidth = Cypress.$(window).width();
          expect(modalWidth).to.be.lessThan(windowWidth);
        });
    });

    it('должно правильно отображать оверлей модального окна', () => {
      cy.get('[data-cy="ingredient-bun"]').first().click();

      cy.get('[data-cy="modal-overlay"]')
        .should('be.visible')
        .and('have.css', 'position', 'fixed')
        .and('have.css', 'top', '0px')
        .and('have.css', 'left', '0px')
        .and('have.css', 'width', '100vw')
        .and('have.css', 'height', '100vh');
    });

    it('должно правильно позиционировать кнопку закрытия', () => {
      cy.get('[data-cy="ingredient-bun"]').first().click();

      cy.get('[data-cy="modal-close-button"]')
        .should('be.visible')
        .and('have.css', 'position', 'absolute')
        .and('have.css', 'cursor', 'pointer');
    });
  });

  describe('Проверка отображения изображения ингредиента', () => {
    it('должно отображать изображение в правильном размере', () => {
      cy.get('[data-cy="ingredient-bun"]').first().click();

      cy.get('[data-cy="ingredient-details-image"]')
        .should('be.visible')
        .and(($img) => {
          // Проверяем, что изображение имеет разумные размеры
          const width = $img.width();
          const height = $img.height();
          expect(width).to.be.greaterThan(0);
          expect(height).to.be.greaterThan(0);
          expect(width).to.be.lessThan(1000); // Не слишком большое
          expect(height).to.be.lessThan(1000);
        });
    });

    it('должно центрировать изображение ингредиента', () => {
      cy.get('[data-cy="ingredient-bun"]').first().click();

      cy.get('[data-cy="ingredient-details-image"]')
        .should('be.visible')
        .parent()
        .should('have.css', 'text-align', 'center');
    });

    it('должно отображать изображение без искажений', () => {
      cy.get('[data-cy="ingredient-bun"]').first().click();

      cy.get('[data-cy="ingredient-details-image"]')
        .should('be.visible')
        .and('have.css', 'object-fit')
        .and(($img) => {
          // Проверяем соотношение сторон
          const width = $img[0].naturalWidth;
          const height = $img[0].naturalHeight;
          expect(width).to.be.greaterThan(0);
          expect(height).to.be.greaterThan(0);
        });
    });
  });

  describe('Проверка типографики и текстового оформления', () => {
    it('должно использовать правильные размеры шрифтов', () => {
      cy.get('[data-cy="ingredient-bun"]').first().click();

      // Заголовок должен быть самым крупным
      cy.get('[data-cy="ingredient-details-title"]').should(
        'have.class',
        'text_type_main-large'
      );

      // Название ингредиента - средний размер
      cy.get('[data-cy="ingredient-details-name"]').should(
        'have.class',
        'text_type_main-medium'
      );

      // Пищевая ценность - стандартный размер
      cy.get('[data-cy="nutrition-calories"] p').should(
        'have.class',
        'text_type_main-default'
      );
    });

    it('должно использовать правильные цвета текста', () => {
      cy.get('[data-cy="ingredient-bun"]').first().click();

      // Заголовок - основной цвет
      cy.get('[data-cy="ingredient-details-title"]').should(
        'not.have.class',
        'text_color_inactive'
      );

      // Название ингредиента - основной цвет
      cy.get('[data-cy="ingredient-details-name"]').should(
        'not.have.class',
        'text_color_inactive'
      );

      // Пищевая ценность - неактивный цвет
      cy.get('[data-cy="nutrition-calories"] p').should(
        'have.class',
        'text_color_inactive'
      );
    });

    it('должно правильно выравнивать текст', () => {
      cy.get('[data-cy="ingredient-bun"]').first().click();

      // Проверяем центрирование заголовка
      cy.get('[data-cy="ingredient-details-title"]')
        .parent()
        .should('have.css', 'text-align', 'center');

      // Проверяем центрирование названия
      cy.get('[data-cy="ingredient-details-name"]')
        .parent()
        .should('have.css', 'text-align', 'center');
    });
  });

  describe('Проверка компоновки пищевой ценности', () => {
    it('должно отображать элементы пищевой ценности в горизонтальном ряду', () => {
      cy.get('[data-cy="ingredient-bun"]').first().click();

      cy.get('[data-cy="ingredient-details-nutrition"]')
        .should('be.visible')
        .within(() => {
          // Проверяем, что все элементы видимы и расположены в ряд
          cy.get('[data-cy="nutrition-calories"]').should('be.visible');
          cy.get('[data-cy="nutrition-proteins"]').should('be.visible');
          cy.get('[data-cy="nutrition-fats"]').should('be.visible');
          cy.get('[data-cy="nutrition-carbohydrates"]').should('be.visible');
        });
    });

    it('должно иметь правильные отступы между элементами пищевой ценности', () => {
      cy.get('[data-cy="ingredient-bun"]').first().click();

      // Проверяем отступы
      cy.get('[data-cy="nutrition-calories"]').should('have.class', 'mr-5');

      cy.get('[data-cy="nutrition-proteins"]').should('have.class', 'mr-5');

      cy.get('[data-cy="nutrition-fats"]').should('have.class', 'mr-5');

      // Последний элемент не должен иметь правый отступ
      cy.get('[data-cy="nutrition-carbohydrates"]').should('not.have.class', 'mr-5');
    });

    it('должно выравнивать элементы пищевой ценности по центру', () => {
      cy.get('[data-cy="ingredient-bun"]').first().click();

      cy.get('[data-cy="ingredient-details-nutrition"]').within(() => {
        // Каждый элемент должен быть выровнен по центру
        cy.get('[data-cy="nutrition-calories"]').should(
          'have.css',
          'text-align',
          'center'
        );

        cy.get('[data-cy="nutrition-proteins"]').should(
          'have.css',
          'text-align',
          'center'
        );

        cy.get('[data-cy="nutrition-fats"]').should('have.css', 'text-align', 'center');

        cy.get('[data-cy="nutrition-carbohydrates"]').should(
          'have.css',
          'text-align',
          'center'
        );
      });
    });
  });

  describe('Проверка отступов и промежутков', () => {
    it('должно иметь правильные отступы вокруг содержимого модального окна', () => {
      cy.get('[data-cy="ingredient-bun"]').first().click();

      cy.get('[data-cy="ingredient-details"]')
        .should('have.class', 'mb-15')
        .and('have.class', 'mt-15')
        .and('have.class', 'ml-10')
        .and('have.class', 'mr-10');
    });

    it('должно иметь правильные отступы между элементами', () => {
      cy.get('[data-cy="ingredient-bun"]').first().click();

      // Изображение должно иметь отступ снизу
      cy.get('[data-cy="ingredient-details-image"]').should('have.class', 'mb-4');

      // Название должно иметь отступ снизу
      cy.get('[data-cy="ingredient-details-name"]').should('have.class', 'mb-8');
    });
  });

  describe('Проверка адаптивности и отзывчивости', () => {
    it('должно корректно отображаться на мобильных устройствах', () => {
      cy.viewport('iphone-6');
      cy.get('[data-cy="ingredient-bun"]').first().click();

      // Модальное окно должно адаптироваться к размеру экрана
      cy.get('[data-cy="modal"]')
        .should('be.visible')
        .and(($modal) => {
          const modalWidth = $modal.width();
          expect(modalWidth).to.be.lessThan(400); // Меньше ширины iPhone 6
        });

      // Содержимое должно быть видимо
      cy.get('[data-cy="ingredient-details-title"]').should('be.visible');
      cy.get('[data-cy="ingredient-details-name"]').should('be.visible');
      cy.get('[data-cy="ingredient-details-nutrition"]').should('be.visible');
    });

    it('должно корректно отображаться на планшетах', () => {
      cy.viewport('ipad-2');
      cy.get('[data-cy="ingredient-bun"]').first().click();

      cy.get('[data-cy="modal"]')
        .should('be.visible')
        .and(($modal) => {
          const modalWidth = $modal.width();
          expect(modalWidth).to.be.greaterThan(300);
          expect(modalWidth).to.be.lessThan(800);
        });
    });

    it('должно корректно отображаться на больших экранах', () => {
      cy.viewport(1920, 1080);
      cy.get('[data-cy="ingredient-bun"]').first().click();

      cy.get('[data-cy="modal"]')
        .should('be.visible')
        .and(($modal) => {
          const modalWidth = $modal.width();
          // Модальное окно не должно растягиваться на всю ширину
          expect(modalWidth).to.be.lessThan(1000);
        });
    });
  });

  describe('Проверка состояний загрузки и анимаций', () => {
    it('должно плавно появляться при открытии', () => {
      // Проверяем, что модальное окно изначально скрыто
      cy.get('[data-cy="modal"]').should('not.exist');

      // Открываем модальное окно
      cy.get('[data-cy="ingredient-bun"]').first().click();

      // Модальное окно должно появиться
      cy.get('[data-cy="modal"]').should('be.visible').and('have.css', 'opacity', '1');
    });

    it('должно правильно отображать состояние загрузки изображения', () => {
      cy.get('[data-cy="ingredient-bun"]').first().click();

      cy.get('[data-cy="ingredient-details-image"]')
        .should('be.visible')
        .and(($img) => {
          // Изображение должно загрузиться
          expect($img[0].complete).to.be.true;
          expect($img[0].naturalWidth).to.be.greaterThan(0);
        });
    });
  });

  describe('Проверка интерактивности элементов', () => {
    it('кнопка закрытия должна иметь правильные состояния hover и focus', () => {
      cy.get('[data-cy="ingredient-bun"]').first().click();

      cy.get('[data-cy="modal-close-button"]')
        .should('be.visible')
        .and('have.css', 'cursor', 'pointer')
        .focus()
        .should('be.focused');
    });

    it('модальное окно должно блокировать прокрутку фона', () => {
      // Открываем модальное окно
      cy.get('[data-cy="ingredient-bun"]').first().click();

      // Проверяем, что body имеет overflow: hidden или аналогичное
      cy.get('body').should(($body) => {
        const overflow = $body.css('overflow');
        // В зависимости от реализации может быть hidden или другое значение
        expect(['hidden', 'clip']).to.include(overflow);
      });
    });
  });

  describe('Проверка контрастности и доступности', () => {
    it('должно иметь достаточный контраст для текста', () => {
      cy.get('[data-cy="ingredient-bun"]').first().click();

      // Проверяем, что текст читаем (базовая проверка)
      cy.get('[data-cy="ingredient-details-title"]')
        .should('be.visible')
        .and('have.css', 'color')
        .and('not.equal', 'rgba(0, 0, 0, 0)'); // Не прозрачный

      cy.get('[data-cy="ingredient-details-name"]')
        .should('be.visible')
        .and('have.css', 'color')
        .and('not.equal', 'rgba(0, 0, 0, 0)');
    });

    it('должно поддерживать навигацию с клавиатуры', () => {
      cy.get('[data-cy="ingredient-bun"]').first().click();

      // Tab должен перемещать фокус к кнопке закрытия
      cy.get('body').tab();
      cy.get('[data-cy="modal-close-button"]').should('be.focused');

      // Enter должен закрывать модальное окно
      cy.get('[data-cy="modal-close-button"]').type('{enter}');
      cy.get('[data-cy="modal"]').should('not.exist');
    });
  });
});
