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

  const visit = (showViewportWidth, { panelCount = 1, showPanelPlaceholder = false } = {}) => {
    const params = new URLSearchParams()
    params.set('showPanelPlaceholder', String(showPanelPlaceholder))
    for (let i = 0; i < panelCount; i++) {
      params.set(`panels[${i}].collection`, collection)
      params.set(`panels[${i}].manifest`, manifest)
      params.set(`panels[${i}].item`, item)
    }
    if (showViewportWidth !== undefined) params.set('panels[0].showViewportWidth', String(showViewportWidth))

    cy.visit(`/e2e.html?${params.toString()}`)
    cy.get(selectors.itemLabel).should('have.length', panelCount).each(($label) => cy.wrap($label).contains('Page 1'))
  }

  const expectNoHorizontalScroll = () => {
    cy.get(selectors.panelsWrapper).should(($wrapper) => {
      expect($wrapper[0].scrollWidth, 'panels wrapper scroll width').to.be.at.most($wrapper[0].clientWidth + 1)
    })
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

  it('Fits the opened sidebar into the viewport by shrinking the content', () => {
    visit(true)
    cy.get(selectors.sidebarToggle).click()
    cy.get(selectors.sidebarContainer).should('be.visible')

    withViewportWidth((viewportWidth) => {
      expectWidth(selectors.panel, viewportWidth)
      // the content gives up the sidebar's width, apart from the panel's borders
      expectWidth(selectors.mainContent, viewportWidth - sidebarRoom - 2)
    })
  })

  it('Restores the content width when the sidebar is closed', () => {
    visit(true)
    cy.get(selectors.sidebarToggle).click()
    cy.get(selectors.sidebarContainer).should('be.visible')
    cy.get(selectors.sidebarToggle).click()
    cy.get(selectors.sidebarContainer).should('not.exist')

    withViewportWidth((viewportWidth) => {
      expectWidth(selectors.panel, viewportWidth)
      expectWidth(selectors.mainContent, viewportWidth - 2)
    })
  })

  it('Keeps the panel within the viewport when the sidebar is opened without the option', () => {
    visit()
    cy.get(selectors.sidebarToggle).click()
    cy.get(selectors.sidebarContainer).should('be.visible')

    withViewportWidth((viewportWidth) => {
      expectWidth(selectors.panel, viewportWidth)
      expectWidth(selectors.mainContent, viewportWidth - sidebarRoom - 2)
    })

    cy.get(selectors.sidebarToggle).click()
    withViewportWidth((viewportWidth) => {
      expectWidth(selectors.panel, viewportWidth - sidebarRoom)
      expectWidth(selectors.mainContent, viewportWidth - sidebarRoom - 2)
    })
  })

  it('Squeezes the content so the sidebar fits next to the panel placeholder', () => {
    visit(undefined, { showPanelPlaceholder: true })
    cy.get(selectors.sidebarToggle).click()
    cy.get(selectors.sidebarContainer).should('be.visible')
    expectNoHorizontalScroll()
  })

  it('Squeezes the content so the sidebar of one of several panels fits without scrolling', () => {
    visit(undefined, { panelCount: 2 })

    let contentWidth
    cy.get(selectors.mainContent).eq(1).then(($content) => {
      contentWidth = $content[0].getBoundingClientRect().width
    })

    cy.get(selectors.sidebarToggle).eq(1).click()
    cy.get(selectors.sidebarContainer).should('be.visible')
    expectNoHorizontalScroll()

    cy.get(selectors.sidebarToggle).eq(1).click()
    cy.get(selectors.sidebarContainer).should('not.exist')
    cy.get(selectors.mainContent).eq(1).should(($content) => {
      expect($content[0].getBoundingClientRect().width).to.be.closeTo(contentWidth, 2)
    })
  })
})
