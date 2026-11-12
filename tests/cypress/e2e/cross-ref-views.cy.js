// A cross reference opened in a new panel has to bring its target on screen. The new panel is built from
// the global panelViews and then the content holding the target is shown (see showContent):
//   - a view already showing it stays as it is (covered in annotation-scroll.cy.js)
//   - else the first text view offering its content type switches to it
//   - else a text view showing it is appended to the panel
//
// The source panel gets views of its own (panels[0].views), local first, so it keeps rendering the
// transcription of Pride and Prejudice whatever the global panelViews say. The body of its first
// annotation holds a CrossRef pointing at the first annotation of Moby-Dick, item "1", whose target
// (#ishmael) lives in the transcription.

const apiUrl = Cypress.env('API_URL') || 'http://localhost:8181'
const collection = `${apiUrl}/example/collections/example.json`

const selectors = {
  panel: '[data-cy="panel"]',
  popover: '[data-slot="popover-content"]',
  sidebarToggle: '[data-cy="sidebar-toggle"]',
  sidebarContainer: '[data-sidebar-view]',
  sidebarLoading: '[data-cy="sidebar-loading"]',
  textContainer: '[data-text-container]',
  contentType: '[data-cy="content-type"]',
  contentTypesDropdown: '[data-cy="content-types-dropdown"]',
  contentTypeOption: '[role="menuitemradio"]',
}

const crossRefSourceCard = `[data-annotation="${apiUrl}/example/book1/page1/rev1/annotation-1"]`
const crossRefSpan = '[id="famous-opening-lines"]'
const crossRefSourceTarget = '#truth'
const ishmaelCard = `[data-annotation="${apiUrl}/example/book2/page1/rev1/annotation-1"]`
const ishmaelTargetSelector = '#ishmael'
// Only the diplomatic text of Moby-Dick, item "1", carries the original spelling note
const diplomaticOnly = '#dipl-note'

const sourcePanelViews = [{ label: 'Text', view: 'text', activeContentType: 'transcription', contentTypes: ['transcription'] }]

const viewParams = (key, views) => views
  .map((view) => `${key}[]=${encodeURIComponent(JSON.stringify(view))}`)
  .join('&')

const visit = (globalViews = []) => cy.visit('/e2e.html?' + [
  'annotations.crossRefContentType=CrossRef',
  `panels[0].collection=${collection}`,
  viewParams('panels[0].views', sourcePanelViews),
  viewParams('panelViews', globalViews),
].filter(Boolean).join('&'))

const secondPanel = () => cy.get(selectors.panel).eq(1)

// Opens the cross reference of the source panel in a new panel and waits for the referenced item
const openCrossRefInNewPanel = () => {
  cy.get(selectors.panel).should('have.length', 1)
  cy.get(selectors.textContainer).eq(0).find(crossRefSourceTarget).should('exist')

  cy.get(selectors.sidebarToggle).click()
  cy.get(selectors.sidebarContainer).should('be.visible')
  cy.get(selectors.sidebarLoading).should('not.exist')

  cy.get(crossRefSourceCard).find(crossRefSpan).click()
  cy.get(selectors.popover).should('be.visible').contains('button', 'Open in new Panel').click()
  cy.get(selectors.popover).should('not.exist')

  cy.get(selectors.panel).should('have.length', 2)
  secondPanel().find('[data-cy="manifest-label"]').should('contain.text', 'Moby-Dick')
  secondPanel().find('[data-cy="item-label"]').should('contain.text', 'Page 1')
}

// The options of the content type menu of a view in the new panel - the menu is rendered in a portal
const expectOptions = (viewIndex, expected) => {
  secondPanel().find(selectors.contentType).eq(viewIndex).click()
  cy.get(selectors.contentTypesDropdown).find(selectors.contentTypeOption).as('options')
  cy.get('@options').should('have.length', expected.length)
  expected.forEach(([label, state], i) => {
    cy.get('@options').eq(i)
      .should('contain.text', label)
      .should('have.attr', 'data-state', state)
  })
  cy.get('body').type('{esc}')
  cy.get(selectors.contentTypesDropdown).should('not.exist')
}

