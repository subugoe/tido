describe('Annotation data errors', () => {

  const apiUrl = Cypress.env('API_URL') || 'http://localhost:8181';
  const manifest = `${apiUrl}/example/manifests/broken-annotations.json`;
  const item = `${apiUrl}/example/items/broken-annotations-page.json`;

  // The item's text is Pride and Prejudice, Chapter 1. Of its seven annotations the first one (#truth)
  // is valid, the next three have an empty, an invalid and a non-matching selector, and the last three
  // have a nested selector: a valid one, one whose outer part only matches outside the text and one
  // none of whose parts are in the text.
  const selectors = {
    selectedTarget: '[data-annotation-selected="true"]',
    sidebarContainer: '[data-sidebar-view]',
    sidebarLoading: '[data-cy="sidebar-loading"]',
    sidebarToggle: '[data-cy="sidebar-toggle"]',
    textContainer: '[data-text-container]',
    textWarning: '[data-text-warning]',
  };

  const cardFor = (annotation) => `[data-annotation="${apiUrl}/example/broken-annotations/${annotation}"]`

  // "Mr. Bennet" (#bennet) sits inside the third paragraph (#para3), so the nested selector
  // "#para3 #bennet" resolves to it.
  const nestedCard = cardFor('annotation-5')
  const nestedTargetSelector = '#bennet'

  // "Netherfield Park" (#netherfield) exists in the text, but the outer part of ".panel #netherfield"
  // only matches TIDO's own panel around the text - the selector is resolved within the text only,
  // so it matches nothing.
  const outsideCard = cardFor('annotation-6')
  const outsideTargetSelector = '#netherfield'

  // Neither #missing-paragraph nor .missing-phrase exists in the text, so
  // "#missing-paragraph .missing-phrase" matches nothing.
  const missingCard = cardFor('annotation-7')
  const missingAnnotationId = `${apiUrl}/example/broken-annotations/annotation-7`

  const openSidebar = () => {
    cy.get(selectors.sidebarToggle).click()
    cy.get(selectors.sidebarContainer).should('be.visible')
    cy.get(selectors.sidebarLoading).should('not.exist')
  }

  beforeEach(() => {
    const params = new URLSearchParams()
    params.set('annotations.defaultMode', 'list')
    params.set('panels[0].manifest', manifest)
    params.set('panels[0].item', item)

    cy.visit(`/e2e.html?${params.toString()}`)
  })

  it('Shows the text despite the broken annotations', () => {
    cy.get(selectors.textContainer).should('contain.text', 'It is a truth universally acknowledged')
  })

  it('Still highlights the targets of the valid annotations', () => {
    cy.get(selectors.textContainer).find('#truth').should('have.class', 'bg-accent')
  })

  it('Tells the visitor that there are problems with the annotations', () => {
    cy.get(selectors.textWarning).should('be.visible').and('not.be.empty')
  })

  it('Hides the warning when it is dismissed', () => {
    cy.get(selectors.textWarning).find('button').click()
    cy.get(selectors.textWarning).should('be.empty')
  })

  it('Finds the target of a nested selector and aligns it when its annotation is selected', () => {
    openSidebar()

    cy.get(nestedCard).should('be.visible')
      .click({ scrollBehavior: false })
      .should('have.attr', 'data-selected', 'true')

    // The element of the last part of the selector is the target, not the paragraph around it.
    cy.get(selectors.textContainer).find(nestedTargetSelector)
      .should('have.attr', 'data-annotation-selected', 'true')
      .and('be.visible')
    cy.get(selectors.textContainer).find('#para3').should('not.have.attr', 'data-annotation-selected')
    cy.get(selectors.textContainer).find(selectors.selectedTarget).should('have.length', 1)
  })

  it('Does not find the target of a nested selector whose outer part only matches outside the text', () => {
    openSidebar()

    // Still listed in the sidebar, so the annotation does not disappear.
    cy.get(outsideCard).should('be.visible')
      .click({ scrollBehavior: false })
      .should('have.attr', 'data-selected', 'true')

    // Not matched at all - neither highlighted as a target nor marked as selected.
    cy.get(selectors.textContainer).find(outsideTargetSelector).should('not.have.attr', 'data-annotation-ids')
    cy.get(selectors.textContainer).find(outsideTargetSelector).should('not.have.attr', 'data-annotation-selected')
    cy.get(selectors.textContainer).find(selectors.selectedTarget).should('not.exist')
    cy.get(selectors.textContainer).its('0.scrollTop').should('equal', 0)
  })

  it('Does not find a target for a nested selector none of whose parts are in the text', () => {
    openSidebar()

    // Still listed in the sidebar, so the annotation does not disappear.
    cy.get(missingCard).should('be.visible')
      .click({ scrollBehavior: false })
      .should('have.attr', 'data-selected', 'true')

    // No element of the text is bound to the annotation, and nothing is marked as selected.
    cy.get(selectors.textContainer).find(`[data-annotation-ids*="${missingAnnotationId}"]`).should('not.exist')
    cy.get(selectors.textContainer).find(selectors.selectedTarget).should('not.exist')
    cy.get(selectors.textContainer).its('0.scrollTop').should('equal', 0)
  })
})
