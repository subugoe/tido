describe('Tido', () => {
  it('Should render', () => {
    cy.visit('/').then(() => {
      cy.get('.root.panels-target').should('be.visible');
      cy.get('.q-toolbar h1').should('not.be.empty');
      cy.get('.q-toolbar h2').should('not.be.empty');
      cy.get('.q-toolbar button[title="Change language"]').should('be.visible');
      cy.get('.q-toolbar button[title="Project Info"]').should('be.visible');
      cy.get('.q-toolbar .panel-toggle button').should(
        'be.visible'
      );

      cy.get('.q-toolbar button.previous-item').should(
        'be.disabled'
      );
      cy.get('.q-toolbar button.next-item').should('be.enabled');
      cy.url().then((url) => {
        cy.get('.q-tree__node--selected')
          .get(`div[id="${url.split('?itemurl=')[1]}"]`)
          .should('be.visible');
      });
    });
  });

  it('Should be able to toggle content and metadata', () => {
    cy.visit('/').then(() => {
      cy.get('.item-content .tabs-container .q-tab').first()
        .should('have.class', 'q-tab--active');
      cy.get('.item-content').first().get('.item-content.q-tree')
        .should('be.visible');

      // Clicking on second tab
      cy.get('.item-content').first().get('.tabs-container .q-tab--inactive').click();
      cy.get('.item-content').first().get('.tabs-container').first()
        .get('.q-tab').should('have.class', 'q-tab--inactive');
      cy.get('.item-content').first().get('.panel__meta').should('be.visible');
    });
  });

  it('Should be able to switch languages', () => {
    cy.visit('/').then(() => {
      cy.get('button[title="Change language"]').click();
      cy.get('.q-menu').should('be.visible');
      cy.get('.q-menu .q-item').first().click();
      cy.get('button[title="Sprache ändern"]').should('be.visible');

      cy.get('button[title="Sprache ändern"]').click();
      cy.get('.q-menu .q-item').last().click();
      cy.get('button[title="Change language"]').should('be.visible');
    });
  });

  it('Should toggle panels', () => {
    cy.visit('/').then(() => {
      cy.get('.root.panels-target').children('.item').should('have.length', 4);
      cy.get('.panel-toggle button').click();

      cy.get('.q-menu').should('be.visible');

      // Clicking on first item
      cy.get('.q-menu .q-list').first().click();
      cy.get('.root.panels-target').children('.item').first()
        .should('have.attr', 'style', 'display: none;');

      // Reseting item
      cy.get('.q-menu .q-list').last().click();
      cy.get('.root.panels-target').children('.item').first()
        .should('not.have.attr', 'style', 'display: none;');
    });
  });

  it('Should open Info dialog box', () => {
    cy.visit('/').then(()=> {
      cy.get('button[title="Project Info"]').click();
      cy.get('.q-dialog').should('be.visible');
    });
  });

  it('Should highlight all annotations', () => {
    cy.visit('/').then(()=> {
      cy.get('.root.panels-target .item').last()
        .get('.item-content .q-list .q-item').should('have.length.at.least', 1);
      cy.get('.fab-container .q-fab').click();

      cy.get('.q-fab .q-fab__actions .q-btn').first().click();

      cy.get('.root.panels-target .item').last()
        .get('.item-content .q-list .q-item').should('have.class', 'bg-grey-4');
    });
  });
});
