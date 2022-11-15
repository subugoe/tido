import { apiBaseUrl } from '../support/globals';

describe('Tido', () => {
  beforeEach(() => {
    cy
      .visit('/ahiqar-arabic-karshuni-local.html')
      .get('.root.panels-target > .item:nth-child(3)').find('.panel-body')
      .find('#text-content')
      .should('be.visible');
  });

  it('Should render titles', () => {
    cy.get('.q-header h1').contains('Textual witnesses in Arabic and Karshuni');
    cy.get('.q-header h2').contains('Cod. Arab. 236 Copenhagen');
    cy.get('.q-header h2').contains('Sheet 2a');
  });

  it('Should render panels', () => {
    cy
      .get('.root.panels-target')
      .should('be.visible')
      .children('.item')
      .should('have.length', 4);

    // Panel 1
    cy
      .get('.root.panels-target > .item:nth-child(1)')
      .find('.panel-header')
      .contains('Contents & Metadata');

    cy
      .get('.root.panels-target > .item:nth-child(1)').find('.panel-body').find('.q-tabs .q-tab')
      .should('have.length', 2)
      .eq(0)
      .should('have.class', 'q-tab--active');

    // Panel 2
    cy
      .get('.root.panels-target > .item:nth-child(2)')
      .find('.panel-header')
      .contains('Image');

    cy
      .get('.root.panels-target > .item:nth-child(2)').find('.panel-body').find('#openseadragon')
      .should('be.visible');

    // Panel 3
    cy
      .get('.root.panels-target > .item:nth-child(3)')
      .find('.panel-header')
      .contains('Transcription');

    cy
      .get('.root.panels-target > .item:nth-child(3)').find('.panel-body').find('#text-content')
      .should('be.visible');

    // Panel 4
    cy
      .get('.root.panels-target > .item:nth-child(4)')
      .find('.panel-header')
      .contains('Annotations');

    cy
      .get('.root.panels-target > .item:nth-child(4)').find('.panel-body').find('.q-tabs .q-tab')
      .should('have.length', 2)
      .eq(0)
      .should('have.class', 'q-tab--active');

    // cy.get('.q-toolbar button.previous-item').should('be.disabled');
    // cy.get('.q-toolbar button.next-item').should('be.enabled');
    // cy.url().then((url) => {
    //   cy.get('.q-tree__node--selected')
    //     .get(`div[id="${url.split('?itemurl=')[1]}"]`)
    //     .should('be.visible');
    // });
  });

  it('Should render nav buttons', () => {
    cy
      .get('button.previous-item')
      .should('be.visible')
      .should('be.disabled')
      .contains('Previous Manuscript');

    cy.get('button.next-item').should('be.visible').contains('Next Sheet');
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
  //   cy.get('.root.panels-target .item').last()
  //     .get('.item-content .q-list .q-item').should('have.length.at.least', 1);
  //   cy.get('.fab-container .q-fab').click();
  //
  //   cy.get('.q-fab .q-fab__actions .q-btn').first().click();
  //
  //   cy.get('.root.panels-target .item').last()
  //     .get('.item-content .q-list .q-item').should('have.class', 'active');
  // });
  //
  // it('Should remove all highlights', () => {
  //   cy.get('.root.panels-target .item').last().get('.item-content .q-list .q-item')
  //     .should('have.length.at.least', 1);
  //
  //   // Click on Highlight all
  //   cy.get('.fab-container .q-fab').click();
  //   cy.get('.q-fab .q-fab__actions .q-btn').first().click();
  //
  //   // Click on remove all highlight
  //   cy.get('.fab-container .q-fab').click();
  //   cy.get('.q-fab .q-fab__actions .q-btn').last().click();
  //   cy.get('.root.panels-target .item').last().get('.item-content .q-list .q-item')
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