describe('Cross reference views of a new panel', () => {

  // 1. The only global view shows the diplomatic text but offers every content type of the item, so it is
  // the first view offering the transcription: it switches to it instead of a view being appended.
  it('Should switch the first view offering the content type of the target to it', () => {
    visit([{ label: 'Text', view: 'text', activeContentType: 'diplomatic' }])
    openCrossRefInNewPanel()

    // a. The panel keeps its single view, now showing the transcription
    secondPanel().find(selectors.textContainer).should('have.length', 1)
    secondPanel().find(selectors.contentType).should('have.length', 1).and('contain.text', 'transcription')
    secondPanel().find(selectors.textContainer).eq(0).find(diplomaticOnly).should('not.exist')

    // b. The target is in that view and selected, together with its annotation in the sidebar
    secondPanel().find(ishmaelCard).should('have.attr', 'data-selected', 'true')
    secondPanel().find(selectors.textContainer).eq(0).find(ishmaelTargetSelector)
      .should('have.attr', 'data-annotation-selected', 'true')

    // c. The view still offers every content type of the item, the transcription being the chosen one
    expectOptions(0, [
      ['transcription', 'checked'],
      ['diplomatic', 'unchecked'],
      ['normalized', 'unchecked'],
    ])

    // d. The source panel is left alone
    cy.get(selectors.panel).eq(0).find(selectors.textContainer).should('have.length', 1)
      .find(crossRefSourceTarget).should('exist')
  })

  // 2. The only global view is restricted to the diplomatic text, so no view offers the transcription: a
  // text view showing it is appended after the configured one.
  it('Should append a text view showing the target when no view offers its content type', () => {
    visit([{ label: 'Text', view: 'text', activeContentType: 'diplomatic', contentTypes: ['diplomatic'] }])
    openCrossRefInNewPanel()

    // a. The configured view is kept as it is - a single content type, so it shows its label only - and
    // the appended one, labelled with the content type it was appended for, comes after it
    secondPanel().find(selectors.textContainer).should('have.length', 2)
    secondPanel().find(selectors.contentType).eq(0).should('contain.text', 'Text')
    secondPanel().find(selectors.textContainer).eq(0).find(diplomaticOnly).should('exist')
    secondPanel().find(selectors.contentType).eq(1).should('contain.text', 'transcription')
    secondPanel().find(selectors.textContainer).eq(1).find(diplomaticOnly).should('not.exist')
    secondPanel().find(selectors.textContainer).eq(0).find(ishmaelTargetSelector)
      .should('not.have.attr', 'data-annotation-selected')

    // b. The target is in the appended view and selected, together with its annotation in the sidebar
    secondPanel().find(ishmaelCard).should('have.attr', 'data-selected', 'true')
    secondPanel().find(selectors.textContainer).eq(1).find(ishmaelTargetSelector)
      .should('have.attr', 'data-annotation-selected', 'true')

    // c. The appended view has no configuration, so it offers every content type of the item
    expectOptions(1, [
      ['transcription', 'checked'],
      ['diplomatic', 'unchecked'],
      ['normalized', 'unchecked'],
    ])

    // d. The source panel is left alone
    cy.get(selectors.panel).eq(0).find(selectors.textContainer).should('have.length', 1)
  })
})

