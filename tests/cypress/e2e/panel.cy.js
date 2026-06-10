const collection = 'http://localhost:8181/example/collections/example.json'
const config = `panels[0].collection=${collection}&panels[0].manifest=http://localhost:8181/example/manifests/book2.json`;


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
    .should('contain.text',label)
})

Cypress.Commands.add('validateText', (content) => {
  cy.get('#panels-wrapper')
    .children().eq(0)
    .find('[aria-label="Loading"]')
    .should('not.exist')

  cy.get('#panels-wrapper')
    .children().eq(0)
    .find('div[data-text-container]')
    .should('contain.text', content)
})

describe('Panel', () => {
  beforeEach(() => {
    cy.visit('/e2e.html?' + config)
  });

  it('Should navigate correctly in local tree', () => {
    // click collection title opens a tree with the expanded root collection and
    cy.get('[data-cy="panels-wrapper"]')
      .find('[data-cy="panel"]')
      .eq(0)
      .find('[data-cy="collection-title"]')
      .find('span')
      .contains('Classic Literature Collection')
      .click()
      .get('[data-cy="tree"]')
      .children('[data-cy="tree-node"]').eq(0)
      .should('have.length', 1)           // initially we have one root node
      .children('[data-cy="node-children"]')
      .children()
      .should('have.length', 3)           // children exists -> the root node is expanded initially

      // click at manifest and item updates the content correctly
      .eq(2).click()
      .find('[data-cy="node-children"]')
      .first()
      .children().should('have.length', 3)    // number of items of manifest
      .eq(1).click()
      .get('#panels-wrapper')
      .children().eq(0)
      .find('[aria-label="Loading"]')
      .should('exist')
      .get('[data-radix-popper-content-wrapper]')     // popover is closed
      .should('not.exist')

      .validateLabel('manifest', 'The Great Gatsby')
      .validateLabel('item', 'The Great Gatsby, Chapter 2')
      //.validateText('This is a valley of ashes—a fantastic farm where ashes grow')
  })

  // it('Should display the configured panelModes and the defaultPanelMode as selected', () => {
  //   cy.get('#panels-wrapper')
  //     .children().eq(0)
  //     .find('[data-cy="panel-mode-select"]')
  //     .click()
  //     .get('[data-cy="panel-mode-menu"]')
  //     .find('[data-slot="select-item"]')
  //     .should('have.length', 3)
  //     .eq(1)                    // order of panelModes is displayed as provided
  //     .should('have.attr', 'data-cy', 'text')
  //     .should('have.attr', 'data-selected', 'true')
  //     .parent()
  //     .children().eq(1) // eq(0) is the label "Panel modes"
  //     .should('have.attr', 'data-cy', 'split')
  // })

  // it('Should switch the panel mode and its corresponding panel body', () => {
  //   cy.get('#panels-wrapper')
  //     .find('[data-cy="panel-container"]')
  //     .find('[data-image-container]')
  //     .should('not.exist')   // data-image-container should not exist in 'text' panelMode
  //
  //     // select split mode
  //     .get('#panels-wrapper')
  //     .children().eq(0)
  //     .find('[data-cy="panel-mode-select"]')
  //     .click()
  //     .get('[data-cy="panel-mode-menu"]')
  //     .find('[data-slot="select-item"]')
  //     .first()
  //     .click()
  //     .get('#panels-wrapper')
  //     .children().eq(0)
  //     .find('[data-cy="panel-mode-select"]')
  //     .click()
  //     .get('[data-cy="panel-mode-menu"]')
  //     .find('[data-slot="select-item"]')
  //     .first()
  //     .should('have.attr', 'data-cy', 'split')
  //     .should('have.attr', 'data-selected', 'true')          //'split' mode is selected
  //     .get('[data-cy="panel-mode-menu"]')
  //     .find('[data-slot="select-item"]')
  //     .eq(1)
  //     .should('have.attr', 'data-selected', 'false')
  //
  //     //below two blocks of code check whether the content is in split mode: the image container is not empty and there is text in scroll container
  //
  //     .get('#panels-wrapper')
  //     .children().eq(0)
  //     .find('[data-cy="panel-container"]')
  //     .find('[data-image-container]')
  //     .children().should('not.have.length', 0)   // data-image-container now has children
  //
  //   cy.validateText('fol. 279a')
  // })

  //  ------  Navigation  ---------

  // it('Should switch to next item', () => {
  //   cy.findPanelTitleAndNavArrows()
  //     .find('[data-cy="next-item-button"]')
  //     .click()
  //
  //   // item label and text is updated
  //   cy.validateLabel('item','280')
  //   cy.validateText('fol. 280a')
  // })

  it('Should switch to next manifest', () => {
    cy.validateLabel('item', 'Moby-Dick, Chapter 1 - Loomings')
      .click()
    cy.get('[data-cy="items-dropdown"]')
      .children()
      .eq(2)
      .click()
      .validateLabel('item','Moby-Dick, Chapter 3 - The Spouter-Inn')

      .findPanelTitleAndNavArrows()
      .find('[data-cy="next-item-button"]')
      .click()  // should switch to the first item of Klosterneuburg manifest
      .validateLabel('manifest', 'The Great Gatsby')         // Manifest and item labels should get updated
      .validateLabel('item', 'The Great Gatsby, Chapter 1')
      .validateText('I lived at West Egg, the—well')                        // Text area should update
  })

  // it('Should switch to previous item', () => {
  //   cy.findPanelTitleAndNavArrows()
  //     .find('[data-cy="next-item-button"]')           // go to Page 280
  //     .click()
  //   cy.validateLabel('item','280')
  //
  //   cy.findPanelTitleAndNavArrows()
  //     .find('[data-cy="prev-item-button"]')          // go back to Page 279
  //     .click()
  //
  //   cy.validateLabel('item','Seite einsiedeln_278_1040-279')
  //   cy.validateLabel('manifest', 'Einsiedeln, 278 1040')
  //   cy.validateText('fol. 279a')
  // })

  it('Should switch to previous manifest', () => {
    // Initially open München 627, first item in manifest label dropdown
    // Click previous button
    // should update the panel content with the previous manifest, last item, text area

    cy.findPanelTitleAndNavArrows()
      .find('[data-cy="prev-item-button"]')
      .click()

    cy.validateLabel('manifest', 'Pride and Prejudice')
    cy.validateLabel('item','Pride and Prejudice, Chapter 3')
    cy.validateText('Chapter 3')
  })

  it('Should navigate in item label', () => {
    // item label is updated
    // text is updated
    // item modal is not anymore in DOM
    cy.validateLabel('item', 'Moby-Dick, Chapter 1 - Loomings')
      .click()

      .get('[data-cy="items-dropdown"]')
      .children().should('have.length', 3)
      .eq(2)
      .contains('book2-page3.json')
      .click()

    cy.get('#panels-wrapper')
      .children().eq(0)
      .find('[data-cy="items-dropdown"]').should('not.exist')

    cy.validateLabel('item', 'Moby-Dick, Chapter 3 - The Spouter-Inn')       // item label is updated
    cy.validateText('Chapter 3 - The Spouter-Inn')   // text is updated
  })

  it('Should navigate in manifest and consecutively in item labels', () => {

    // validate Manifest Dropdown labels
    cy.validateLabel('manifest', 'Moby-Dick')
      .click()
      .get('[data-cy="manifests-dropdown"]')
      .children().should('have.length', 3)
      .eq(1)
      .contains('Moby-Dick')
      .next()
      .contains('The Great Gatsby')
      .click()

      // element 'manifests-dropdown' does not exist anymore in dom, 'items-dropdown' should be now in DOM
      .get('[data-cy="manifests-dropdown"]').should('not.exist')
      .get('[data-cy="items-dropdown"]')
      .children().should('have.length', 3)
      .eq(0).contains('book3-page1.json')
      .next()
      .contains('book3-page2.json')
      .click()

    // clicking this item: updates manifest and item labels and the text content
    cy.get('#panels-wrapper')
      .children().eq(0)
      .find('[data-cy="items-dropdown"]').should('not.exist')   // item dropdown is closed

    // Update of content
    cy.validateLabel('manifest', 'The Great Gatsby')
    cy.validateLabel('item', 'The Great Gatsby, Chapter 2')
    cy.validateText('This is a valley of ashes—a fantastic farm where ashes grow like wheat')
  })

  it('Should disable the next button in last manifest last item', () => {
    // navigate to last item of last manifest
    cy.get('[data-cy="panels-wrapper"]')
      .find('[data-cy="panel"]')
      .eq(0)
      .find('[data-cy="collection-title"]')
      .click()
      .get('[data-cy="tree"]')
      .children('[data-cy="tree-node"]').eq(0)
      .children('[data-cy="node-children"]')
      .children()
      .should('have.length', 3)

      .last().click()
      .find('[data-cy="node-children"]')
      .children()
      .last().click()

    // 'prev' is not 'disabled'
    cy.findPanelTitleAndNavArrows()
      .find('[data-cy="prev-item-button"]')
      .should('not.have.attr', 'disabled')

    // 'next is 'disabled'
    cy.findPanelTitleAndNavArrows()
      .find('[data-cy="next-item-button"]')
      .should('have.attr', 'disabled')
  })
})

describe('Panel with book 1', () => {
  it('Should disable the prev button in first manifest first item', () => {
    const config = `panels[0].collection=${collection}`;

    cy.visit('/e2e.html?' + config)
    // 'prev' is disabled
    cy.findPanelTitleAndNavArrows()
      .find('[data-cy="prev-item-button"]')
      .should('have.attr', 'disabled')

    // 'next is not 'disabled'
    cy.findPanelTitleAndNavArrows()
      .find('[data-cy="next-item-button"]')
      .should('not.have.attr', 'disabled')
  })
})
