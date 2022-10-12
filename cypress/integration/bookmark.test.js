describe('Bookmarking', () => {
  beforeEach(() => {
    cy.visit('/#/?item=https://ahiqar.uni-goettingen.de/api/textapi/ahikar/arabic-karshuni/3r176-182b/latest/item.json');
  });

  it('Should tree/metadata panel value in query', () => {
    cy.get('.root.panels-target > .item:nth-child(1) .q-tabs__content .q-tab')
      .eq(1).click();

    cy.url().should('include', 'panels=0_1,1_0,2_0,3_0');

    // Reset
    // cy.get('.root.panels-target > div:first-child > .item-content .tabs-container .q-tabs')
    //   .eq(0).click();
    // cy.url().should('not.include', 'connector');
  });

  it('Should change text panel value in query', () => {
    cy
      .get('.root.panels-target > .item:nth-child(3) .q-spinner')
      .should('be.visible')
      .get('#text-content')
      .should('be.visible')
      .contains('ܚܝܩܪ')
      .get('.root.panels-target > .item:nth-child(3) .q-tabs__content .q-tab')
      .eq(1)
      .click()
      .should('have.class', 'q-tab--active')
      .get('.root.panels-target > .item:nth-child(3) .q-panel:nth-child(2) .q-spinner')
      .should('be.visible')
      .get('#text-content')
      .should('be.visible')
      .url()
      .should('include', 'panels=0_0,1_0,2_1,3_0');

    // Reset
    // cy.get('.root.panels-target > div:last-child > .item-content .q-tabs .q-tab').eq(0).click();
    // cy.url().should('not.include', 'annotation');
  });

  it('Should change annotation panel value in query', () => {
    cy
      .get('.root.panels-target > .item:nth-child(3) .q-spinner')
      .should('be.visible')
      .get('#text-content')
      .should('be.visible')
      .contains('ܚܝܩܪ')
      .get('.root.panels-target > .item:nth-child(4) .q-tabs__content .q-tab')
      .eq(1)
      .click()
      .get('.root.panels-target > .item:nth-child(4) .q-panel:nth-child(2)')
      .should('be.visible')
      .url()
      .should('include', 'panels=0_0,1_0,2_0,3_1');

    // Reset
    // cy.get('.root.panels-target > div:last-child > .item-content .q-tabs .q-tab').eq(0).click();
    // cy.url().should('not.include', 'annotation');
  });
  //
  // it('Should change panel value in query', () => {
  //   cy.get('.panel-toggle .row div:first-child button').click();
  //
  //   cy.url().should('include', 'panels=1,2,3');
  //
  //   cy.get('.panel-toggle .row div:nth-child(4) button').click();
  //
  //   cy.url().should('include', 'panels=1,2');
  // });
  //
  // it('Should change panel value in query after reset', () => {
  //   cy.get('.panel-toggle .row div:first-child button').click();
  //
  //   cy.url().should('include', 'panels=1,2,3');
  //
  //   cy.get('.panel-toggle .row div:nth-child(4) button').click();
  //
  //   cy.url().should('include', 'panels=1,2');
  //
  //   // Reset
  //   cy.get('.panel-toggle .row div:first-child button').click();
  //   cy.get('.panel-toggle .row div:nth-child(4) button').click();
  //   cy.url().should('not.include', 'panels');
  // });
  //
  // it('should initiate with first tab active when manifest changed', () => {
  //   cy.get('.item-content .item')
  //     .last()
  //     .within(() => {
  //       cy.get('.q-tabs__content .q-tab')
  //         .last()
  //         .click()
  //         .should('have.class', 'q-tab--active');
  //     });
  //
  //   cy.get(
  //     '.q-tree--standard.item-content > .q-tree__node > .q-tree__node-collapsible > .q-tree__children > .q-tree__node:nth-child(1) > .q-tree__node-header',
  //   ).click();
  //
  //   cy.get(
  //     '.root.panels-target .q-tree--standard.item-content > .q-tree__node > .q-tree__node-collapsible > .q-tree__children > .q-tree__node:nth-child(2) > .q-tree__node-header',
  //   ).click();
  //
  //   cy.get(
  //     '.root.panels-target .q-tree--standard.item-content > .q-tree__node > .q-tree__node-collapsible > .q-tree__children > .q-tree__node:nth-child(2) > .q-tree__node-collapsible > .q-tree__children .q-tree__node:first-child .q-tree__node-header',
  //   ).click();
  //
  //   cy.url().should('not.include', 'annotation');
  //
  //   cy.get('.item-content .item')
  //     .last()
  //     .within(() => {
  //       cy.get('.q-tabs__content .q-tab')
  //         .first()
  //         .should('have.class', 'q-tab--active');
  //     });
  // });
});

describe('Bookmarking - URL first', () => {
  it('Should load tabs from URL', () => {
    cy
      .visit('http://localhost:8080/#/?item=https://ahiqar.uni-goettingen.de/api/textapi/ahikar/arabic-karshuni/3r176-182b/latest/item.json&panels=0_1,1_0,2_1,3_1')
      .then(() => {
        cy
          .get('.root.panels-target > .item:nth-child(3) .q-spinner')
          .should('be.visible')
          .get('#text-content')
          .should('be.visible')

          // Tree & Metadata panel
          .get('.root.panels-target > .item:nth-child(1) .q-tabs__content .q-tab')
          .eq(1)
          .should('have.class', 'q-tab--active')

          // Text panel
          .get('.root.panels-target > .item:nth-child(3) .q-tabs__content .q-tab')
          .eq(1)
          .should('have.class', 'q-tab--active')

          // Annotation panel
          .get('.root.panels-target > .item:nth-child(4) .q-tabs__content .q-tab')
          .eq(1)
          .should('have.class', 'q-tab--active');
      });
  });
});
