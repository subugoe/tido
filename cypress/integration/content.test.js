describe('Content - Multiple Tabs', () => {
  beforeEach(() => {
    cy.visit('/#/?itemurl=https://ahikar-dev.sub.uni-goettingen.de/api/textapi/ahikar/arabic-karshuni/3r176-182b/latest/item.json')
  });
  it('Should display first content tab', () => {
    cy
      .get('.root.panels-target > .item:nth-child(3) .q-tabs__content .q-tab')
      .first()
      .should('have.class', 'q-tab--active');

    cy.get('#text-content').contains('ܚܝܩܪ');
  });
  it('Should switch to second tab', () => {
    cy
      .get('.root.panels-target > .item:nth-child(3) .q-tabs__content .q-tab')
      .eq(1)
      .click()
      .should('have.class', 'q-tab--active');

    cy.get('#text-content').contains('وايضا');
  });
  it('Should highlight from text', () => {
    // Test content
    cy
      .get('.root.panels-target > .item:nth-child(3) #text-content')
      .contains('ܚܝܩܪ')
      .click()
      .should('have.attr', 'data-annotation-level', '1')
      .and('have.css', 'background-color', 'rgb(227, 242, 253)')
      .get('svg')
      .should('be.visible');

    // Test annotation
    cy
      .get('.root.panels-target > .item:nth-child(4) .item-content .q-item')
      .first()
      .should('have.class', 'active');
  });

  it('Should highlight from annotation', () => {
    // Test annotation
    cy
      .get('.root.panels-target > .item:nth-child(4) .item-content .q-item')
      .first()
      .click()
      .should('have.class', 'active');

    // Test content
    cy
      .get('.root.panels-target > .item:nth-child(3) #text-content')
      .contains('ܚܝܩܪ')
      .should('have.attr', 'data-annotation-level', '1')
      .and('have.css', 'background-color', 'rgb(227, 242, 253)')
      .get('svg')
      .should('be.visible');
  });

  it('Should stay on first tab when switch item', () => {
    cy.get('button.next-item').click();

    // Test content
    cy
      .get('.root.panels-target > .item:nth-child(3)')
      .get('#text-content')
      .contains('ܚܝܩܪ');

    cy
      .get('.root.panels-target > .item:nth-child(3)')
      .get('.q-tabs__content .q-tab')
      .first()
      .should('have.class', 'q-tab--active');
  });

  it('Should stay on second tab when switch item', () => {
    cy
      .get('.root.panels-target > .item:nth-child(3) .q-tabs__content .q-tab')
      .eq(1)
      .click();

    cy.get('#text-content').contains('وايضا');

    cy.get('button.next-item').click();

    cy
      .get('.root.panels-target > .item:nth-child(3) .q-tabs__content .q-tab')
      .eq(1)
      .should('have.class', 'q-tab--active');

    cy.get('#text-content').contains('فتركهم');
  });
});

describe('Content - Multiple Tabs with different manifest', () => {
  it('Should switch to first tab when switch manifest', () => {
    cy.visit('/#/?itemurl=https://ahikar-dev.sub.uni-goettingen.de/api/textapi/ahikar/arabic-karshuni/3r17b-82a/latest/item.json')

    cy
      .get('.root.panels-target > .item:nth-child(3) .q-tabs__content .q-tab')
      .eq(1)
      .click();

    cy.get('#text-content').contains('اسمه');

    cy.get('button.previous-item').click();

    cy
      .get('.root.panels-target > .item:nth-child(3) .q-tabs__content .q-tab')
      .eq(0)
      .should('have.class', 'q-tab--active');

    cy.get('#text-content').contains('ܘܚܩܕ');
  });
})

