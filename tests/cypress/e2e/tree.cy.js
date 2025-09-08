Cypress.Commands.add('clickNewPanelInGlobalTree', () => {
  cy.get('[data-cy="global-tree-modal"]')
    .find('[data-cy="button-new-panel"]')
    .should('have.text', 'New Panel')         // click New Panel
    .click()
})


Cypress.Commands.add('existSelectModeDialog', (exists) => {
  cy.get('#panels-wrapper')
    .find('div[role="dialog"]').should(exists ? 'exist' : 'not.exist')
})

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

      // a select mode dialog should open:
      // contains the select modes and the 'text' mode as initially selected
      .get('#panels-wrapper')
      .children().eq(1)
      .find('div[role="dialog"]')
      .find('[data-cy="modes-container"] [data-cy="modes"]')
      .should('exist')
      .children().should('have.length', 3)
      .eq(0).find('button').should('have.attr', 'data-cy', 'split')
      .should('not.have.class', 'active')
      .parents('[data-cy="modes"]').children()
      .eq(1).find('button').should('have.attr', 'data-cy', 'text')
      .should('have.class', 'active')
      .parents('[data-cy="modes"]').children()
      .eq(2).find('button').should('have.attr', 'data-cy', 'image')
      .should('not.have.class', 'active')             // 'text' mode should be select
      .click()                         // switch to 'text' mode

      .parents('div[role="dialog"]')
      .find('button[id="do-not-ask-again"]').click()
      .parents('div[role="dialog"]')

      .find('button[data-cy="confirm"]')
      .click()

    cy.get('[data-cy="panels-wrapper"]')  // check whether the item - 280 -  is opened in second panel
      .find('[data-cy="panel"]')
      .should('have.length', 2)      // now we have 2 panels
      .eq(1)
      .find('[data-cy="item-label"]')
      .should('have.text', 'Page 280')     // Panel was added after the first on e
      // switch to text mode
      .parents('.panel')
      .find('[data-cy="options-button"]')
      .click()
      .get('[data-cy="panel-mode-menu"]')
      .children()
      .eq(1).click()                   // switch to text mode to check the text content
      .get('[data-cy="panels-wrapper"]')
      .find('[data-cy="panel"]')
      .eq(1)
      .find('.text-area').first()
      .contains('fol. 280a')

    cy.get('[data-cy="global-tree-modal"]').should('not.exist')

      // Second opening of a new panel from Global tree
      // select mode dialog should not be shown, since we checked the option: Please do not show again

      .get('.tree')
      .find('[data-cy="node-children"]')
      .children().eq(0)                   // locate first nested collection
      .find('[data-cy="node-children"]').first()
      .children().eq(0)
      .find('[data-cy="node-children"]')
      .children()
      .eq(2).click()

    cy.clickNewPanelInGlobalTree()
    // check 1) select mode dialog is not shown again  2) the new panel is automatically in 'image' mode 3) Select mode toggle in settings is 'off'
    // 1) select mode dialog is not shown again
    cy.existSelectModeDialog(false)
    // 2) the new panel is automatically opened in 'text' selected mode
    cy.get('[data-cy="panels-wrapper"]')
      .find('.panel')
      .should('have.length', 3)     // we have 3 panels
      .eq(2)
      .find('[data-cy="options-button"]')
      .click()
      .get('[data-cy="panel-mode-menu"]')
      .find('[data-cy="image"]')
      .should('have.attr', 'data-selected', 'true')

    // 3) toggle in settings is off
    cy.get('[data-cy="header"]')
      .find('[data-cy="settings"]')
      .click({ force: true })
      .get('[data-radix-menu-content]')
      .find('[data-cy="select-panel-mode-toggle"]')
      .find('button')
      .should('have.attr','aria-checked','false')

      // Reset toggle to 'on' shows the select mode dialog after selecting an item i.e in global tree

      .click()
      .should('have.attr', 'aria-checked', 'true')
      .get('[data-cy="settings"]')
      .click({ force: true })

      // select another item from tree
      .get('.tree')
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

    // under the fourth panel, we see a dialog which has a modes-container with 3 modes
    cy.clickNewPanelInGlobalTree()
      .get('#panels-wrapper')
      .find('.panel')
      .eq(3)
      .find('div[role="dialog"]')
      .find('div[data-cy="modes"')
      .children().should('have.length', 3)
      .eq(0)
      .find('[data-cy="split"]')
  })

  it('Should update a panel using global tree', () => {
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
      .should('have.text', 'Page 280')
      .parents('.panel')
      .find('[data-cy="options-button"]')
      .click()
      .get('[data-cy="panel-mode-menu"]')
      .children()
      .eq(1).click()                   // switch to text view
      .get('[data-cy="panels-wrapper"]')  // check whether the item - 280 -  is opened in first panel
      .find('[data-cy="panel"]')
      .eq(0)
      .find('.text-area').first()
      .contains('fol. 280a')
    cy.get('[data-cy="global-tree-modal"]').should('not.exist')
  })


})
