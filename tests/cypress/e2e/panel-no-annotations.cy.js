const apiUrl = Cypress.env('API_URL') || 'http://localhost:8181'
const manifest = `${apiUrl}/example/manifests/images-test.json`
const noAnnotationsItem = `${apiUrl}/example/items/no-images-page.json`

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
})