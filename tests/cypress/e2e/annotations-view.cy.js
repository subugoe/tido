import { panelSelectors } from '../support/panel-helpers'

describe('Annotations view', () => {
  const apiUrl = Cypress.env('API_URL') || 'http://localhost:8181'
  const collection = `${apiUrl}/example/collections/example.json`

  const selectors = {
    ...panelSelectors,
  }

  const visit = (panelViews) => {
    const params = [
      `panels[0].collection=${collection}`,
      ...panelViews.map(view => `panelViews[]=${encodeURIComponent(JSON.stringify(view))}`),
    ]
    cy.visit(`/e2e.html?${params.join('&')}`)
    cy.get(selectors.itemLabel).contains('Page 1')
  }

  // the toggles of the header in their order, by kind of view - retried until the annotations are loaded
  const expectToggleKinds = (kinds) => cy.get(selectors.viewToggles).children()
    .should($toggles => expect([...$toggles].map(t => t.dataset.cy === 'annotations-toggle' ? 'annotations' : 'view')).to.deep.equal(kinds))

  it('Is shown at the position the panel views configure it, with its label', () => {
    visit([
      { view: 'text', label: 'Transcription', activeContentType: 'transcription' },
      { view: 'annotations', label: 'Commentary', visible: true },
      { view: 'text', label: 'Diplomatic', activeContentType: 'diplomatic' },
    ])

    cy.get(selectors.panes).should('have.length', 3)
    cy.get(selectors.panes).eq(1).find(selectors.annotationsView).should('exist')
    cy.get(selectors.annotationsHeader).should('contain.text', 'Commentary')
  })

  it('Opens a panel with its annotations hidden unless the view is visible', () => {
    visit([{ view: 'annotations' }, { view: 'text' }])

    cy.get(selectors.annotationsView).should('not.exist')
    cy.get(selectors.panes).should('have.length', 1)
  })

  it('Has a toggle in the header group at its position, switched like the other views', () => {
    visit([{ view: 'annotations', label: 'Commentary' }, { view: 'text', label: 'Transcription' }])

    expectToggleKinds(['annotations', 'view'])
    // named by the label of the view - in the title and, for screen readers, in its text
    cy.get(selectors.annotationsToggle).should('have.attr', 'title', 'Commentary').and('contain.text', 'Commentary')

    cy.get(selectors.annotationsToggle).should('have.attr', 'data-state', 'off').click()
    cy.get(selectors.annotationsToggle).should('have.attr', 'data-state', 'on')
    cy.get(selectors.panes).first().find(selectors.annotationsView).should('exist')

    cy.get(selectors.annotationsToggle).click()
    cy.get(selectors.annotationsView).should('not.exist')
  })

  it('Lets several views be on at once', () => {
    visit([{ view: 'text', label: 'Transcription' }, { view: 'text', label: 'Diplomatic', activeContentType: 'diplomatic' }, { view: 'annotations' }])

    cy.get(selectors.annotationsToggle).click()
    cy.get(`${selectors.viewToggles} [data-state="on"]`).should('have.length', 3)
    cy.get(selectors.panes).should('have.length', 3)
  })

  it('Never counts as the last open view', () => {
    visit([{ view: 'text', label: 'Transcription' }, { view: 'annotations', visible: true }])

    // switching off the only text view does nothing, even though the annotations are open
    cy.get(selectors.viewToggle).should('have.length', 1).click()
    cy.get(selectors.viewToggle).should('have.attr', 'data-state', 'on')
    cy.get(selectors.annotationsToggle).should('have.attr', 'data-state', 'on')
  })

  it('Leaves the annotations off when the panel views configure none', () => {
    // the annotations of the item - the synopsis annotations of the collection are loaded anyway
    cy.intercept('GET', '**/annotationCollection/book1-page1.json').as('annotations')
    visit([{ view: 'text', label: 'Transcription' }, { view: 'text', label: 'Diplomatic', activeContentType: 'diplomatic' }])

    expectToggleKinds(['view', 'view'])
    cy.get(selectors.annotationsToggle).should('not.exist')
    // nothing is highlighted - the same target is highlighted once the panel has an annotations view.
    // #man is a target in the text of the mock api, data-annotation-ids marks the targets of annotations.
    cy.get(selectors.textContainer).first().find('#man').should('exist').and('not.have.attr', 'data-annotation-ids')
    cy.get('@annotations.all').should('have.length', 0)

    visit([{ view: 'text', label: 'Transcription' }, { view: 'annotations' }])
    cy.get(selectors.textContainer).first().find('#man').should('have.attr', 'data-annotation-ids')
  })
})
