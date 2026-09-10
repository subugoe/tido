/**
 * Header behaviour at small panel sizes (<600px breakpoint).
 *
 * Below that width the manifest navigation is collapsed (prev/next manifest buttons disappear)
 * and the collection title is replaced by a compact button group made of the collection icon
 * and the clickable manifest title. This spec verifies the switch and that each button keeps its
 * original functionality (collection icon -> local tree, manifest title -> manifest dropdown).
 *
 * Note: panels always open at 800px (the default width), so this spec resizes the panel below the
 * 600px breakpoint in `beforeEach`; the large-layout test resizes it back above the breakpoint.
 */

const apiUrl = Cypress.env('API_URL') || 'http://localhost:8181'
const collection = `${apiUrl}/example/collections/example.json`
const manifest = `${apiUrl}/example/manifests/book2.json`
const singleItemCollection = `${apiUrl}/example/collections/example-single-item.json`
const config = `panels[0].collection=${collection}&panels[0].manifest=${manifest}`

// Widths for switching the panel between the small (<600px) and large (>=600px) layout.
const SMALL_PANEL_WIDTH = 500
const LARGE_PANEL_WIDTH = 800

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
    // Panels open at 800px; shrink the panel below the breakpoint so the compact header renders,
    // then wait for it (means the panel loaded).
    resizePanel(SMALL_PANEL_WIDTH)
    getPanel().find('[data-cy="manifest-label-compact"]').should('be.visible')
  })

  it('should replace the collection title and collapsed manifest navigation with a compact button group', () => {
    getPanel().within(() => {
      // the compact button group consists of the collection icon and the clickable manifest title
      cy.get('[data-cy="collection-icon-button"]').should('be.visible')
      cy.get('[data-cy="manifest-label-compact"]').should('be.visible')

      // the normal collection title and the centred manifest navigation are hidden
      cy.get('[data-cy="collection-title"]').should('not.be.visible')
      cy.get('[data-cy="manifest-label"]').should('not.be.visible')
      cy.get('[data-cy="prev-manifest-button"]').should('not.be.visible')
      cy.get('[data-cy="next-manifest-button"]').should('not.be.visible')

      // the item navigation stays available
      cy.get('[data-cy="item-label"]').should('be.visible')
      cy.get('[data-cy="prev-item-button"]').should('be.visible')
      cy.get('[data-cy="next-item-button"]').should('be.visible')
    })
  })

  it('should open the local collection tree when the collection icon is clicked', () => {
    getPanel().find('[data-cy="collection-icon-button"]').click()

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

  it('should navigate through the local collection tree opened from the compact icon', () => {
    getPanel().find('[data-cy="collection-icon-button"]').click()

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
      cy.get('[data-cy="manifest-label-compact"]').should('contain.text', 'The Great Gatsby')
      cy.get('[data-cy="item-label"]').should('contain.text', 'Page 2')
    })
  })

  it('should open the manifest dropdown from the compact manifest title and keep the selection flow', () => {
    getPanel().find('[data-cy="manifest-label-compact"]')
      .should('contain.text', 'Moby-Dick')
      .click()

    // the same dropdown as the regular manifest button opens
    cy.get('[data-cy="manifests-dropdown"]')
      .should('be.visible')
      .children()
      .should('have.length', 3)
      .contains('The Great Gatsby')
      .click()

    // choosing a manifest still opens the item selection dropdown
    cy.get('[data-cy="items-dropdown"]')
      .should('be.visible')
      .children()
      .should('have.length', 3)
      .contains('book3-page2.json')
      .click()

    getPanel().within(() => {
      cy.get('[data-cy="manifest-label-compact"]').should('contain.text', 'The Great Gatsby')
      cy.get('[data-cy="item-label"]').should('contain.text', 'Page 2')
    })
  })

  it('should keep the normal collection title and manifest navigation above the breakpoint', () => {
    resizePanel(LARGE_PANEL_WIDTH)

    getPanel().within(() => {
      cy.get('[data-cy="collection-title"]')
        .should('be.visible')
        .should('contain.text', 'Classic Literature Collection')
      cy.get('[data-cy="manifest-label"]').should('be.visible')
      cy.get('[data-cy="prev-manifest-button"]').should('be.visible')
      cy.get('[data-cy="next-manifest-button"]').should('be.visible')

      // the compact resources stay hidden
      cy.get('[data-cy="collection-icon-button"]').should('not.be.visible')
      cy.get('[data-cy="manifest-label-compact"]').should('not.be.visible')
    })
  })

  it('should merge the item label into the compact manifest title for a single-item manifest', () => {
    cy.visit('/e2e.html?panels[0].collection=' + singleItemCollection)
    resizePanel(SMALL_PANEL_WIDTH)

    // the compact manifest title opens the same dropdown; select the single-item manifest
    getPanel()
      .find('[data-cy="manifest-label-compact"]')
      .should('contain.text', 'Pride and Prejudice')
      .click()
    cy.get('[data-cy="manifests-dropdown"]')
      .contains('Single Item Book')
      .click()

    getPanel().within(() => {
      // the only item is loaded directly and its label is merged into the compact manifest title
      cy.get('[data-cy="items-dropdown"]').should('not.exist')
      cy.get('[data-cy="manifest-label-compact"]').should('contain.text', 'Single Item Book - Page 2')

      // no item selector and no item arrows when there is only one item
      cy.get('[data-cy="item-label"]').should('not.exist')
      cy.get('[data-cy="prev-item-button"]').should('not.exist')
      cy.get('[data-cy="next-item-button"]').should('not.exist')
    })
  })
})