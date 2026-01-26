import { Tree } from '../support/tree-helpers'

function clickNewPanelInGlobalTree() {
  cy.get('[data-cy="global-tree-modal"]')
    .find('[data-cy="button-new-panel"]')
    .should('have.text', 'New Panel')         // click New Panel
    .click()
}

/**
 * Clicks on nested tree nodes by their labels in order
 * @param {string[]} nodeLabels
 */
function clickNestedNodes(nodeLabels) {
  let current = cy.get('[data-cy="tree"]')

  nodeLabels.forEach((label) => {
    current = current
      .contains(new RegExp("^" + label + "$"))
      .closest('[data-cy="tree-node"],[data-cy="tree-node-leaf"]')
      .click()
      .then(($el) => {
        // For next iteration, search inside the expanded node
        current = cy.wrap($el);
      })
  })

  return current
}

describe('Tree', () => {
  beforeEach(() => {
    cy.visit('/4w-local.html')
  });



  it.only('Should render collections, manifests, and items correctly', () => {
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

  it('Should create new panels using global tree', () => {
    cy.get('[data-cy="global-tree-toggle"]').click()
    // click the item 280                       
    clickNestedNodes(['Ebene 1: Reproduktion der Dokumente', 'Einsiedeln, 278 1040', '280'])
      // Item is active
      .find('div').first()
      .should('have.class','active')

    // a popover is shown with two buttons (Panel 1, New Panel)
    cy.get('[data-cy="global-tree-modal"]')
      .get('[data-cy="buttons-update-panel"]')
      .find('[data-cy="button-update-panel"]')
      .should('have.length', 1)
      .eq(0).should('have.text', 'Panel 1')

    clickNewPanelInGlobalTree()

    cy.get('[data-cy="panels-wrapper"]')  // check whether the item - 280 -  is opened in second panel
      .find('[data-cy="panel"]')
      .should('have.length', 2)      // now we have 2 panels
      .eq(1)
      .find('[data-cy="item-label"]')
      .should('have.text', '280')     // Panel was added after the first one
      // switch to text mode
      .parents('[data-cy="panel"]')
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
    clickNestedNodes(['280'])

    clickNewPanelInGlobalTree()

    cy.get('[data-cy="panels-wrapper"]')
      .find('[data-cy="panel"]')
      .should('have.length', 3)     // we have 3 panels

    // select another item from tree
    clickNestedNodes(['Kloster Neuburg, Cod. 251', '72v'])

    // in the global tree modal: we should have 4 buttons (3 buttons to update the first 3 panels and 'New Panel')
    cy.get('[data-cy="global-tree-modal"]')
      .find('[data-cy="buttons-update-panel"]')
      .find('[data-cy="button-update-panel"]')
      .last().should('have.text', 'Panel 3')
  });

  it('Should update a panel using global tree', () => {
    cy.get('[data-cy="global-tree-toggle"]').click()
    clickNestedNodes(['Ebene 1: Reproduktion der Dokumente', 'Einsiedeln, 278 1040', '280'])

    cy.get('[data-cy="global-tree-modal"]')
      .find('[data-cy="buttons-update-panel"]')
      .find('[data-cy="button-update-panel"]')
      .eq(0)
      .click()

    cy.get('[data-cy="panels-wrapper"]')  // check whether the item - 280 -  is opened in first panel
      .find('[data-cy="panel"]')
      .should('have.length', 1)
      .eq(0)
      .find('[data-cy="item-label"]')
      .should('have.text', '280')
      .parents('[data-cy="panel"]')
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
  });
})
