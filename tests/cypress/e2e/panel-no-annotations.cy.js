const apiUrl = Cypress.env('API_URL') || 'http://localhost:8181'
const manifest = `${apiUrl}/example/manifests/images-test.json`
const noAnnotationsItem = `${apiUrl}/example/items/no-images-page.json`
const annotatedCollection = `${apiUrl}/example/collections/example.json`
const annotatedManifest = `${apiUrl}/example/manifests/book2.json`

function expectTitleCenteredInHeader() {
  cy.get('#panels-wrapper')
    .children().eq(0)
    .find('[data-cy="panel-title-and-nav-arrows"]')
    .then(($title) => {
      const title = $title[0].getBoundingClientRect()
      const header = $title[0].parentElement.getBoundingClientRect()
      expect(title.left + title.width / 2).to.be.closeTo(header.left + header.width / 2, 1)
    })
}

describe('Panel header with no annotations', () => {
  beforeEach(() => {
    cy.visit(`/e2e.html?panels[0].manifest=${manifest}&panels[0].item=${noAnnotationsItem}`)
  })

  it('hides the sidebar toggle when there are 0 annotations for the sidebar', () => {
    cy.get('#panels-wrapper')
      .children().eq(0)
      .find('[data-cy="sidebar-toggle"]')
      .should('not.exist')
  })

  it('keeps the title centered in the header', () => {
    cy.get('[data-cy="item-label"]').should('be.visible')
    expectTitleCenteredInHeader()
  })
})

describe('Panel header with annotations', () => {
  it('keeps the title centered in the header', () => {
    cy.visit(`/e2e.html?panels[0].collection=${annotatedCollection}`)
    cy.get('[data-cy="sidebar-toggle"]').should('be.visible')
    expectTitleCenteredInHeader()
  })

  it('keeps the sidebar toggle while navigating to another item with annotations', () => {
    cy.visit(`/e2e.html?panels[0].collection=${annotatedCollection}&panels[0].manifest=${annotatedManifest}`)
    cy.get('[data-cy="sidebar-toggle"]').should('be.visible')

    // The next text arrives late, so the panel has moved on to the new item while its annotations
    // can not be matched yet.
    cy.intercept('GET', '**/example/html/book2-page2_*', (req) => {
      req.on('response', (res) => res.setDelay(1500))
    }).as('nextText')

    cy.get('[data-cy="next-item-button"]').click()
    cy.get('[data-cy="item-label"]').should('contain', 'Page 2')
    cy.get('[data-cy="sidebar-toggle"]', { timeout: 0 }).should('exist')

    cy.wait('@nextText')
    cy.get('[data-cy="sidebar-toggle"]').should('be.visible')
  })
})
