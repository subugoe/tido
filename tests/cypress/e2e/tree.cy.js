import { Tree } from '../support/tree-helpers'

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
    .find('[data-cy="panel-mode-select"]')
    .click()

  cy.get('[data-cy="panel-mode-menu"]')
    .find('[data-slot="select-item"]')
    .eq(1) // text mode
    .click()

  cy.get('@panel')
    .find('.text-area')
    .first()
    .contains(textSnippet)
}


describe('Tree', () => {
  beforeEach(() => {
    cy.visit('/4w-local.html')
  });

  it('Should render collections, manifests, and items correctly', () => {
    Tree.open()
    // Get the rootCollection (expanded by default)
    Tree.getRootNodes().first().then(($rootCollection) => {
      // Assert rootCollection has 2 nested collections
      Tree.shouldHaveChildren($rootCollection, 2)

      // Expand first nested collection: "Ebene 1: Reproduktion der Dokumente"
      const nestedCollectionLabel = 'Ebene 1: Reproduktion der Dokumente'
      Tree.clickNode(nestedCollectionLabel, $rootCollection).then(($nestedCollection) => {
        Tree.shouldBeExpanded($nestedCollection)
        Tree.shouldHaveChildren($nestedCollection, 8) // 8 manifests

        // First manifest under this collection
        const firstManifestLabel = 'Einsiedeln, 278 1040'
        Tree.clickNode(firstManifestLabel, $nestedCollection).then(($manifest) => {
          Tree.shouldHaveChildren($manifest, 3) // items

          // Check second item of the first manifest
          Tree.getChildAt($manifest, 1).then(($item) => {
            Tree.shouldHaveLabel($item, '280')
          })
        })

        // Second manifest under the collection
        const secondManifestLabel = 'Kloster Neuburg, Cod. 251'
        Tree.getDirectChildByLabel($nestedCollection, secondManifestLabel).then(($manifest2) => {
          Tree.shouldHaveLabel($manifest2, secondManifestLabel)
        })
      })
    })
  });

  it.only('Should create new panels using global tree', () => {
    Tree.open()

    // Select item 280 via full path
    Tree.clickPath([
      'Ebene 1: Reproduktion der Dokumente',
      'Einsiedeln, 278 1040',
      '280'
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

    expectPanelWithText(1, '280', 'fol. 280a')

    // Tree modal closes after panel creation
    cy.get('[data-cy="global-tree-modal"]').should('not.exist')

    // Tree remains expanded -> we can now select by label only
    Tree.clickPath(['280'])
    clickNewPanelInGlobalTree()

    cy.get('[data-cy="panels-wrapper"]')
      .find('[data-cy="panel"]')
      .should('have.length', 3)

    // Select another item
    Tree.clickPath([
      'Kloster Neuburg, Cod. 251',
      '72v'
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
      'Ebene 1: Reproduktion der Dokumente',
      'Einsiedeln, 278 1040',
      '280'
    ])

    cy.get('[data-cy="global-tree-modal"]')
      .find('[data-cy="button-update-panel"]')
      .first()
      .click()

    cy.get('[data-cy="panels-wrapper"]')
      .find('[data-cy="panel"]')
      .should('have.length', 1)

    expectPanelWithText(0, '280', 'fol. 280a')

    cy.get('[data-cy="global-tree-modal"]').should('not.exist')
  })

})
