import { panelSelectors } from '../support/panel-helpers'

/**
 * Header behaviour in narrow panels (< 700px).
 *
 * Below that width the collection segment of the breadcrumb shows its icon only - the title is in its
 * tooltip - and the view toggles show the icons of the views only. Every segment keeps what it opens:
 * the collection icon the local tree, the manifest the manifest dropdown.
 *
 * Note: panels loaded from the config open with the width available to them (the default is only
 * used by panels opened later), so this spec resizes the panel explicitly: below the 700px
 * breakpoint in `beforeEach`, and back above it in the wide-layout test.
 */

const apiUrl = Cypress.env('API_URL') || 'http://localhost:8181'
const collection = `${apiUrl}/example/collections/example.json`
const manifest = `${apiUrl}/example/manifests/book2.json`
// the local tree tests navigate from the root node, which is shown by default
const config = `panels[0].collection=${collection}&panels[0].manifest=${manifest}&tree.showRootNode=true`

// Widths for switching the panel between the narrow (< 700px) and wide (>= 1000px) layout.
const SMALL_PANEL_WIDTH = 500
const LARGE_PANEL_WIDTH = 1100

const selectors = {
  ...panelSelectors,
}

function getPanel(panelIndex = 0) {
  return cy.get('#panels-wrapper')
    .find('[data-cy="panel"]')
    .eq(panelIndex)
}

// Sets the panel width. The ".main-content" element is the container-query root ("@container/panel"),
// so it has to be resized together with the panel shell (width minus the 2px of border).
function resizePanel(width, panelIndex = 0) {
  getPanel(panelIndex)
    .invoke('css', 'width', `${width}px`)
    .find('.main-content')
    .invoke('css', 'width', `${width - 2}px`)
}

describe('Panel header at small panel sizes', () => {
  beforeEach(() => {
    cy.visit('/e2e.html?' + config)
    getPanel().find(selectors.manifestLabel).should('contain.text', 'Moby-Dick')
    resizePanel(SMALL_PANEL_WIDTH)
  })

  it('shows the collection as an icon with its title in the tooltip, and the rest of the breadcrumb', () => {
    getPanel().find(selectors.breadcrumb).within(() => {
      cy.get(selectors.collectionTitle)
        .should('be.visible')
        .and('have.attr', 'title', 'Classic Literature Collection')
        .find('span').should('not.be.visible')
      cy.get(selectors.manifestLabel).should('be.visible')
      cy.get(selectors.itemLabel).should('be.visible')
    })

    // the item navigation stays available
    getPanel().find('[data-cy="prev-item-button"]').should('be.visible')
    getPanel().find('[data-cy="next-item-button"]').should('be.visible')
  })

  it('shows the icons of the views only, with their names in the tooltip', () => {
    getPanel().find(selectors.viewToggle).first()
      .should('have.attr', 'title')
    // the name is only for screen readers: visually hidden (sr-only) - Cypress counts that as visible
    getPanel().find(selectors.viewToggle).first().find('span').should('have.css', 'position', 'absolute')
  })

  it('opens the local collection tree from the collection icon', () => {
    getPanel().find(selectors.collectionTitle).click()

    cy.get('[data-cy="tree"]')
      .should('be.visible')
      .children('[data-cy="tree-node"]').eq(0)
      .children('[data-cy="node-children"]')
      .children()
      .should('have.length', 3)          // the three manifests of the collection

    // close the popover again (ESC)
    cy.get('body').type('{esc}')
    cy.get('[data-cy="tree"]').should('not.exist')
  })

  it('navigates through the local collection tree opened from the collection icon', () => {
    getPanel().find(selectors.collectionTitle).click()

    cy.get('[data-cy="tree"]')
      .children('[data-cy="tree-node"]').eq(0)
      .children('[data-cy="node-children"]')
      .children()
      .should('have.length', 3)
      .eq(2).click()                      // expand the third manifest
      .find('[data-cy="node-children"]')
      .first()
      .children()
      .should('have.length', 3)           // its three items
      .eq(1).click()                      // select the second item

    // popover is closed and the panel shows the chosen manifest and item
    cy.get('[data-cy="tree"]').should('not.exist')
    getPanel().within(() => {
      cy.get(selectors.manifestLabel).should('contain.text', 'The Great Gatsby')
      cy.get(selectors.itemLabel).should('contain.text', 'Page 2')
    })
  })

  it('opens the manifest dropdown from the manifest segment and keeps the selection flow', () => {
    getPanel().find(selectors.manifestLabel).click()

    cy.get('[data-cy="manifests-dropdown"]')
      .should('be.visible')
      .children()
      .should('have.length', 3)
      .contains('The Great Gatsby')
      .click()

    // choosing a manifest opens the item selection dropdown
    cy.get('[data-cy="items-dropdown"]')
      .should('be.visible')
      .children()
      .should('have.length', 3)
      .contains('book3-page2.json')
      .click()

    getPanel().within(() => {
      cy.get(selectors.manifestLabel).should('contain.text', 'The Great Gatsby')
      cy.get(selectors.itemLabel).should('contain.text', 'Page 2')
    })
  })

  it('shows the collection title and the names of the views in wide panels', () => {
    resizePanel(LARGE_PANEL_WIDTH)

    getPanel().find(selectors.collectionTitle)
      .should('contain.text', 'Classic Literature Collection')
      .find('span').should('be.visible')
    getPanel().find(selectors.viewToggle).first().find('span').should('have.css', 'position', 'static')
  })
})
