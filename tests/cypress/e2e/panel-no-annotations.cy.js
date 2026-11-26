const apiUrl = Cypress.env('API_URL') || 'http://localhost:8181'
const manifest = `${apiUrl}/example/manifests/images-test.json`
const noAnnotationsItem = `${apiUrl}/example/items/no-images-page.json`
const annotatedCollection = `${apiUrl}/example/collections/example.json`
const annotatedManifest = `${apiUrl}/example/manifests/book2.json`

// In wide panels the view toggles sit in the middle of the header, whatever the width of the title
function expectViewTogglesCenteredInHeader() {
  cy.get('#panels-wrapper')
    .children().eq(0)
    .find('[data-cy="panel-views"]')
    .should('be.visible')
    .then(($toggles) => {
      const toggles = $toggles[0].getBoundingClientRect()
      const header = $toggles[0].closest('[data-cy="panel-container"]').getBoundingClientRect()
      expect(toggles.left + toggles.width / 2).to.be.closeTo(header.left + header.width / 2, 1)
    })
}

describe('Panel header with no annotations', () => {
  beforeEach(() => {
    cy.visit(`/e2e.html?panels[0].manifest=${manifest}&panels[0].item=${noAnnotationsItem}`)
  })

  it('disables the annotations view toggle when there are 0 annotations for the annotations view', () => {
    cy.get('#panels-wrapper')
      .children().eq(0)
      .find('[data-cy="annotations-toggle"]')
      .should('be.visible')
      .and('be.disabled')
  })

  it('keeps the view toggles centered in the header', () => {
    cy.get('[data-cy="item-label"]').should('be.visible')
    expectViewTogglesCenteredInHeader()
  })
})

describe('Panel header with annotations', () => {
  it('keeps the view toggles centered in the header', () => {
    cy.visit(`/e2e.html?panels[0].collection=${annotatedCollection}`)
    cy.get('[data-cy="annotations-toggle"]').should('be.visible')
    expectViewTogglesCenteredInHeader()
  })

  it('keeps the annotations view toggle while navigating to another item with annotations', () => {
    cy.visit(`/e2e.html?panels[0].collection=${annotatedCollection}&panels[0].manifest=${annotatedManifest}`)
    cy.get('[data-cy="annotations-toggle"]').should('be.visible')

    // The next text arrives late, so the panel has moved on to the new item while its annotations
    // can not be matched yet.
    cy.intercept('GET', '**/example/html/book2-page2_*', (req) => {
      req.on('response', (res) => res.setDelay(1500))
    }).as('nextText')

    cy.get('[data-cy="next-item-button"]').click()
    cy.get('[data-cy="item-label"]').should('contain', 'Page 2')
    cy.get('[data-cy="annotations-toggle"]', { timeout: 0 }).should('exist')

    cy.wait('@nextText')
    cy.get('[data-cy="annotations-toggle"]').should('be.visible')
  })
})
