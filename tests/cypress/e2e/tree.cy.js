describe('Tree', () => {
  beforeEach(() => {
    cy.visit('/4w-local.html')
  });

  it('Global tree: Should display one root collection node as expanded', () => {
    cy.get('[data-cy="global-tree-toggle"]').click()

    cy.get('[data-cy="tree"]').should('be.visible')
      // we have one root node with the title
      .children().eq(0)
      .children('[data-cy="tree-node"]')
      .should('have.length', 1)
      .children().eq(0)
      .contains('Vier Wachen vernetzt: Digitale Edition eines mystischen Traktats des Spätmittelalters')

      // it has two children with corresponding collection titles
      .parent().parent()
      .find('[data-cy="node-children"]').first()
      .children()
      .should('have.length', 2)
      .children()
      .eq(0).find('span').should('have.text','Ebene 1: Reproduktion der Dokumente')
      .parents('[data-cy="node-children"]')
      .children()
      .should('have.length', 2)
      .children()
      .eq(1).find('span').should('have.text','Ebene 2: Kritische Edition der Fassungen')
  })

  // TODO: Having two root collections shows initially both two root nodes as not expanded

  it('Should render manifests of collection', () => {
    cy.get('[data-cy="global-tree-toggle"]').click()
    cy.get('.tree')
      .find('[data-cy="node-children"]').first()
      .children().eq(0)                   // locate first nested collection
      .click() // click first nested collection

      .find('[data-cy="node-children"]')
      .children()
      .should('have.length', 8)
      .eq(0)
      .find('span').should('have.text','Einsiedeln, 278 1040')
      .parents('[data-cy="node-children"]')
      .children()
      .eq(1)
      .find('span').should('have.text','Kloster Neuburg, Cod. 251')
  })

  it('Should show the right number of items', () => {
    cy.get('[data-cy="global-tree-toggle"]').click()
      .get('.tree')
      .find('[data-cy="node-children"]').first()
      .children().eq(0)                   // locate first nested collection
      .click() // click first nested collection

      .find('[data-cy="node-children"]')
      .children()
      .should('have.length', 8)
      .eq(0).click()
      .find('[data-cy="node-children"]')
      .children().should('have.length', 3)
      .eq(1).find('span').should('have.text','280')
  })

  /*
  it('Should create a new panel using global tree', () => {
    cy.get('[data-cy="global-tree-toggle"]').click()
    // TODO: testing for UI effect is not a good practice
    cy.get('[data-cy="tree-node-child"]')      // get manifests
      .first()                                          // click the first manifest
      .click()
      .find('[data-cy="tree-node-child"]')
      .eq(1)                                      // position and click in second item
      .click()
      .find('[data-cy="tree-node"]')
      .should('have.class', 'bg-muted')   // UI effect of active item

    cy.get('[data-cy="global-tree-modal"]')
      .get('[data-cy="buttons-update-panel"]')
      .children().should('have.length', 1)
      .eq(0).should('have.text', 'Panel 1')
    cy.get('[data-cy="global-tree-modal"]')
      .find('[data-cy="button-new-panel"]')
      .should('have.text', 'New Panel')         // click New Panel
      .click()
    cy.get('[data-cy="panels-wrapper"]')  // check whether the item - 280 -  is opened in second panel
      .find('[data-cy="panel"]')
      .should('have.length', 2)
      .eq(1)
      .find('[data-cy="item-label"]')
      .should('have.text', 'Page 280')
    cy.get('[data-cy="global-tree-modal"]').should('not.exist')
  })

  it('Should update a panel using global tree', () => {
    cy.get('[data-cy="global-tree-toggle"]').click()
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
      .find('[data-cy="panel"]')
      .should('have.length', 1)
      .eq(0)
      .find('[data-cy="item-label"]')
      .should('have.text', 'Page 280')
    cy.get('[data-cy="global-tree-modal"]').should('not.exist')
  })

   */
});
