describe('Tree', () => {
  beforeEach(() => {
    cy.visit('/4w-local.html')
  });

  it('Should display collection node', () => {
    cy.get('[data-cy="global-tree-toggle"]').click()
    cy.get('[data-cy="tree-node"]').should('be.visible')
      .find('span')
      .should("have.text", "Vier Wachen vernetzt: Digitale Edition eines mystischen Traktats des Spätmittelalters");
  })

  it('Should render manifests of collection', () => {
    cy.get('[data-cy="global-tree-toggle"]').click()
    cy.get('[data-cy="tree-node"]')
      .click()
    cy.get('[data-cy="tree-node-child"]')
      .children()
      .should('have.length', 8)
    cy.get('[data-cy="tree-node-child"]')
      .first()
      .should('have.text','Einsiedeln, 278 1040')
      .next()
      .should('have.text', 'Kloster Neuburg, Cod. 251')
  })

  it('Should show the right number of items', () => {
    cy.get('[data-cy="global-tree-toggle"]').click()
    cy.get('[data-cy="tree-node"]')
      .click()
    cy.get('[data-cy="tree-node-child"]')
      .first()
      .click()
      .find('[data-cy="tree-node-child"]')
      .should('have.length', 3)
  })

  it('Should create a new panel using global tree', () => {
    cy.get('[data-cy="global-tree-toggle"]').click()
    cy.get('[data-cy="tree-node"]')
      .click()
    cy.get('[data-cy="tree-node-child"]')      // get manifests
      .first()                                          // click the first manifest
      .click()
      .find('[data-cy="tree-node-child"]')
      .eq(1)                                      // position and click in second item
      .click()
      .find('[data-cy="tree-node"]')
      .should('have.class', 't-bg-gray-200')   // UI effect of active item

    cy.get('[data-cy="global-tree-modal"]')
      .get('[data-cy="buttons-update-panel"]')
      .children().should('have.length', 1)
      .eq(0).should('have.text', 'Panel 1')
    cy.get('[data-cy="global-tree-modal"]')
      .find('[data-cy="button-new-panel"]')
      .should('have.text', 'New Panel')         // click New Panel
      .click()
    cy.get('[data-cy="panels-wrapper"]')  // check whether the item - 280 -  is opened in second panel
      .children().should('have.length', 2)
      .eq(1)
      .find('[data-cy="item-label"]')
      .should('have.text', 'Page unknown')     // Label is missing
    cy.get('[data-cy="global-tree-modal"]').should('not.exist')
  })

  it('Should update a panel using global tree', () => {
    cy.get('[data-cy="global-tree-toggle"]').click()
    cy.get('[data-cy="tree-node"]')
      .click()
    cy.get('[data-cy="tree-node-child"]')      // get manifests
      .first()                                          // click the first manifest
      .click()
      .find('[data-cy="tree-node-child"]')
      .eq(1)                                      // position and click in second item
      .click()

    cy.get('[data-cy="global-tree-modal"]')
      .get('[data-cy="buttons-update-panel"]')
      .children()
      .eq(0)
      .click()

    cy.get('[data-cy="panels-wrapper"]')  // check whether the item - 280 -  is opened in first panel
      .children().should('have.length', 1)
      .eq(0)
      .find('[data-cy="item-label"]')
      .should('have.text', 'Page unknown')      // Label is missing
    cy.get('[data-cy="global-tree-modal"]').should('not.exist')
  })
});