// "had not" in the transcription of Pride and Prejudice is the target of a CrossRef pointing straight into
// the diplomatic text of Moby-Dick, item "1": #dipl-phantom, in its last paragraph - far enough down that
// the text has to be scrolled to reach it.
describe('Cross reference opened in this panel', () => {

  const crossRefTarget = '#had-not'
  const referencedTarget = '#dipl-phantom'

  // The source panel shows the transcription only, so none of its views offers the diplomatic text: a text
  // view showing it is appended to the right of the panel's view, and the text is scrolled to the target.
  it('Should append a text view showing the referenced content and scroll to the target', () => {
    visit()
    cy.get(selectors.textContainer).eq(0).find(crossRefSourceTarget).should('exist')

    cy.get(selectors.textContainer).eq(0).find(crossRefTarget).click()
    cy.get(selectors.popover).should('be.visible').within(() => {
      cy.contains('p', 'Moby-Dick').should('exist')
      cy.get('[data-cy="popover-reference-section"]').should('contain.text', ', diplomatic')
    })
    cy.get(selectors.popover).contains('button', 'Open in this Panel').click()
    cy.get(selectors.popover).should('not.exist')

    // a. The same panel goes to the referenced item - no new panel is opened
    cy.get(selectors.panel).should('have.length', 1)
    cy.get('[data-cy="manifest-label"]').should('contain.text', 'Moby-Dick')
    cy.get('[data-cy="item-label"]').should('contain.text', 'Page 1')

    // b. The panel's own view keeps the transcription, the appended view to its right shows the diplomatic text
    cy.get(selectors.textContainer).should('have.length', 2)
    cy.get(selectors.contentType).eq(0).should('contain.text', 'Text')
    cy.get(selectors.textContainer).eq(0).find(diplomaticOnly).should('not.exist')
    cy.get(selectors.contentType).eq(1).should('contain.text', 'diplomatic')
    cy.get(selectors.textContainer).eq(1).find(diplomaticOnly).should('exist')

    // c. The appended view scrolled down to the target, which is marked as the referenced element
    cy.get(selectors.textContainer).eq(1).find(referencedTarget).should('have.class', 'bg-yellow-200')
    cy.get(selectors.textContainer).eq(1).its('0.scrollTop').should('be.greaterThan', 0)
    cy.get(selectors.textContainer).eq(1).should(($container) => {
      const container = $container[0].getBoundingClientRect()
      const target = $container[0].querySelector(referencedTarget).getBoundingClientRect()
      expect(target.top, 'target below the top of the view').to.be.at.least(container.top)
      expect(target.bottom, 'target above the bottom of the view').to.be.at.most(container.bottom)
    })
  })
})

