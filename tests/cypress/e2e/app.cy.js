import { commonSelectors } from '../support/globals';

const selectors = {
  ...commonSelectors,
  tab: '[role="tablist"] [data-pc-section="nav"] [data-pc-name="tabpanel"]'
}

describe('Tido', () => {
  beforeEach(() => {
    cy
      .visit('/ahiqar-arabic-karshuni-local.html')
      .get(selectors.panel3)
      .find('.panel-body')
      .find('#text-content')
      .should('be.visible');
  });

  it('Should render titles', () => {
    cy.get('.header h1').contains('Textual witnesses in Arabic and Karshuni');
    cy.get('.header h2').contains('Cod. Arab. 236 Copenhagen');
    cy.get('.header h2').contains('Item 2a');
  });

  it('Should render panels', () => {
    cy
      .get(selectors.panelsWrapper)
      .should('be.visible')
      .children('.panel')
      .should('have.length', 4);

    // Panel 1
    cy
      .get(selectors.panel1)
      .find('.panel-header')
      .contains('Contents & Metadata');

    cy
      .get(selectors.panel1)
      .find('.panel-body')
      .find(selectors.tab)
      .should('have.length', 2)
      .eq(0)
      .should('have.attr', 'data-p-active', 'true');

    // Panel 2
    cy
      .get(selectors.panel2)
      .find('.panel-header')
      .contains('Image');

    cy
      .get(selectors.panel2)
      .find('.panel-body')
      .find('#openseadragon')
      .should('be.visible');

    // Panel 3
    cy
      .get(selectors.panel3)
      .find('.panel-header')
      .contains('Transcription');

    cy
      .get(selectors.panel3)
      .find('.panel-body')
      .find('#text-content')
      .should('be.visible');

    // Panel 4
    cy
      .get(selectors.panel4)
      .find('.panel-header')
      .contains('Annotations');

    cy
      .get(selectors.panel4)
      .find('.panel-body')
      .find(selectors.tab)
      .should('have.length', 2)
      .eq(0)
      .should('have.attr', 'data-p-active', 'true');
  });

  it('Should render nav buttons', () => {
    cy
      .get(selectors.prevButton)
      .should('be.visible')
      .should('be.disabled')
      .contains('Previous Manifest');

    cy
      .get(selectors.nextButton)
      .should('be.visible')
      .contains('Next Item');
  });

  //
  //
  // it('Should able to select previous sheet', () => {
  //   cy.url().then((initialUrl) => {
  //     cy.get('button.next-item').click();
  //     cy.url().should('not.equal', initialUrl);
  //     cy.wait(2000);
  //     cy.get('button.previous-item').click();
  //     cy.url().should('equal', initialUrl);
  //   });
  // });
  //
  //
  // it('Should highlight all annotations', () => {
  //   cy.get('.panels-target .item').last()
  //     .get('.item-content .q-list .q-item').should('have.length.at.least', 1);
  //   cy.get('.fab-container .q-fab').click();
  //
  //   cy.get('.q-fab .q-fab__actions .q-btn').first().click();
  //
  //   cy.get('.panels-target .item').last()
  //     .get('.item-content .q-list .q-item').should('have.class', 'active');
  // });
  //
  // it('Should remove all highlights', () => {
  //   cy.get('.panels-target .item').last().get('.item-content .q-list .q-item')
  //     .should('have.length.at.least', 1);
  //
  //   // Click on Highlight all
  //   cy.get('.fab-container .q-fab').click();
  //   cy.get('.q-fab .q-fab__actions .q-btn').first().click();
  //
  //   // Click on remove all highlight
  //   cy.get('.fab-container .q-fab').click();
  //   cy.get('.q-fab .q-fab__actions .q-btn').last().click();
  //   cy.get('.panels-target .item').last().get('.item-content .q-list .q-item')
  //     .should('not.have.class', 'active');
  // });
  //
  // it('Should change the url upon clicking on next button', () => {
  //   cy.url().then((initialUrl) => {
  //     cy.get('button.next-item').click();
  //     cy.url().should('not.equal', initialUrl);
  //   });
  // });
  //
  // it('Should change the url upon clicking on tab', () => {
  //   cy.url().then((initialUrl) => {
  //     cy.get('.q-tree__node--selected').parent().siblings().next()
  //       .first()
  //       .click();
  //     cy.url().should('not.equal', initialUrl);
  //   });
  // });
});
