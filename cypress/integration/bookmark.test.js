describe('Bookmark', () => {
  beforeEach(() => {
    cy.visit('/').then(() => {
      cy.url().should('contain', '?itemurl=').should('include', '.json');
    });
  });

  it('Should change connector value in query', () => {
    cy.get('.root.panels-target > div:first-child > .item-content .tabs-container .q-tabs')
      .eq(1).click();

    cy.url().should('include', 'connector=0_1');

    // Reset
    cy.get('.root.panels-target > div:first-child > .item-content .tabs-container .q-tabs')
      .eq(0).click();
    cy.url().should('not.include', 'connector');
  });

  it('Should change annotation value in query', () => {
    cy.get('.root.panels-target > div:last-child > .item-content .q-tabs .q-tab').eq(1).click();

    cy.url().should('include', 'annotation=1');

    // Reset
    cy.get('.root.panels-target > div:last-child > .item-content .q-tabs .q-tab').eq(0).click();
    cy.url().should('not.include', 'annotation');
  });

  it('Should change panel value in query', () => {
    cy.get('.panel-toggle .row div:first-child button').click();

    cy.url().should('include', 'panels=1,2,3');

    cy.get('.panel-toggle .row div:nth-child(4) button').click();

    cy.url().should('include', 'panels=1,2');
  });

  it('Should change panel value in query after reset', () => {
    cy.get('.panel-toggle .row div:first-child button').click();

    cy.url().should('include', 'panels=1,2,3');

    cy.get('.panel-toggle .row div:nth-child(4) button').click();

    cy.url().should('include', 'panels=1,2');

    // Reset
    cy.get('.panel-toggle .row div:first-child button').click();
    cy.get('.panel-toggle .row div:nth-child(4) button').click();
    cy.url().should('not.include', 'panels');
  });

  it('should initiate with first tab active when manifest changed', () => {
    cy.get('.item-content .item')
      .last()
      .within(() => {
        cy.get('.q-tabs__content .q-tab')
          .last()
          .click()
          .should('have.class', 'q-tab--active');
      });

    cy.get(
      '.q-tree--standard.item-content > .q-tree__node > .q-tree__node-collapsible > .q-tree__children > .q-tree__node:nth-child(1) > .q-tree__node-header'
    ).click();

    cy.get(
        '.root.panels-target .q-tree--standard.item-content > .q-tree__node > .q-tree__node-collapsible > .q-tree__children > .q-tree__node:nth-child(2) > .q-tree__node-header'
      ).click();

    cy.get(
      '.root.panels-target .q-tree--standard.item-content > .q-tree__node > .q-tree__node-collapsible > .q-tree__children > .q-tree__node:nth-child(2) > .q-tree__node-collapsible > .q-tree__children .q-tree__node:first-child .q-tree__node-header'
    ).click();

    cy.url().should('not.include', 'annotation');

    cy.get('.item-content .item')
      .last()
      .within(() => {
        cy.get('.q-tabs__content .q-tab')
          .first()
          .should('have.class', 'q-tab--active');
      });
  });
});
