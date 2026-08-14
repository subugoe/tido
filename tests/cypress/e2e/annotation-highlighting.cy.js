describe('Annotation disableHighlighting', () => {

  const apiUrl = Cypress.env('API_URL') || 'http://localhost:8181';
  const collection = `${apiUrl}/example/collections/example.json`;
  const manifest = `${apiUrl}/example/manifests/book1.json`;
  const item = `${apiUrl}/example/items/book1-page1.json`;
  const annotation = (id) => `${apiUrl}/example/book1/page1/rev1/${id}`;

  // Book 1 (Pride and Prejudice) page 1, rendered as a single text view.
  const textView = (activeContentType) => ({
    label: 'Text',
    view: 'text',
    activeContentType,
    contentTypes: ['transcription', 'diplomatic', 'normalized'],
  });

  const selectors = {
    sidebarToggle: '[data-cy="sidebar-toggle"]',
    sidebarContainer: '[data-sidebar-container]',
    textContainer: '[data-text-container]',
  };

  const openPage1 = ({ view = 'transcription', disableHighlighting = [] } = {}) => {
    const params = new URLSearchParams()
    params.set('annotations.defaultMode', 'list')
    params.set('panels[0].collection', collection)
    params.set('panels[0].manifest', manifest)
    params.set('panels[0].item', item)
    params.append('panelViews[]', JSON.stringify(textView(view)))
    disableHighlighting.forEach((type) => params.append('annotations.disableHighlighting[]', type))

    cy.visit(`/e2e.html?${params.toString()}`)
    cy.get('[data-cy="item-label"]').contains('Page 1')
  }

  const target = (selector) => cy.get(selectors.textContainer).find(selector)

  it('Suppresses the base grey highlight only for targets of disabled types', () => {
    openPage1({ disableHighlighting: ['Character'] })

    // #man is only targeted by Historical Context and Economic Context annotations -> both stay
    // enabled, so the merged target keeps its grey highlight. Asserting it first also proves the
    // highlight effect has run before the negative check on #bennet.
    target('#man').should('exist').and('have.class', 'bg-gray-200')

    // #bennet is only targeted by a Character annotation -> its highlight is suppressed.
    target('#bennet').should('exist').and('not.have.class', 'bg-gray-200')
  })

  it('Keeps the click handling and sidebar selection for disabled type targets', () => {
    openPage1({ disableHighlighting: ['Character'] })

    target('#bennet').click()

    cy.get(selectors.sidebarContainer).should('be.visible')
    cy.get(selectors.sidebarContainer)
      .find(`[data-annotation="${annotation('annotation-3')}"]`)
      .should('have.attr', 'data-selected', 'true')

    // The selection highlight is kept even though the base grey is suppressed.
    target('#bennet').should('have.class', 'bg-annotation-selected')
  })

  it('Keeps the hover feedback for disabled type targets', () => {
    openPage1({ disableHighlighting: ['Character'] })

    target('#bennet').trigger('mouseenter')
    target('#bennet').should('have.class', 'bg-annotation-hover').and('not.have.class', 'bg-gray-200')
  })

  it('Renders a grey highlight instead of the border for an enabled target nested in a disabled parent', () => {
    openPage1({ view: 'diplomatic', disableHighlighting: ['Textual Variant'] })

    // ...while the enabled child nested inside it renders the plain grey highlight. Asserting the
    // child first proves the highlight effect has run before the negative check on the parent.
    target('#dipl-however-nested').should('exist').and('have.class', 'bg-gray-200')
    target('#dipl-however').should('exist').and('not.have.class', 'bg-gray-200')

    // Hovering the child keeps it grey instead of applying the nested border.
    target('#dipl-however-nested').trigger('mouseenter')
    target('#dipl-however-nested')
      .should('have.class', 'bg-gray-200')
      .and('not.have.class', 'outline')
      .and('not.have.class', 'bg-annotation-hover')
  })

  it('Keeps the nested border when the parent stays highlighted', () => {
    openPage1({ view: 'diplomatic' })

    target('#dipl-however').should('exist').and('have.class', 'bg-gray-200')

    target('#dipl-however-nested').trigger('mouseenter')
    target('#dipl-however-nested')
      .should('have.class', 'outline')
      .and('have.class', 'bg-annotation-hover')
  })
})
