import { panelSelectors } from '../support/panel-helpers'

describe('Panel viewport width', () => {

  const apiUrl = Cypress.env('API_URL') || 'http://localhost:8181';
  const collection = `${apiUrl}/example/collections/example.json`;
  const manifest = `${apiUrl}/example/manifests/book2.json`;
  const item = `${apiUrl}/example/items/book2-page1.json`;

  const selectors = {
    ...panelSelectors,
    mainContent: '.main-content',
  };

  const visit = (showViewportWidth) => {
    const params = new URLSearchParams()
    params.set('showPanelPlaceholder', 'false')
    params.set('panels[0].collection', collection)
    params.set('panels[0].manifest', manifest)
    params.set('panels[0].item', item)
    if (showViewportWidth !== undefined) params.set('panels[0].showViewportWidth', String(showViewportWidth))

    cy.visit(`/e2e.html?${params.toString()}`)
    cy.get(selectors.itemLabel).contains('Page 1')
  }

  // The width the panels wrapper leaves for its panels - the viewport the panels are laid out in.
  const withViewportWidth = (callback) => {
    cy.get(selectors.panelsWrapper).then(($wrapper) => {
      const style = window.getComputedStyle($wrapper[0])
      const width = $wrapper[0].clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight)
      callback(width)
    })
  }

  const expectWidth = (selector, width) => {
    cy.get(selector).should(($el) => {
      expect($el[0].getBoundingClientRect().width, selector).to.be.closeTo(width, 2)
    })
  }

  it('Takes the room of the viewport without the option - no room is kept for the annotations', () => {
    visit()
    withViewportWidth((viewportWidth) => expectWidth(selectors.panel, viewportWidth))
  })

  it('Spans the full viewport width with the option', () => {
    visit(true)
    withViewportWidth((viewportWidth) => expectWidth(selectors.panel, viewportWidth))
  })

  it('Opens the annotations inside the panel and keeps the panel at the viewport width', () => {
    visit(true)
    cy.get(selectors.annotationsToggle).click()
    cy.get(selectors.annotationsView).should('be.visible')

    withViewportWidth((viewportWidth) => {
      expectWidth(selectors.panel, viewportWidth)
      // the content keeps the full viewport width, apart from the panel's borders - the annotations
      // pane takes its room from the views
      expectWidth(selectors.mainContent, viewportWidth - 2)
    })
  })
})
