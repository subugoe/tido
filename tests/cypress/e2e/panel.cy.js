const collection = 'http://localhost:8181/example/collections/example.json'
// the local tree tests navigate from the root node, which is shown by default
const config = `panels[0].collection=${collection}&panels[0].manifest=http://localhost:8181/example/manifests/book2.json&tree.showRootNode=true`;


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
      .validateLabel('item', 'Page 2')
      //.validateText('This is a valley of ashes—a fantastic farm where ashes grow')
  })

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
    cy.validateLabel('item', 'Page 1')
      .click()
    cy.get('[data-cy="items-dropdown"]')
      .children()
      .eq(2)
      .click()

    // Wait until the item dropdown is closed and Page 3 is loaded. Otherwise, on a slow machine the
    // click on the next button lands while the dropdown is still closing and gets lost.
    cy.get('#panels-wrapper')
      .children().eq(0)
      .find('[data-cy="items-dropdown"]').should('not.exist')
    cy.validateLabel('item','Page 3')
    cy.validateText('Chapter 3 - The Spouter-Inn')

    cy.findPanelTitleAndNavArrows()
      .find('[data-cy="next-item-button"]')
      .should('not.be.disabled')
      .click()
      .validateLabel('manifest', 'The Great Gatsby')         // Manifest and item labels should get updated
      .validateLabel('item', 'Page 1')
      // Text area should update. The Great Gatsby lists its diplomatic text first, and the transcription
      // of the manifest left is no choice of the user, so the new one opens on its first content type.
      .validateText('I lived at West Egg [ms: West-Egg], the—well')
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
    cy.validateLabel('item','Page 3')
    cy.validateText('Chapter 3')
  })

  it('Should navigate in item label', () => {
    // item label is updated
    // text is updated
    // item modal is not anymore in DOM
    cy.validateLabel('item', 'Page 1')
      .click()

      .get('[data-cy="items-dropdown"]')
      .children().should('have.length', 3)
      .eq(2)
      .contains('book2-page3.json')
      .click()

    cy.get('#panels-wrapper')
      .children().eq(0)
      .find('[data-cy="items-dropdown"]').should('not.exist')

    cy.validateLabel('item', 'Page 3')       // item label is updated
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
    cy.validateLabel('item', 'Page 2')
    // the first content type of The Great Gatsby is its diplomatic text
    cy.validateText('This is a valley of ashes [gray valley]—a fantastic farm where ashes grow like wheat')
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

// The breadcrumb of a single-item manifest is covered in panel-breadcrumb.cy.js - here its navigation
describe('Panel with a single-item manifest', () => {
  const apiUrl = Cypress.env('API_URL') || 'http://localhost:8181'
  const singleItemCollection = `${apiUrl}/example/collections/example-single-item.json`
  const singleItemManifest = `${apiUrl}/example/manifests/book-single.json`

  const breadcrumb = '[data-cy="panel-breadcrumb"]'

  beforeEach(() => {
    cy.visit(`/e2e.html?panels[0].collection=${singleItemCollection}&panels[0].manifest=${singleItemManifest}`)
    cy.get(breadcrumb).find('[data-cy="manifest-label"]').should('contain.text', 'Single Item Book')
    cy.get('[data-text-container]').should('contain.text', 'Chapter 2')
  })

  it('Keeps the item navigation, which leads to the neighbouring manifests', () => {
    cy.get(breadcrumb).find('[data-cy="item-label"]').should('not.exist')

    // the last manifest of the collection: there is nothing after its only item
    cy.get('[data-cy="next-item-button"]').should('be.disabled')

    // before its only item comes the last item of the previous manifest, which has an item segment again
    cy.get('[data-cy="prev-item-button"]').should('not.be.disabled').click()
    cy.get(breadcrumb).find('[data-cy="manifest-label"]').should('contain.text', 'Pride and Prejudice')
    cy.get(breadcrumb).find('[data-cy="item-label"]').should('contain.text', 'Page 3')
  })
})
