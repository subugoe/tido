import { ahiqarApiBaseUrl } from '../support/globals';

describe('Content - Multiple Tabs', () => {
  beforeEach(() => {
    //cy.visit(`/ahiqar-arabic-karshuni-local.html?item=${ahiqarApiBaseUrl}/textapi/ahiqar/arabic-karshuni/3r176/182b/latest/item.json`)
  cy.visit(`http://localhost:2222/ahiqar-arabic-karshuni-local.html?tido=m20_i0`)
    .get('#text-content', {timeout: 10000})
      .as('content')
      .should('be.visible');
  });
  it('Should display first content tab', () => {
    cy
      .get('.panels-target > .item:nth-child(3) .q-tabs__content .q-tab')
      .first()
      .should('have.class', 'q-tab--active');

    cy.get('#text-content').contains('ܚܝܩܪ');
  });
  it('Should switch to second tab', () => {
    cy
      .get('.panels-target > .item:nth-child(3) .q-tabs__content .q-tab')
      .eq(1)
      .click()
      .should('have.class', 'q-tab--active');

    cy
      .get('#text-content')
      .contains('وايضا');
  });

  it('Should highlight from text', () => {
    // Test content
    cy
      .get('@content')
      .contains('ܚܝܩܪ')
      .parent()
      .should('have.attr', 'data-annotation-level', '0')
      .click()
      .should('have.attr', 'data-annotation-level', '1')
      .and('have.css', 'background-color', 'rgb(227, 242, 253)')
      .get('svg')
      .should('be.visible');

    // Test annotation
    cy
      .get('.panels-target > .item:nth-child(4) .item-content .q-item')
      .first()
      .should('have.class', 'active');
  });

  it('Should highlight from annotation', () => {
    // Test annotation
    cy
      .get('.panels-target > .item:nth-child(4) .item-content .q-item')
      .first()
      .click()
      .should('have.class', 'active');

    // Test content
    cy
      .get('@content')
      .contains('ܚܝܩܪ')
      .parent()
      .should('have.attr', 'data-annotation-level', '1')
      .and('have.css', 'background-color', 'rgb(227, 242, 253)')
      .get('svg')
      .should('be.visible');
  });

  it('Should stay on first tab when switch item', () => {
    cy.get('button.next-item').click();

    // Test content
    cy
      .get('#text-content')
      .contains('ܚܝܩܪ');

    cy
      .get('.panels-target > .item:nth-child(3) .q-tabs__content .q-tab')
      .first()
      .should('have.class', 'q-tab--active');
  });

  it('Should stay on second tab when switch item', () => {
    cy
      .get('.panels-target > .item:nth-child(3) .q-tabs__content .q-tab')
      .eq(1)
      .click();

    cy
      .get('#text-content')
      .contains('وايضا');

    cy.get('button.next-item').click();

    cy
      .get('.panels-target > .item:nth-child(3) .q-tabs__content .q-tab')
      .eq(1)
      .should('have.class', 'q-tab--active');

    cy.get('#text-content').contains('فتركهم');
  });

  it('Should increase and decrease font size', () => {
    cy.get('#text-content div', { timeout: 10000 })
      .first()
      .should('have.attr', 'style', 'font-size: 16px;');

    // Increasing font size
    cy.get('.panels-target > .item:nth-child(3) .actions>div:first-child button[title="Increase"]').click();
    cy.get('#text-content>div')
      .first()
      .should('have.attr', 'style', 'font-size: 18px;');

    // Decreasing font size
    cy.get('.panels-target > .item:nth-child(3) .actions>div:first-child button[title="Decrease"]').click();
    cy.get('#text-content div')
      .first()
      .should('have.attr', 'style', 'font-size: 16px;');
  });

  it('Should not increase font more than 28', () => {
    // Increasing font size
    cy.get('.panels-target > .item:nth-child(3) .actions>div:first-child button[title="Increase"]')
      .click() // 18px
      .click() // 20px
      .click() // 22px
      .click() // 24px
      .click() // 26px
      .click() // 28px
      .should('be.disabled');

    cy.get('#text-content div')
      .first()
      .should('have.attr', 'style', 'font-size: 28px;');
  });

  it('Should not decrease font less than 14', () => {
    // Increasing font size
    cy.get('.panels-target > .item:nth-child(3) .actions>div:first-child button[title="Decrease"]')
      .click() // 14px
      .should('be.disabled');

    cy.get('@content')
      .contains('ܐܠܚܟܝܡ')
      .get('#text-content div')
      .first()
      .should('have.attr', 'style', 'font-size: 14px;');
  });

  // it('Should display a tooltip on hover', () => {
  //   cy
  //     .get('@content')
  //     .contains('ܚܝܩܪ')
  //     .parent()
  //     .should('have.attr', 'data-annotation-level', '0')
  //     .trigger('mouseenter');
  //
  //   cy
  //     .get('#annotation-tooltip')
  //     .wait(100)
  //     .should('be.visible')
  // })
});

describe('Content - Multiple Tabs with different manifest', () => {
  it('Should switch to first tab when switch manifest', () => {
    //cy.visit(`/ahiqar-arabic-karshuni-local.html?item=${ahiqarApiBaseUrl}/textapi/ahiqar/arabic-karshuni/3r17b/82a/latest/item.json`)
   cy.visit(`http://localhost:2222/ahiqar-arabic-karshuni-local.html?tido=m21_i0_p0.0-1.0-2.0-3.0`)
    .get('.panels-target > .item:nth-child(3) .q-tabs__content .q-tab')
      .eq(1)
      .click();

    cy
      .get('button.previous-item')
      .click()
      .wait(1000)
      .get('.panels-target > .item:nth-child(3) .q-tabs__content .q-tab')
      .eq(0)
      .should('have.class', 'q-tab--active');

    cy
      .get('#text-content')
      .contains('ܘܚܩܕ');
  });
});
