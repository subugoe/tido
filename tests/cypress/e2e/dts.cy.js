import { Tree } from '../support/tree-helpers'

const root = 'http://localhost:8181/dts/api/dts/collection/root.json'
const poems = 'http://localhost:8181/dts/api/dts/collection/poems.json'
const priapeia = 'http://localhost:8181/dts/api/dts/collection/priapeia.json'

/**
 * DTS bridge tests: TIDO loads DTS collections (https://dtsapi.org) by detecting the
 * `@type` marker in responses and normalizing them into TextAPI shapes. The fixtures in
 * tests/mocks/dts mirror the spec examples and the live DoTS server.
 */
describe('DTS', () => {
  it('Should show a DTS collection tree with collections, resources, and items', () => {
    cy.visit('/e2e.html?rootCollections[0]=' + root)

    Tree.open()
    Tree.getRootNodes().first().then(($rootNode) => {
      // root mixes a sub-collection and a resource as siblings
      Tree.shouldHaveChildren($rootNode, 2)

      Tree.clickNode('Poems', $rootNode).then(($poems) => {
        Tree.shouldBeExpanded($poems)
        Tree.shouldHaveChildren($poems, 2)

        // each readable resource carries its full document as a single item
        Tree.clickNode('Priapeia', $poems).then(($priapeiaNode) => {
          Tree.shouldBeExpanded($priapeiaNode)
          Tree.shouldHaveChildren($priapeiaNode, 1)
        })
      })
    })
  })

  it('Should open a DTS resource in a panel and render its text', () => {
    cy.visit('/e2e.html?rootCollections[0]=' + root +
      '&panels[0].collection=' + poems +
      '&panels[0].manifest=' + priapeia)

    cy.get('[data-cy="panels-wrapper"]')
      .find('[data-cy="panel"]')
      .first()
      .find('[data-text-container]')
      .contains('Quid hoc, puere, facis?')
  })
})
