describe('Panel views width ratio', () => {

  const apiUrl = Cypress.env('API_URL') || 'http://localhost:8181';
  const collection = `${apiUrl}/example/collections/example.json`;
  const manifest = `${apiUrl}/example/manifests/book2.json`;
  const item = `${apiUrl}/example/items/book2-page1.json`;

  // Every item of the manifest has an image, so the panel shows the default image and text views.
  const selectors = {
    itemLabel: '[data-cy="item-label"]',
    nextItemButton: '[data-cy="next-item-button"]',
    panes: '[data-cy="panel-container"] .split-view-view',
  };

  const visitWithRatio = (ratio) => {
    const params = new URLSearchParams()
    params.set('panels[0].collection', collection)
    params.set('panels[0].manifest', manifest)
    params.set('panels[0].item', item)
    ratio.forEach((value) => params.append('panels[0].viewsWidthRatio[]', String(value)))

    cy.visit(`/e2e.html?${params.toString()}`)
    cy.get(selectors.itemLabel).contains('Page 1')
  }

  // The share of the panes' total width each pane takes, in pane order.
  const expectPaneShares = (shares) => {
    cy.get(selectors.panes).should(($panes) => {
      const widths = [...$panes].map((pane) => pane.getBoundingClientRect().width)
      const total = widths.reduce((sum, width) => sum + width, 0)

      expect(widths, 'panes').to.have.length(shares.length)
      shares.forEach((share, i) => {
        expect(widths[i] / total, `share of pane ${i}`).to.be.closeTo(share, 0.02)
      })
    })
  }

  it('Gives each view its share of the panel width', () => {
    visitWithRatio([1, 3])
    expectPaneShares([0.25, 0.75])
  })

  it('Keeps the ratio when navigating to another item', () => {
    visitWithRatio([1, 3])
    expectPaneShares([0.25, 0.75])

    cy.get(selectors.nextItemButton).click()
    cy.get(selectors.itemLabel).contains('Page 2')

    expectPaneShares([0.25, 0.75])
  })

  it('Gives the views equal widths when the ratio does not fit the views', () => {
    visitWithRatio([1, 2, 3])
    expectPaneShares([0.5, 0.5])
  })
})
