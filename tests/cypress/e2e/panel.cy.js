Cypress.Commands.add('findPanelTitleAndNavArrows', () => {
  cy.get('#panels-wrapper')
    .children()
    .eq(0)
    .find('[data-cy="panel-title-and-nav-arrows"]')
})

Cypress.Commands.add('validateLabel', (type, label) => {
  // type: 'manifest' or 'item'
  cy.get('#panels-wrapper')
    .children().eq(0)
    .find(`[data-cy=${type}-label]`)
    .contains(label)
})

Cypress.Commands.add('validateText', (textSelector, content) => {
  cy.get('#panels-wrapper')
    .children().eq(0)
    .find(textSelector)
    .contains(content)
})

describe('Panel', () => {
  beforeEach(() => {
    cy.visit('/4w-local.html')
  });

  it('Should navigate correctly in local tree', () => {
    // click collection title opens a tree with the expanded root collection and
    cy.get('[data-cy="panels-wrapper"]')
      .find('[data-cy="panel"]')
      .eq(0)
      .find('[data-cy="collection-title"]')
      .find('span')
      .contains('Ebene 1: Reproduktion der Dokumente')
      .click()
      .get('[data-cy="tree"]')
      .children().eq(1)
      .children('[data-cy="tree-node"]')
      .should('have.length', 1)           // initially we have one root node
      .children('[data-cy="node-children"]')
      .children()
      .should('have.length', 8)           // children exists -> the root node is expanded initially

      // click at manifest and item updates the content correctly
      .eq(2).click()
      .find('[data-cy="node-children"]')
      .first()
      .children().should('have.length', 7)    // number of items of manifest
      .eq(1).click()
      .get('[data-radix-popper-content-wrapper]')     // popover is closed
      .should('not.exist')
    cy.validateLabel('manifest', 'München BSB Cgm 627')
    cy.validateLabel('item', 'Page 243v')
    cy.validateText('.text-area', 'fol. 243va')
  })

  it('Should display the configured panelModes and the defaultPanelMode as selected', () => {
    cy.get('#panels-wrapper')
      .children().eq(0)
      .find('[data-cy="panel-modes-toggle"]')
      .first()
      .children()
      .should('have.length', 3)
      .eq(1)                    // order of panelModes is displayed as provided
      .should('have.attr', 'data-cy', 'text')
      .should('have.attr', 'data-selected', 'true')
      .parent()
      .children().eq(0)
      .should('have.attr', 'data-cy', 'split')
  })

  it('Should switch the panel mode and its corresponding panel body', () => {
    cy.get('#panels-wrapper')
      .find('[data-cy="panel-container"]')
      .find('[data-image-container]')
      .children().should('not.exist')   // data-image-container has no children in 'text' panelMode

      // select split mode
      .get('#panels-wrapper')
      .children().eq(0)
      .find('[data-cy="panel-modes-toggle"]')
      .children()
      .first()
      .click()
      .parent()
      .children()
      .eq(0)
      .should('have.attr', 'data-cy', 'split')
      .should('have.attr', 'data-selected', 'true')          //'split' mode is selected
      .parent()
      .children()
      .eq(1)
      .should('have.attr', 'data-selected', 'false')

      //below two blocks of code check whether the content is in split mode: the image container is not empty and there is text in scroll container

      .get('#panels-wrapper')
      .children().eq(0)
      .find('[data-cy="panel-container"]')
      .find('[data-image-container]')
      .children().should('not.have.length', 0)   // data-image-container now has children

    cy.validateText('.text-area', 'fol. 279a')
  })

  //  ------  Navigation  ---------

  it('Should switch to next item', () => {
    cy.findPanelTitleAndNavArrows()
      .find('[data-cy="next-button"]')
      .click()

    // item label and text is updated
    cy.validateLabel('item','Page 280')
    cy.validateText('.text-area', 'fol. 280a')
  })

  it('Should switch to next manifest', () => {
    cy.findPanelTitleAndNavArrows()
      .find('[data-cy="next-button"]')
      .click()
      .click()
      .click()  // should switch to the first item of Kloserneuburg manifest+

    // Manifest and item labels should get updated
    cy.validateLabel('manifest', 'Kloster Neuburg, Cod. 251')
    cy.validateLabel('item', '192r')
    cy.validateText('.text-area', 'fol. 192r')
    // Text area should update
  })

  it('Should switch to previous item', () => {
    cy.findPanelTitleAndNavArrows()
      .find('[data-cy="next-button"]')           // go to Page 280
      .click()
    cy.validateLabel('item','Page 280')

    cy.findPanelTitleAndNavArrows()
      .find('[data-cy="prev-button"]')          // go back to Page 279
      .click()

    cy.validateLabel('item','Page 279')
    cy.validateLabel('manifest', 'Einsiedeln, 278 1040')
    cy.validateText('.text-area', 'fol. 279a')
  })

  it('Should switch to previous manifest', () => {
    // Initially open München 627, first item in manifest label dropdown
    // Click previous button
    // should update the panel content with the previous manifest, last item, text area

    cy.findPanelTitleAndNavArrows()
      .find('[data-cy="manifest-label"]')
      .click()
      .get('[data-cy="manifests-dropdown"]')
      .children()
      .eq(2)
      .click()

      .get('[data-cy="items-dropdown"]')
      .children()
      .eq(0)
      .click()

      .findPanelTitleAndNavArrows()
      .find('[data-cy="prev-button"]')
      .click()

    cy.validateLabel('manifest', 'Kloster Neuburg, Cod. 251')
    cy.validateLabel('item','Page 72v')
    cy.validateText('.text-area', 'fol. 72v')
  })

  it('Should navigate in item label', () => {
    // item label is updated
    // text is updated
    // item modal is not anymore in DOM
    cy.validateLabel('item', 'Page 279')
      .click()

      .get('[data-cy="items-dropdown"]')
      .children().should('have.length', 3)
      .eq(2)
      .contains('281')
      .click()

    cy.get('#panels-wrapper')
      .children().eq(0)
      .find('[data-cy="items-dropdown"]').should('not.exist')

    cy.validateLabel('item', 'Page 281')       // item label is updated
    cy.validateText('.text-area', 'fol. 281a')   // text is updated
  })

  it('Should navigate in manifest and consecutively in item labels', () => {

    // validate Manifest Dropdown labels
    cy.validateLabel('manifest', 'Einsiedeln, 278 1040')
      .click()
      .get('[data-cy="manifests-dropdown"]')
      .children().should('have.length', 8)
      .eq(1)
      .contains(' Kloster Neuburg, Cod. 251')
      .next()
      .contains('München BSB Cgm 627')
      .click()

      // element 'manifests-dropdown' does not exist anymore in dom, 'items-dropdown' should be now in DOM
      .get('[data-cy="manifests-dropdown"]').should('not.exist')
      .get('[data-cy="items-dropdown"]')
      .children().should('have.length', 7)
      .eq(0).contains('243r')
      .next()
      .contains('243v')
      .click()

    // clicking this item: updates manifest and item labels and the text content
    cy.get('#panels-wrapper')
      .children().eq(0)
      .find('[data-cy="items-dropdown"]').should('not.exist')   // item dropdown is closed

    // Update of content
    cy.validateLabel('manifest', 'München BSB Cgm 627')
    cy.validateLabel('item', '243v')
    cy.validateText('.text-area', 'fol. 243va')
  })

  it('Should keep panel mode same after creating a new panel and navigating to another item in the first panel', () => {

    // create a new panel and select 'image' as the panel mode
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

    // Click 'New Panel' in Global Tree Popover
    cy.get('[data-cy="global-tree-modal"]')
      .find('[data-cy="button-new-panel"]')
      .should('have.text', 'New Panel')         // click New Panel
      .click()

      // a select mode dialog should open: we select 'image'
      .get('#panels-wrapper')
      .children().eq(1)
      .find('div[role="dialog"]')
      .find('[data-cy="modes-container"] [data-cy="modes"]')
      .should('exist')
      .children().should('have.length', 3)
      .eq(2).find('button').should('have.attr', 'data-cy', 'image')
      .click()                         // switch to 'text' mode

      .parents('div[role="dialog"]')
      .find('button[data-cy="confirm"]')
      .click()

    // 1)In first panel we navigate to next item and 2) make sure the panel mode is still 'text'
    cy.findPanelTitleAndNavArrows()
      .find('[data-cy="next-button"]')
      .click()

      .get('#panels-wrapper')
      .children().eq(0)
      .find('[data-cy="panel-modes-toggle"]')
      .find('[data-cy="text"]')
      .should('have.attr', 'data-selected', 'true')
  })

})
