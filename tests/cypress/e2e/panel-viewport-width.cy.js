describe('Panel viewport width', () => {

  const apiUrl = Cypress.env('API_URL') || 'http://localhost:8181';
  const collection = `${apiUrl}/example/collections/example.json`;
  const manifest = `${apiUrl}/example/manifests/book2.json`;
  const item = `${apiUrl}/example/items/book2-page1.json`;

  // the room a panel keeps for the sidebar by default (SIDEBAR_DEFAULT_WIDTH)
  const sidebarRoom = 400

  const selectors = {
    itemLabel: '[data-cy="item-label"]',
    mainContent: '.main-content',
    panel: '[data-cy="panel"]',
    panelsWrapper: '[data-cy="panels-wrapper"]',
    sidebarContainer: '[data-sidebar-view]',
    sidebarToggle: '[data-cy="sidebar-toggle"]',
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

  it('Keeps room for the sidebar without the option', () => {
    visit()
    withViewportWidth((viewportWidth) => expectWidth(selectors.panel, viewportWidth - sidebarRoom))
  })

  it('Spans the full viewport width with the option', () => {
    visit(true)
    withViewportWidth((viewportWidth) => expectWidth(selectors.panel, viewportWidth))
  })

  it('Adds the sidebar beyond the viewport and keeps the content at the viewport width', () => {
    visit(true)
    cy.get(selectors.sidebarToggle).click()
    cy.get(selectors.sidebarContainer).should('be.visible')

    withViewportWidth((viewportWidth) => {
      expectWidth(selectors.panel, viewportWidth + sidebarRoom)
      // the content keeps the full viewport width, apart from the panel's borders
      expectWidth(selectors.mainContent, viewportWidth - 2)
    })
  })
})
