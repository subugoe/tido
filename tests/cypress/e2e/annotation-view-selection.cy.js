import { panelSelectors } from '../support/panel-helpers'

describe('Annotation annotations view selection', () => {

  const apiUrl = Cypress.env('API_URL') || 'http://localhost:8181';
  const collection = `${apiUrl}/example/collections/example.json`;
  const manifest = `${apiUrl}/example/manifests/book1.json`;
  const item = `${apiUrl}/example/items/book1-page1.json`;
  const annotationId = `${apiUrl}/example/book1/page1/rev1/annotation-3`;

  const selectors = {
    ...panelSelectors,
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
    params.append('panelViews[]', JSON.stringify({ view: 'annotations' }))

    cy.visit(`/e2e.html?${params.toString()}`)
    cy.get('[data-cy="item-label"]').contains('Page 1')
  }

  // #bennet is only targeted by annotation-3 (Character)
  const target = () => cy.get(selectors.textContainer).find('#bennet')

  const selectTarget = () => {
    target().click()
    cy.get(selectors.annotationsView).should('be.visible')
    cy.get(selectors.annotationsView)
      .find(`[data-annotation="${annotationId}"]`)
      .should('have.attr', 'data-selected', 'true')
    target().should('have.class', 'bg-annotation-selected')
  }

  const assertDeselected = () => {
    cy.get(selectors.annotationsView).should('not.exist')
    target().should('not.have.class', 'bg-annotation-selected')

    // reopening the annotations view shows no selected annotation
    cy.get(selectors.annotationsToggle).click()
    cy.get(selectors.annotationsView).should('be.visible')
    cy.get(selectors.annotationsView).find(`[data-annotation="${annotationId}"]`).should('exist')
    cy.get(selectors.annotationsView).find('[data-selected]').should('not.exist')
    target().should('not.have.class', 'bg-annotation-selected')
  }

  beforeEach(() => {
    openPage1()
  })

  it('Opens the closed annotations view and selects the annotation when clicking a target', () => {
    cy.get(selectors.annotationsView).should('not.exist')
    selectTarget()
  })

  it('Deselects the annotation when closing the annotations view with the header toggle', () => {
    selectTarget()
    cy.get(selectors.annotationsToggle).click()
    assertDeselected()
  })

  describe('Annotation popover', () => {
    // #man is targeted by two annotations (Historical and Economic Context), so a click opens the popover
    const popoverTarget = () => cy.get(selectors.textContainer).find('#man')
    const popover = () => cy.get('[data-cy="annotation-popover-content"]')

    it('Styles the clicked target as active while the popover is open', () => {
      popoverTarget().should('have.class', 'bg-accent').and('not.have.class', 'bg-annotation-selected')

      popoverTarget().click()
      popover().should('be.visible')
      popoverTarget().should('have.class', 'bg-annotation-selected').and('not.have.class', 'bg-accent')

      // restyling the targets on a hover change keeps the active style
      target().trigger('mouseenter')
      target().trigger('mouseleave')
      popoverTarget().should('have.class', 'bg-annotation-selected')
    })

    it('Removes the active style when the popover is closed', () => {
      popoverTarget().click()
      popover().should('be.visible')
      popoverTarget().should('have.class', 'bg-annotation-selected')

      cy.get('[data-cy="annotation-popover-close"]').click()
      popover().should('not.exist')
      popoverTarget().should('not.have.class', 'bg-annotation-selected').and('have.class', 'bg-accent')
    })
  })
})
