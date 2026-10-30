describe('Pane resize handles', () => {

  const apiUrl = Cypress.env('API_URL') || 'http://localhost:8181';
  const collection = `${apiUrl}/example/collections/example.json`;
  const manifest = `${apiUrl}/example/manifests/book2.json`;
  const item = `${apiUrl}/example/items/book2-page1.json`;

  // The image view and two text views side by side, so there are two separation lines between panes.
  const threeViews = [
    { label: 'Image', view: 'image' },
    { label: 'Text', view: 'text', activeContentType: 'transcription' },
    { label: 'Text', view: 'text', activeContentType: 'diplomatic' },
  ]

  const selectors = {
    handle: '[data-pane-resize-handle]',
    itemLabel: '[data-cy="item-label"]',
    panes: '[data-cy="panel-container"] .split-view-view-visible',
    sash: '[data-cy="panel-container"] .sash-container > .sash-vertical',
    viewsMenu: '[data-cy="panel-menu-dropdown"]',
    viewsMenuToggle: '[data-cy="panel-menu"]',
    viewSwitch: '[data-cy="panel-view-toggle"]',
  };

  beforeEach(() => {
    const params = new URLSearchParams()
    params.set('panels[0].collection', collection)
    params.set('panels[0].manifest', manifest)
    params.set('panels[0].item', item)
    threeViews.forEach((view) => params.append('panelViews[]', JSON.stringify(view)))

    cy.visit(`/e2e.html?${params.toString()}`)
    cy.get(selectors.itemLabel).contains('Page 1')
    cy.get(selectors.panes).should('have.length', 3)
  })

  const centerX = (el) => {
    const rect = el.getBoundingClientRect()
    return rect.left + rect.width / 2
  }

  const setView = (index, visible) => {
    cy.get(selectors.viewsMenuToggle).click()
    cy.get(selectors.viewsMenu).should('be.visible')
    cy.get(`${selectors.viewsMenu} ${selectors.viewSwitch}`).eq(index).click()
      .should('have.attr', 'data-state', visible ? 'checked' : 'unchecked')
    cy.get('body').type('{esc}')
    cy.get(selectors.viewsMenu).should('not.exist')
  }

  it('Shows a handle on every separation line between the panes', () => {
    cy.get(selectors.handle).should('have.length', 2).and('be.visible')

    // each handle sits on the line between two panes
    cy.get(selectors.panes).then(($panes) => {
      cy.get(selectors.handle).each(($handle, i) => {
        const lineX = $panes[i].getBoundingClientRect().right
        expect(centerX($handle[0]), `handle ${i}`).to.be.closeTo(lineX, 3)
      })
    })
  })

  it('Removes the handle of a separation line that is gone when a view is hidden', () => {
    setView(0, false)
    cy.get(selectors.panes).should('have.length', 2)
    cy.get(selectors.handle).filter(':visible').should('have.length', 1)

    setView(0, true)
    cy.get(selectors.panes).should('have.length', 3)
    cy.get(selectors.handle).filter(':visible').should('have.length', 2)
  })

  it('Resizes the panes when the handle is dragged', () => {
    cy.get(selectors.panes).first().then(($pane) => {
      const widthBefore = $pane[0].getBoundingClientRect().width

      cy.get(selectors.handle).first().then(($handle) => {
        const rect = $handle[0].getBoundingClientRect()
        const x = rect.left + rect.width / 2
        const y = rect.top + rect.height / 2

        // The handle lets the pointer through to its sash, which does the resizing. The sash captures
        // the pointer, which a simulated pointer does not support, and follows it on the window.
        cy.get(selectors.sash).first()
          .then(($sash) => {
            $sash[0].setPointerCapture = () => {}
            $sash[0].releasePointerCapture = () => {}
          })
          .trigger('pointerdown', { clientX: x, clientY: y, pointerId: 1, button: 0, isPrimary: true })
        cy.window().then((win) => {
          const pointer = { clientX: x + 100, clientY: y, pointerId: 1, isPrimary: true, bubbles: true }
          win.dispatchEvent(new win.PointerEvent('pointermove', pointer))
          win.dispatchEvent(new win.PointerEvent('pointerup', pointer))
        })
      })

      cy.get(selectors.panes).first().should(($resized) => {
        expect($resized[0].getBoundingClientRect().width).to.be.closeTo(widthBefore + 100, 3)
      })
      // the handle moves with the line
      cy.get(selectors.handle).first().should(($handle) => {
        expect(centerX($handle[0])).to.be.closeTo(Cypress.$(selectors.panes)[0].getBoundingClientRect().right, 3)
      })
    })
  })
})
