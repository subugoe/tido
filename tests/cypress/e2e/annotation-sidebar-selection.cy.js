describe('Annotation sidebar selection', () => {

  const apiUrl = Cypress.env('API_URL') || 'http://localhost:8181';
  const collection = `${apiUrl}/example/collections/example.json`;
  const manifest = `${apiUrl}/example/manifests/book1.json`;
  const item = `${apiUrl}/example/items/book1-page1.json`;
  const annotationId = `${apiUrl}/example/book1/page1/rev1/annotation-3`;

  const selectors = {
    sidebarToggle: '[data-cy="sidebar-toggle"]',
    closeSidebar: '[data-cy="close-sidebar"]',
    sidebarContainer: '[data-sidebar-view]',
    textContainer: '[data-text-container]',
  };

  const openPage1 = () => {
    const params = new URLSearchParams()
    params.set('annotations.defaultMode', 'list')
    params.set('panels[0].collection', collection)
    params.set('panels[0].manifest', manifest)
    params.set('panels[0].item', item)
    params.append('panelViews[]', JSON.stringify({
      label: 'Text',
      view: 'text',
      activeContentType: 'transcription',
      contentTypes: ['transcription', 'diplomatic', 'normalized'],
    }))

    cy.visit(`/e2e.html?${params.toString()}`)
    cy.get('[data-cy="item-label"]').contains('Page 1')
  }

  // #bennet is only targeted by annotation-3 (Character)
  const target = () => cy.get(selectors.textContainer).find('#bennet')

  const selectTarget = () => {
    target().click()
    cy.get(selectors.sidebarContainer).should('be.visible')
    cy.get(selectors.sidebarContainer)
      .find(`[data-annotation="${annotationId}"]`)
      .should('have.attr', 'data-selected', 'true')
    target().should('have.class', 'bg-annotation-selected')
  }

  const assertDeselected = () => {
    cy.get(selectors.sidebarContainer).should('not.exist')
    target().should('not.have.class', 'bg-annotation-selected')

    // reopening the sidebar shows no selected annotation
    cy.get(selectors.sidebarToggle).click()
    cy.get(selectors.sidebarContainer).should('be.visible')
    cy.get(selectors.sidebarContainer).find(`[data-annotation="${annotationId}"]`).should('exist')
    cy.get(selectors.sidebarContainer).find('[data-selected]').should('not.exist')
    target().should('not.have.class', 'bg-annotation-selected')
  }

  beforeEach(() => {
    openPage1()
  })

  it('Opens the closed sidebar and selects the annotation when clicking a target', () => {
    cy.get(selectors.sidebarContainer).should('not.exist')
    selectTarget()
  })

  it('Deselects the annotation when closing the sidebar with the header toggle', () => {
    selectTarget()
    cy.get(selectors.sidebarToggle).click()
    assertDeselected()
  })

  it('Deselects the annotation when closing the sidebar with its close button', () => {
    selectTarget()
    cy.get(selectors.closeSidebar).click()
    assertDeselected()
  })
})
