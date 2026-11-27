import { panelSelectors } from '../support/panel-helpers'

// The view toggles in the panel header: one segment per pane, the annotations among them.
describe('View toggles', () => {
  const apiUrl = Cypress.env('API_URL') || 'http://localhost:8181'
  const collection = `${apiUrl}/example/collections/example.json`

  const selectors = {
    ...panelSelectors,
    status: '[data-cy="panel-views-status"]',
    annotation: '[data-annotations-scroll-container] [data-annotation]',
  }

  // the panel views get their annotations view last when they configure none - every case here has annotations
  const visit = (panelViews) => {
    const views = panelViews.some(view => view.view === 'annotations') ? panelViews : [...panelViews, { view: 'annotations' }]
    const params = [
      `panels[0].collection=${collection}`,
      ...views.map(view => `panelViews[]=${encodeURIComponent(JSON.stringify(view))}`),
    ]
    cy.visit(`/e2e.html?${params.join('&')}`)
    cy.get(selectors.itemLabel).contains('Page 1')
  }

  // The ".main-content" element is the container-query root ("@container/panel"), so it is resized
  // together with the panel shell (width minus the 2px of border).
  const resizePanel = (width) => cy.get(selectors.panel).first()
    .invoke('css', 'width', `${width}px`)
    .find('.main-content')
    .invoke('css', 'width', `${width - 2}px`)

  // the name of a segment is only for screen readers in narrow panels
  const expectNamesShown = (shown) => cy.get(`${selectors.viewToggles} button span`).each($span => {
    expect(getComputedStyle($span[0]).position).to.equal(shown ? 'static' : 'absolute')
  })

  describe('with two views showing the same content', () => {
    beforeEach(() => {
      visit([
        { view: 'text', label: 'Text', activeContentType: 'transcription' },
        { view: 'text', label: 'Text', activeContentType: 'transcription' },
      ])
      // the annotations of the text are matched - their toggle can be switched on
      cy.get(selectors.annotationsToggle).should('not.be.disabled')
    })

    it('Keeps the annotations toggle enabled while one of the views is hidden and shown again', () => {
      cy.get(selectors.viewToggle).eq(0).click()
      cy.get(selectors.viewToggle).eq(0).should('have.attr', 'data-state', 'off')
      cy.get(selectors.annotationsToggle).should('not.be.disabled')

      cy.get(selectors.viewToggle).eq(0).click()
      cy.get(selectors.viewToggle).eq(1).click()
      cy.get(selectors.viewToggle).eq(1).should('have.attr', 'data-state', 'off')
      cy.get(selectors.annotationsToggle).should('not.be.disabled')
    })

    it('Lists the annotations of the visible view while the other one is hidden', () => {
      cy.get(selectors.annotationsToggle).click()
      cy.get(selectors.annotation).its('length').then((count) => {
        cy.get(selectors.viewToggle).eq(0).click()
        cy.get(selectors.annotation).should('have.length', count)

        cy.get(selectors.viewToggle).eq(0).click()
        cy.get(selectors.viewToggle).eq(1).click()
        cy.get(selectors.annotation).should('have.length', count)
      })
    })
  })

  it('Lists the annotations of a view that was hidden when the panel opened, once it is shown', () => {
    visit([
      { view: 'text', label: 'Transcription', activeContentType: 'transcription' },
      { view: 'text', label: 'Diplomatic', activeContentType: 'diplomatic', visible: false },
    ])
    cy.get(selectors.annotationsToggle).click()

    cy.get(selectors.annotation).its('length').then((transcriptionOnly) => {
      cy.get(selectors.viewToggle).eq(1).click()
      cy.get(selectors.annotation).should('have.length.greaterThan', transcriptionOnly)
    })
  })

  it('Keeps the annotations of a view when a view showing the same content was hidden when the panel opened', () => {
    visit([
      { view: 'text', label: 'Text', activeContentType: 'transcription' },
      { view: 'text', label: 'Text', activeContentType: 'transcription', visible: false },
    ])

    cy.get(selectors.annotationsToggle).should('not.be.disabled').click()
    cy.get(selectors.annotation).should('have.length.greaterThan', 0)
  })

  describe('with the aligned annotations open next to an image and two texts', () => {
    const loading = '[data-cy="annotations-loading"]'
    const toggle = (title) => cy.get(`${selectors.viewToggle}[title="${title}"]`)

    beforeEach(() => {
      visit([
        { view: 'image', label: 'Image' },
        { view: 'text', label: 'Transcription', activeContentType: 'transcription' },
        { view: 'text', label: 'Diplomatic', activeContentType: 'diplomatic' },
        { view: 'annotations', visible: true },
      ])
      cy.get(selectors.annotation).should('have.length.greaterThan', 0)
      cy.get(loading).should('not.exist')
    })

    it('Aligns the annotations again when a text is shown after all texts were switched off', () => {
      toggle('Transcription').click()
      toggle('Diplomatic').click()
      cy.get(selectors.annotation).should('not.exist')

      toggle('Diplomatic').click()
      cy.get(selectors.annotation).should('have.length.greaterThan', 0)
      cy.get(loading).should('not.exist')
    })

    it('Aligns the annotations when the first text is switched off', () => {
      toggle('Transcription').click()
      cy.get(selectors.annotation).should('have.length.greaterThan', 0)
      cy.get(loading).should('not.exist')
    })
  })

  it('Shows the number of the listed annotations next to the label in the annotations header', () => {
    visit([
      { view: 'text', label: 'Transcription', activeContentType: 'transcription' },
      { view: 'text', label: 'Diplomatic', activeContentType: 'diplomatic' },
      { view: 'annotations', label: 'Commentary', visible: true },
    ])
    const count = '[data-cy="annotations-header"] [data-cy="annotations-count"]'

    cy.get('[data-cy="annotations-header"]').should('contain.text', 'Commentary')
    cy.get(selectors.annotation).its('length').then((both) => {
      cy.get(count).should('have.text', String(both))

      // hiding a text drops its annotations from the list and the count
      cy.get(selectors.viewToggle).eq(1).click()
      cy.get(selectors.annotation).its('length').should('be.lessThan', both).then((transcriptionOnly) => {
        cy.get(count).should('have.text', String(transcriptionOnly))
      })
    })
  })

  it('Tells that one view stays visible when the last one is switched off', () => {
    visit([{ view: 'text', label: 'Transcription' }, { view: 'annotations', visible: true }])

    cy.get(selectors.status).should('be.empty')
    cy.get(selectors.viewToggle).click()
    cy.get(selectors.viewToggle).should('have.attr', 'data-state', 'on')
    cy.get(selectors.status).should('have.text', 'At least one view stays visible.')
  })

  it('Shows the icons of the views in panels narrower than 1000px and their names from 1000px on', () => {
    visit([{ view: 'text', label: 'Transcription' }, { view: 'text', label: 'Diplomatic', activeContentType: 'diplomatic' }])

    resizePanel(900)
    expectNamesShown(false)
    // the name stays in the title
    cy.get(selectors.viewToggle).eq(0).should('have.attr', 'title', 'Transcription')

    resizePanel(1100)
    expectNamesShown(true)
    cy.get(selectors.viewToggle).eq(0).should('contain.text', 'Transcription')
  })

  it('Keeps the width and the position of a segment when it is switched', () => {
    visit([{ view: 'text', label: 'Transcription' }, { view: 'text', label: 'Diplomatic', activeContentType: 'diplomatic' }])
    resizePanel(1100)

    cy.get(selectors.viewToggle).eq(1).then(($segment) => {
      const before = $segment[0].getBoundingClientRect()
      const name = $segment[0].querySelector('span').getBoundingClientRect()

      cy.wrap($segment).click()
      cy.get(selectors.viewToggle).eq(1).should('have.attr', 'data-state', 'off').then(($switched) => {
        const after = $switched[0].getBoundingClientRect()
        expect(after.left).to.be.closeTo(before.left, 0.5)
        expect(after.width).to.be.closeTo(before.width, 0.5)
        expect($switched[0].querySelector('span').getBoundingClientRect().left).to.be.closeTo(name.left, 0.5)
      })
    })
  })
})
