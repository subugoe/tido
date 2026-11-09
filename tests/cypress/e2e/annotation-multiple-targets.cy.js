describe('Alignment of an annotation with multiple targets', () => {

  const apiUrl = Cypress.env('API_URL') || 'http://localhost:8181'
  const manifest = `${apiUrl}/example/manifests/multiple-targets.json`
  const item = `${apiUrl}/example/items/multiple-targets-page.json`

  // The item's text is Pride and Prejudice, Chapter 1. Its only annotation has three targets, in this
  // order: #does-not-exist, which is not in the text, then "Mrs. Long" (#mrs-long) in the last
  // paragraph, then "a neighbourhood" (#neighbourhood) in the second paragraph. The top most target is
  // the last one listed, so the card must not simply follow the first target that is found.
  const card = `[data-annotation="${apiUrl}/example/multiple-targets/annotation-1"]`
  const upperTarget = '#neighbourhood'
  const lowerTarget = '#mrs-long'

  const selectors = {
    panel: '[data-cy="panel"]',
    sidebarContainer: '[data-sidebar-view]',
    sidebarLoading: '[data-cy="sidebar-loading"]',
    sidebarToggle: '[data-cy="sidebar-toggle"]',
    textContainer: '[data-text-container]',
  }

  // Vertical distance from the top of the panel - the frame both the text and the sidebar live in.
  const yInPanel = (el, panel) => el.getBoundingClientRect().top - panel.getBoundingClientRect().top

  beforeEach(() => {
    const params = new URLSearchParams()
    params.set('annotations.defaultMode', 'aligned')
    params.set('panels[0].manifest', manifest)
    params.set('panels[0].item', item)

    cy.visit(`/e2e.html?${params.toString()}`)
    cy.get(selectors.textContainer).find(upperTarget).should('exist')
    cy.get(selectors.textContainer).find(lowerTarget).should('exist')

    cy.get(selectors.sidebarToggle).click()
    cy.get(selectors.sidebarContainer).should('be.visible')
    cy.get(selectors.sidebarLoading).should('not.exist')
  })

  it('Aligns the card with its top most target when its first target is not in the text', () => {
    cy.get(selectors.panel).then(($panel) => {
      cy.get(card).should('be.visible').should(($card) => {
        const cardY = yInPanel($card[0], $panel[0])
        const upperY = yInPanel(Cypress.$(selectors.textContainer).find(upperTarget)[0], $panel[0])
        const lowerY = yInPanel(Cypress.$(selectors.textContainer).find(lowerTarget)[0], $panel[0])

        // the two found targets lie on clearly different heights, so the check below tells them apart
        expect(lowerY - upperY, 'distance between the targets').to.be.greaterThan(20)
        expect(cardY, `card y ${cardY} vs top most target y ${upperY}`).to.be.closeTo(upperY, 1)
      })
    })
  })
})
