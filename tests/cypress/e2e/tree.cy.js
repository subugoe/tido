function clickNewPanelInGlobalTree() {
  cy.get('[data-cy="global-tree-modal"]')
    .find('[data-cy="button-new-panel"]')
    .should('have.text', 'New Panel')         // click New Panel
    .click()
}

function openItemFromTree(collectionIdx, manifestIdx, itemIdx) {
  cy.get('[data-cy="tree"]')
    .find('[data-cy="node-children"]')
    .find('[data-cy="tree-node"]')
    .eq(collectionIdx)
    .as('collection')
  
  cy.get('@collection')
    .click()

  cy.get('@collection')
    .children('[data-cy="node-children"]')
    .find('[data-cy="tree-node"]')
    .eq(manifestIdx)
    .as('manifest')
  
  cy.get('@manifest')
    .click()

  cy.get('@manifest')
    .children('[data-cy="node-children"]')
    .find('[data-cy="tree-node"]')
    .eq(itemIdx)
    .as('item')

  cy.get('@item')
    .click()
  
  return cy.get('@item')
}


describe('Tree', () => {
  beforeEach(() => {
    cy.visit('/4w-local.html')
  });

  /*it('Should render manifests of collection', () => {
    cy.get('[data-cy="global-tree-toggle"]').click()
    cy.get('[data-cy="tree"]')
      .find('[data-cy="node-children"]').first()
      .children().eq(0)                   // locate first nested collection
      .click() // click first nested collection

      .find('[data-cy="node-children"]')
      .children()
      .should('have.length', 8)
      .eq(0)
      .find('span').should('have.text','Einsiedeln, 278 1040') //TODO: use better selector: data-cy="node-label"
      .parents('[data-cy="node-children"]')
      .children()
      .eq(1)
      .find('span').should('have.text','Kloster Neuburg, Cod. 251')
  })

  it('Should show the right number of items', () => {
    cy.get('[data-cy="global-tree-toggle"]').click()
      .get('[data-cy="tree"]')
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
  })*/

  it('Should create a new panel using global tree', () => {
    cy.get('[data-cy="global-tree-toggle"]').click()
    // click the item 280                       
    openItemFromTree(0, 0, 1)
      // Item is active
      .find('div').first()
      .should('have.class','active')

    // a popover is shown with two buttons (Panel 1, New Panel)
    cy.get('[data-cy="global-tree-modal"]')
      .get('[data-cy="buttons-update-panel"]')
      .children().should('have.length', 1)
      .eq(0).should('have.text', 'Panel 1')

    clickNewPanelInGlobalTree()

    cy.get('[data-cy="panels-wrapper"]')  // check whether the item - 280 -  is opened in second panel
      .find('[data-cy="panel"]')
      .should('have.length', 2)      // now we have 2 panels
      .eq(1)
      .find('[data-cy="item-label"]')
      .should('have.text', '280')     // Panel was added after the first one
      // switch to text mode
      .parents('.panel') //TODO: better selector?
      .find('[data-cy="panel-mode-select"]')
      .scrollIntoView()
      .click()
      .get('[data-cy="panel-mode-menu"]')
      .find('[data-slot="select-item"]')
      .eq(1).click()                   // switch to text mode to check the text content
      .get('[data-cy="panels-wrapper"]')
      .find('[data-cy="panel"]')
      .eq(1)
      .find('.text-area').first()
      .contains('fol. 280a')

    cy.get('[data-cy="global-tree-modal"]').should('not.exist')

      // Second opening of a new panel from Global tree

      .get('[data-cy="tree"]')
      .find('[data-cy="node-children"]')
      .children().eq(0)                   // locate first nested collection
      .find('[data-cy="node-children"]').first()
      .children().eq(0)
      .find('[data-cy="node-children"]')
      .children()
      .eq(2).click()

    clickNewPanelInGlobalTree()
    // check 1) select mode dialog is not shown again  2) the new panel is automatically in 'image' mode 3) Select mode toggle in settings is 'off'
    // 1) select mode dialog is not shown again
    // 2) the new panel is automatically opened in 'text' selected mode
    cy.get('[data-cy="panels-wrapper"]')
      .find('.panel')
      .should('have.length', 3)     // we have 3 panels

      // select another item from tree
      .get('[data-cy="tree"]')
      .find('[data-cy="node-children"]')
      .children().eq(0)                   // locate first nested collection
      .find('[data-cy="node-children"]').first()
      .children().eq(1).click()
      .find('[data-cy="node-children"]')
      .children()
      .eq(1).click()

      // in the global tree modal: we should have 4 buttons (3 buttons to update the first 3 panels and 'New Panel')
      .get('[data-cy="global-tree-modal"]')
      .find('[data-cy="buttons-update-panel"]')
      .children()
      .last().should('have.text', 'Panel 3')
  })

  it('Should update a panel using global tree', () => {
    cy.get('[data-cy="global-tree-toggle"]').click()
      .get('[data-cy="tree"]')
      .find('[data-cy="node-children"]').first()
      .children().eq(0)                   // locate first nested collection
      .click() // click first nested collection

      .find('[data-cy="node-children"]')
      .children()
      .should('have.length', 8)
      .eq(0).click()
      .find('[data-cy="node-children"]')
      .children()
      .eq(1).click()

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
      .should('have.text', '280')
      .parents('.panel')
      .find('[data-cy="panel-mode-select"]')
      .click()
      .get('[data-cy="panel-mode-menu"]')
      .find('[data-slot="select-item"]')
      .eq(1).click()                   // switch to text view
      .get('[data-cy="panels-wrapper"]')  // check whether the item - 280 -  is opened in first panel
      .find('[data-cy="panel"]')
      .eq(0)
      .find('.text-area').first()
      .contains('fol. 280a')
    cy.get('[data-cy="global-tree-modal"]').should('not.exist')
  })
})
