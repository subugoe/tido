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


  it('Should create a new panel using global tree', () => {
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
      .eq(1).click()                              // click the item 280

      // Item is active
      .find('[data-cy="tree-node"]').find('div').first()
      .should('have.class','active')
      .click()

      // a popover is shown with two buttons (Panel 1, New Panel)
    cy.get('[data-cy="global-tree-modal"]')
      .get('[data-cy="buttons-update-panel"]')
      .children().should('have.length', 1)
      .eq(0).should('have.text', 'Panel 1')
    cy.get('[data-cy="global-tree-modal"]')
      .find('[data-cy="button-new-panel"]')
      .should('have.text', 'New Panel')         // click New Panel
      .click()

      // a select view dialog should open:
         // contains the select modes and the 'text' mode as initially selected
      .get('#panels-wrapper')
      .children().eq(1)
      .find('div[role="dialog"]')
      .find('[data-cy="modes-container"] [data-cy="modes"]')
      .children().should('have.length', 3)
      .eq(0).find('button').should('have.attr', 'data-cy', 'split')
        .should('not.have.class', 'active')
      .parents('[data-cy="modes"]').children()
      .eq(1).find('button').should('have.attr', 'data-cy', 'text')
        .should('have.class', 'active')             // 'text' mode should be selected
      .parents('[data-cy="modes"]').children()
      .eq(2).find('button').should('have.attr', 'data-cy', 'image')

      .parents('div[role="dialog"]')
      .find('button[id="do-not-ask-again"]').click()
      .parents('div[role="dialog"]')


      .find('button[data-cy="confirm"]')
      .click()

    cy.get('[data-cy="panels-wrapper"]')  // check whether the item - 280 -  is opened in second panel
      .find('[data-cy="panel"]')
      .should('have.length', 2)
      .eq(1)
      .find('[data-cy="item-label"]')
      .should('have.text', 'Page 280')
    cy.get('[data-cy="global-tree-modal"]').should('not.exist')
  })

  /*

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