// Cross references hanging off a span inside the body of an annotation card in the sidebar of Pride and
// Prejudice, chapter 1 - both pointing into the diplomatic text of Moby-Dick, item "1", which the
// transcription only views of the panels do not offer, so a view showing it is appended:
//   - "neighbourhood in Regency England ..." (annotation-6) points at a text: #dipl-phantom
//   - "a node in the novel's information network" (annotation-10, "Mrs. Long") points at an annotation:
//     annotation-diplomatic-3, whose target #dipl-crowds sits halfway down the diplomatic text
describe('Cross reference in an annotation', () => {

  const textRef = {
    card: `[data-annotation="${apiUrl}/example/book1/page1/rev1/annotation-6"]`,
    span: '[id="neighbourhood-visiting"]',
    target: '#dipl-phantom',
  }
  const annotationRef = {
    card: `[data-annotation="${apiUrl}/example/book1/page1/rev1/annotation-10"]`,
    span: '[id="information-network"]',
    target: '#dipl-crowds',
    referencedCard: `[data-annotation="${apiUrl}/example/book2/page1/rev1/annotation-diplomatic-3"]`,
  }

  const panelAt = (index) => cy.get(selectors.panel).eq(index)

  // Both panels - the source one and a new one - show the transcription only, in aligned mode
  const visitInAnnotation = () => cy.visit('/e2e.html?' + [
    'annotations.crossRefContentType=CrossRef',
    'annotations.defaultMode=aligned',
    `panels[0].collection=${collection}`,
    viewParams('panels[0].views', sourcePanelViews),
    viewParams('panelViews', sourcePanelViews),
  ].join('&'))

  // Clicks the span in the card of the source panel and picks the given action of the popover
  const openCrossRef = ({ card, span }, action) => {
    cy.get(selectors.textContainer).eq(0).find(crossRefSourceTarget).should('exist')
    cy.get(selectors.sidebarToggle).click()
    cy.get(selectors.sidebarContainer).should('be.visible')
    cy.get(selectors.sidebarLoading).should('not.exist')

    cy.get(card).find(span).click()
    cy.get(selectors.popover).should('be.visible').within(() => {
      cy.contains('p', 'Moby-Dick').should('exist')
      cy.get('[data-cy="popover-reference-section"]').should('contain.text', ', diplomatic')
    })
    cy.get(selectors.popover).contains('button', action).click()
    cy.get(selectors.popover).should('not.exist')
  }

  // The panel went to Moby-Dick, item "1": its transcription view stays, a diplomatic view is appended to it
  const expectAppendedDiplomaticView = (panelIndex) => {
    panelAt(panelIndex).find('[data-cy="manifest-label"]').should('contain.text', 'Moby-Dick')
    panelAt(panelIndex).find('[data-cy="item-label"]').should('contain.text', 'Page 1')
    panelAt(panelIndex).find(selectors.textContainer).should('have.length', 2)
    panelAt(panelIndex).find(selectors.contentType).eq(0).should('contain.text', 'Text')
    panelAt(panelIndex).find(selectors.textContainer).eq(0).find(diplomaticOnly).should('not.exist')
    panelAt(panelIndex).find(selectors.contentType).eq(1).should('contain.text', 'diplomatic')
    panelAt(panelIndex).find(selectors.textContainer).eq(1).find(diplomaticOnly).should('exist')
  }

  // The appended view scrolled down to the target, which lies fully within it
  const expectScrolledTo = (panelIndex, target) => {
    panelAt(panelIndex).find(selectors.textContainer).eq(1).its('0.scrollTop').should('be.greaterThan', 0)
    panelAt(panelIndex).find(selectors.textContainer).eq(1).should(($container) => {
      const container = $container[0].getBoundingClientRect()
      const targetRect = $container[0].querySelector(target).getBoundingClientRect()
      expect(targetRect.top, 'target below the top of the view').to.be.at.least(container.top)
      expect(targetRect.bottom, 'target above the bottom of the view').to.be.at.most(container.bottom)
    })
  }

  // The referenced annotation is selected in the sidebar, its target in the appended view, and both sit
  // on the same y position
  const expectReferencedAnnotationSelected = (panelIndex) => {
    panelAt(panelIndex).find(annotationRef.referencedCard).should('have.attr', 'data-selected', 'true')
    panelAt(panelIndex).find(selectors.textContainer).eq(1).find(annotationRef.target)
      .should('have.attr', 'data-annotation-selected', 'true')
    expectScrolledTo(panelIndex, annotationRef.target)
    panelAt(panelIndex).should(($panel) => {
      const cardY = $panel[0].querySelector(annotationRef.referencedCard).getBoundingClientRect().top
      const targetY = $panel[0].querySelectorAll(selectors.textContainer)[1].querySelector(annotationRef.target).getBoundingClientRect().top
      expect(cardY, `card y ${cardY} vs target y ${targetY}`).to.be.closeTo(targetY, 1)
    })
  }

  describe('pointing at a text', () => {

    it('Should append a view showing the referenced text to this panel and scroll to the target', () => {
      visitInAnnotation()
      openCrossRef(textRef, 'Open in this Panel')

      cy.get(selectors.panel).should('have.length', 1)
      expectAppendedDiplomaticView(0)
      panelAt(0).find(selectors.textContainer).eq(1).find(textRef.target).should('have.class', 'bg-yellow-200')
      expectScrolledTo(0, textRef.target)
    })

    it('Should open a new panel with a view showing the referenced text appended and scroll to the target', () => {
      visitInAnnotation()
      openCrossRef(textRef, 'Open in new Panel')

      cy.get(selectors.panel).should('have.length', 2)
      expectAppendedDiplomaticView(1)
      panelAt(1).find(selectors.textContainer).eq(1).find(textRef.target).should('have.class', 'bg-yellow-200')
      expectScrolledTo(1, textRef.target)

      // the source panel is left alone
      panelAt(0).find(selectors.textContainer).should('have.length', 1).find(crossRefSourceTarget).should('exist')
    })
  })

  describe('pointing at an annotation', () => {

    it('Should append a view showing the text of the referenced annotation to this panel, select it and align it with its target', () => {
      visitInAnnotation()
      openCrossRef(annotationRef, 'Open in this Panel')

      cy.get(selectors.panel).should('have.length', 1)
      expectAppendedDiplomaticView(0)
      expectReferencedAnnotationSelected(0)
    })

    it('Should open a new panel with a view showing the text of the referenced annotation appended, select it and align it with its target', () => {
      visitInAnnotation()
      openCrossRef(annotationRef, 'Open in new Panel')

      cy.get(selectors.panel).should('have.length', 2)
      expectAppendedDiplomaticView(1)
      expectReferencedAnnotationSelected(1)

      // the source panel is left alone
      panelAt(0).find(selectors.textContainer).should('have.length', 1).find(crossRefSourceTarget).should('exist')
    })
  })
})
