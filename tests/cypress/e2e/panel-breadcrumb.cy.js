import { panelSelectors } from '../support/panel-helpers'

// The breadcrumb in the panel header: collection / manifest / item. A manifest with a single item leaves
// nothing to choose at the item level - its item is not shown, and choosing such a manifest loads it directly.
describe('Panel breadcrumb', () => {
  const apiUrl = Cypress.env('API_URL') || 'http://localhost:8181'
  const collection = `${apiUrl}/example/collections/example-single-item.json`
  const singleItemManifest = `${apiUrl}/example/manifests/book-single.json`

  const selectors = {
    ...panelSelectors,
    manifestsDropdown: '[data-cy="manifests-dropdown"]',
    itemsDropdown: '[data-cy="items-dropdown"]',
  }

  const chooseManifest = (title) => {
    cy.get(selectors.breadcrumb).find(selectors.manifestLabel).click()
    cy.get(selectors.manifestsDropdown).contains(title).click()
  }

  it('Shows the collection, the manifest and the item', () => {
    cy.visit(`/e2e.html?panels[0].collection=${collection}`)

    cy.get(selectors.breadcrumb).within(() => {
      cy.get(selectors.collectionTitle).should('have.attr', 'title', 'Single Item Collection')
      cy.get(selectors.manifestLabel).should('contain.text', 'Pride and Prejudice')
      cy.get(selectors.itemLabel).should('contain.text', 'Page 1')
    })
  })

  it('Leaves out the item of a manifest with a single item', () => {
    cy.visit(`/e2e.html?panels[0].collection=${collection}&panels[0].manifest=${singleItemManifest}`)

    cy.get(selectors.breadcrumb).find(selectors.manifestLabel).should('contain.text', 'Single Item Book')
    cy.get(selectors.textContainer).should('contain.text', 'Chapter 2')
    cy.get(selectors.breadcrumb).find(selectors.itemLabel).should('not.exist')
  })

  it('Loads the item of a chosen manifest with a single item directly', () => {
    cy.visit(`/e2e.html?panels[0].collection=${collection}`)
    cy.get(selectors.breadcrumb).find(selectors.itemLabel).should('contain.text', 'Page 1')

    chooseManifest('Single Item Book')

    cy.get(selectors.itemsDropdown).should('not.exist')
    cy.get(selectors.breadcrumb).find(selectors.itemLabel).should('not.exist')
    cy.get(selectors.breadcrumb).find(selectors.manifestLabel).should('contain.text', 'Single Item Book')
    cy.get(selectors.textContainer).should('contain.text', 'Chapter 2')
  })

  it('Lets the item of a chosen manifest with several items be chosen', () => {
    cy.visit(`/e2e.html?panels[0].collection=${collection}&panels[0].manifest=${singleItemManifest}`)
    cy.get(selectors.textContainer).should('contain.text', 'Chapter 2')

    chooseManifest('Pride and Prejudice')

    cy.get(selectors.itemsDropdown).should('be.visible').contains('book1-page3').click()
    cy.get(selectors.breadcrumb).find(selectors.itemLabel).should('contain.text', 'Page 3')
    cy.get(selectors.textContainer).should('contain.text', 'Pride and Prejudice, Chapter 3')
  })
})
