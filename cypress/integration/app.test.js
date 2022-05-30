describe('Tido', () => {
  it('Should render', () => {
    cy.visit('/').then(() => {
      cy.get('.root.panels-target').should('be.visible');
      cy.get('.q-toolbar h1').should('not.be.empty');
      cy.get('.q-toolbar h2').should('not.be.empty');
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

  it('Should able to select previous sheet', ()=> {
    cy.visit('/').then(()=> {
      cy.url().should('contain', '?itemurl');
      cy.url().then((initialUrl)=> {
        cy.get('button.next-item').click();
        cy.url().should('not.equal', initialUrl);
        cy.wait(2000);
        cy.get('button.previous-item').click();
        cy.url().should('equal', initialUrl);
      });
    });
  });

  it('Should increase and decrease font size', () => {
    cy.visit('/').then(() => {
      cy.get('#text-content div', { timeout: 10000 })
        .first()
        .should('have.attr', 'style', 'font-size: 16px;');

      // Increasing font size
      cy.get('button[title="Increase"]').click();
      cy.get('#text-content div')
        .first()
        .should('have.attr', 'style', 'font-size: 18px;');

      // Decreasing font size
      cy.get('button[title="Decrease"]').click();
      cy.get('#text-content div')
        .first()
        .should('have.attr', 'style', 'font-size: 16px;');
    });
  });

  it('Should not increase font more than 28', () => {
    cy.visit('/').then(() => {
      // Increasing font size
      cy.get('button[title="Increase"]').click(); // 18px
      cy.get('button[title="Increase"]').click(); // 20px
      cy.get('button[title="Increase"]').click(); // 22px
      cy.get('button[title="Increase"]').click(); // 24px
      cy.get('button[title="Increase"]').click(); // 26px
      cy.get('button[title="Increase"]').click(); // 28px
      cy.get('button[title="Increase"]').should('be.disabled');

      cy.get('#text-content div')
        .first()
        .should('have.attr', 'style', 'font-size: 28px;');
    });
  });

  it('Should not decrease font less than 14', () => {
    cy.visit('/').then(() => {
      // Increasing font size
      cy.get('button[title="Decrease"]').click(); // 14px
      cy.get('button[title="Decrease"]').should('be.disabled');

      cy.get('#text-content div')
        .first()
        .should('have.attr', 'style', 'font-size: 14px;');
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

  it('Should remove all highlights', ()=> {
    cy.visit('/').then(()=> {
      cy.get('.root.panels-target .item').last().get('.item-content .q-list .q-item')
      .should('have.length.at.least', 1);

      // Click on Highlight all
      cy.get('.fab-container .q-fab').click();
      cy.get('.q-fab .q-fab__actions .q-btn').first().click();

      // Click on remove all highlight
      cy.get('.fab-container .q-fab').click();
      cy.get('.q-fab .q-fab__actions .q-btn').last().click();
      cy.get('.root.panels-target .item').last().get('.item-content .q-list .q-item')
      .should('not.have.class', 'bg-grey-9');
    });
  });

  it('Should change the url upon clicking on next button', ()=> {
    cy.visit('/').then(()=> {
      cy.url().should('contain', '?itemurl');
      cy.url().then((initialUrl)=> {
        cy.get('button.next-item').click();
        cy.url().should('not.equal', initialUrl);
      });
    });
  });

  it('Should change the url upon clicking on tab', ()=> {
    cy.visit('/').then(()=> {
      cy.url().should('contain', '?itemurl');
      cy.url().then((initialUrl)=> {
        cy.get('.q-tree__node--selected').parent().siblings().next().first().click();
        cy.url().should('not.equal', initialUrl);
      });
    });
  });
});
