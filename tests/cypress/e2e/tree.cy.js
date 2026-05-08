import { Tree } from '../support/tree-helpers'

const parentCollection = 'http://localhost:8181/example/collections/example-parent.json'
const collection = 'http://localhost:8181/example/collections/example.json'

const config = `rootCollections[0]=${parentCollection}&panels[0].collection=${collection}&panels[0].manifest=http://localhost:8181/example/manifests/book2.json`;


function clickNewPanelInGlobalTree() {
  cy.get('[data-cy="global-tree-modal"]')
    .find('[data-cy="button-new-panel"]')
    .should('have.text', 'New Panel')         // click New Panel
    .click()
}

/**
 * Asserts that a panel at index contains an item
 * and that its text view contains expected content.
 */
function expectPanelWithText(panelIdx, itemLabel, textSnippet) {
  cy.get('[data-cy="panels-wrapper"]')
    .find('[data-cy="panel"]')
    .eq(panelIdx)
    .as('panel')

  cy.get('@panel')
    .find('[data-cy="item-label"]')
    .should('have.text', itemLabel)

  cy.get('@panel')
    .find('[data-text-container]')
    .contains(textSnippet)
}


describe('Tree', () => {
  beforeEach(() => {
    cy.visit('/e2e.html?' + config)
  });

  it('Should render collections, manifests, and items correctly', () => {
    Tree.open()
    // Get the rootCollection (expanded by default)
    Tree.getRootNodes().first().then(($rootCollection) => {
      // Assert rootCollection has 1 nested collection
      Tree.shouldHaveChildren($rootCollection, 1)

      // Expand first nested collection: "Ebene 1: Reproduktion der Dokumente"
      const nestedCollectionLabel = 'example.json'
      Tree.clickNode(nestedCollectionLabel, $rootCollection).then(($nestedCollection) => {
        Tree.shouldBeExpanded($nestedCollection)
        Tree.shouldHaveChildren($nestedCollection, 3) // 3 manifests

        // First manifest under this collection
        const firstManifestLabel = 'book1.json'
        Tree.clickNode(firstManifestLabel, $nestedCollection).then(($manifest) => {
          Tree.shouldHaveChildren($manifest, 3) // items

          // Check second item of the first manifest
          Tree.getChildAt($manifest, 1).then(($item) => {
            Tree.shouldHaveLabel($item, 'book1-page2.json')
          })
        })

        // Second manifest under the collection
        const secondManifestLabel = 'book2.json'
        Tree.getDirectChildByLabel($nestedCollection, secondManifestLabel).then(($manifest2) => {
          Tree.shouldHaveLabel($manifest2, secondManifestLabel)
        })
      })
    })
  });

  it('Should create new panels using global tree', () => {
    Tree.open()

    // Select item 280 via full path
    Tree.clickPath([
      'example.json',
      'book1.json',
      'book1-page2.json'
    ])
      .find('div')
      .first()
      .should('have.class', 'active')

    // Popover shows update buttons for existing panels
    cy.get('[data-cy="global-tree-modal"]')
      .find('[data-cy="buttons-update-panel"]')
      .find('[data-cy="button-update-panel"]')
      .should('have.length', 1)
      .first()
      .should('have.text', 'Panel 1')

    // Create second panel
    clickNewPanelInGlobalTree()

    cy.get('[data-cy="panels-wrapper"]')
      .find('[data-cy="panel"]')
      .should('have.length', 2)

    expectPanelWithText(1, 'Pride and Prejudice, Chapter 2', 'Pride and Prejudice')

    // Tree modal closes after panel creation
    cy.get('[data-cy="global-tree-modal"]').should('not.exist')

    // Tree remains expanded -> we can now select by label only
    Tree.clickPath(['book1-page3.json'])
    clickNewPanelInGlobalTree()

    cy.get('[data-cy="panels-wrapper"]')
      .find('[data-cy="panel"]')
      .should('have.length', 3)

    // Select another item
    Tree.clickPath([
      'book3.json',
      'book3-page1.json'
    ])

    // Modal now shows update buttons for 3 panels
    cy.get('[data-cy="global-tree-modal"]')
      .find('[data-cy="buttons-update-panel"]')
      .find('[data-cy="button-update-panel"]')
      .last()
      .should('have.text', 'Panel 3')
  })


  it('Should update a panel using global tree', () => {
    Tree.open()

    Tree.clickPath([
      'example.json',
      'book1.json',
      'book1-page3.json'
    ])

    cy.get('[data-cy="global-tree-modal"]')
      .find('[data-cy="button-update-panel"]')
      .first()
      .click()

    cy.get('[data-cy="panels-wrapper"]')
      .find('[data-cy="panel"]')
      .should('have.length', 1)

    expectPanelWithText(0, 'Pride and Prejudice, Chapter 3', 'Pride and Prejudice, Chapter 3')

    cy.get('[data-cy="global-tree-modal"]').should('not.exist')
  })

})
