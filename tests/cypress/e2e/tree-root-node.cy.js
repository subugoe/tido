import { Tree } from '../support/tree-helpers'

const apiUrl = Cypress.env('API_URL') || 'http://localhost:8181'
// holds a single collection - example.json - which holds the three manifests book1, book2 and book3
const parentCollection = `${apiUrl}/example/collections/example-parent.json`
const collection = `${apiUrl}/example/collections/example.json`
const manifest = `${apiUrl}/example/manifests/book2.json`
const otherCollection = `${apiUrl}/4w/collections/transcriptions.json`

const selectors = {
  collectionTitle: '[data-cy="collection-title"]',
  globalTreeModal: '[data-cy="global-tree-modal"]',
  nodeLabel: '[data-cy="node-label"]',
  panel: '[data-cy="panels-wrapper"] [data-cy="panel"]',
  panelPlaceholder: '[data-cy="panel-placeholder"]',
}

function visit(params) {
  cy.visit('/e2e.html?' + new URLSearchParams(params).toString())
}

// the labels of the top level nodes of the tree, retried until they match
function shouldHaveTopLevelLabels(labels) {
  Tree.getRootNodes().should(($nodes) => {
    const nodeLabels = $nodes.toArray().map(el => Cypress.$(el).find(selectors.nodeLabel).first().text())
    expect(nodeLabels).to.deep.equal(labels)
  })
}

describe('Tree root node', () => {

  describe('Global tree', () => {
    it('Hides the root node when showRootNode is false and shows its children as the top level', () => {
      visit({ 'rootCollections[0]': parentCollection, 'tree.showRootNode': 'false' })
      Tree.open()

      shouldHaveTopLevelLabels(['example.json'])
      Tree.getTree().find(selectors.nodeLabel).should('not.contain.text', 'Classic Literature Parent Collection')
    })

    it('Shows the root node, expanded, by default', () => {
      visit({ 'rootCollections[0]': parentCollection })
      Tree.open()

      Tree.getRootNodes().should('have.length', 1).first().then(($root) => {
        Tree.shouldHaveLabel($root, 'Classic Literature Parent Collection')
        Tree.shouldBeExpanded($root)
        Tree.shouldHaveChildren($root, 1)
      })
    })

    it('Shows all root collections when there are several', () => {
      visit({ 'rootCollections[0]': collection, 'rootCollections[1]': otherCollection })
      Tree.open()

      shouldHaveTopLevelLabels(['Classic Literature Collection', 'Transkriptionen'])
    })
  })

  describe('Collection tree of a panel', () => {
    beforeEach(() => {
      visit({ 'panels[0].collection': collection, 'panels[0].manifest': manifest, 'tree.showRootNode': 'false' })
      cy.get(selectors.panel).find('[data-cy="item-label"]').should('be.visible')
    })

    it('Hides the root node when showRootNode is false and shows its children as the top level', () => {
      cy.get(selectors.panel).find(selectors.collectionTitle).click()

      shouldHaveTopLevelLabels(['book1.json', 'book2.json', 'book3.json'])
    })
  })

  describe('Tree for a new panel', () => {
    it('Hides the root node when showRootNode is false and shows its children as the top level', () => {
      visit({ 'rootCollections[0]': parentCollection, 'tree.showRootNode': 'false' })
      cy.get(selectors.panelPlaceholder).click()

      shouldHaveTopLevelLabels(['example.json'])
    })
  })
})
