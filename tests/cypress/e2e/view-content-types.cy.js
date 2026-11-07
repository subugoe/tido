// Every text view carries its own list of content types (panelViews[].contentTypes). The panel
// resolves that list against the content types of the item on every navigation: a configured list
// that the item fully offers is kept, otherwise the view falls back to all content types of the item.

const apiUrl = Cypress.env('API_URL') || 'http://localhost:8181'

const selectors = {
  contentType: '[data-cy="content-type"]',
  contentTypesDropdown: '[data-cy="content-types-dropdown"]',
  contentTypeOption: '[role="menuitemradio"]',
  itemLabel: '[data-cy="item-label"]',
  nextItemButton: '[data-cy="next-item-button"]',
  textContainer: '[data-text-container]',
  popoverReferenceSection: '[data-cy="popover-reference-section"]',
  missingContentTypes: '[data-cy="missing-content-types"]',
  prevItemButton: '[data-cy="prev-item-button"]',
}

const viewParams = (views) => views
  .map((view) => `panelViews[]=${encodeURIComponent(JSON.stringify(view))}`)
  .join('&')

const visit = (params) => cy.visit('/e2e.html?' + params.filter(Boolean).join('&'))

// The menu is rendered in a portal, so it is looked up unscoped - only one menu is open at a time.
const openContentTypes = (viewIndex = 0) => {
  cy.get(selectors.contentType).eq(viewIndex).click()
  return cy.get(selectors.contentTypesDropdown).find(selectors.contentTypeOption)
}

const closeContentTypes = () => {
  cy.get('body').type('{esc}')
  cy.get(selectors.contentTypesDropdown).should('not.exist')
}

const expectOptions = (expected) => {
  cy.get(selectors.contentTypesDropdown).find(selectors.contentTypeOption).as('options')
  cy.get('@options').should('have.length', expected.length)
  expected.forEach(([label, state], i) => {
    cy.get('@options').eq(i)
      .should('contain.text', label)
      .should('have.attr', 'data-state', state)
  })
}

describe('Content types of a text view', () => {

  // 1. The first item has two content types, the second one has three - the same two plus a new
  // one. Without a configured list the view has to grow to the three of the new item instead of
  // keeping the two of the item that was left.
  it('Should extend the content types when navigating to an item with more content types', () => {
    visit([`panels[0].collection=${apiUrl}/example/collections/content-types-superset.json`])

    cy.get(selectors.itemLabel).should('contain.text', 'Two Content Types Page')
    cy.get(selectors.textContainer).find('#superset-page1-diplomatic').should('exist')

    openContentTypes().should('have.length', 2)
    closeContentTypes()

    cy.get(selectors.nextItemButton).click()
    cy.get(selectors.itemLabel).should('contain.text', 'Three Content Types Superset Page')

    // the active content type is still offered by the new item, so it is kept
    cy.get(selectors.textContainer).find('#superset-page2-diplomatic').should('exist')

    openContentTypes()
    expectOptions([
      ['diplomatic', 'checked'],
      ['normalized', 'unchecked'],
      ['translation', 'unchecked'],
    ])

    // the new content type can be selected and its text is loaded
    cy.get(selectors.contentTypesDropdown).contains('translation').click()
    cy.get(selectors.contentTypesDropdown).should('not.exist')
    cy.get(selectors.contentType).should('contain.text', 'translation')
    cy.get(selectors.textContainer).find('#superset-page2-translation').should('exist')
  })

  // 2. The cross reference title names the referenced content type when the referenced item has more
  // than one (Moby-Dick, item "1": transcription, diplomatic, normalized). The body of the first annotation of Pride and Prejudice, chapter 1 (three content types)
  // holds a CrossRef pointing at an annotation on the transcription of Moby-Dick, item "1".
  it('Should show the referenced content type in the cross reference title', () => {
    visit([
      `panels[0].collection=${apiUrl}/example/collections/example.json`,
      'annotations.crossRefContentType=CrossRef',
      viewParams([{ label: 'Text', view: 'text', activeContentType: 'transcription', contentTypes: ['transcription', 'diplomatic', 'normalized'] }]),
    ])

    cy.get(selectors.textContainer).find('#truth').should('exist')
    cy.get('[data-cy="sidebar-toggle"]').click()
    cy.get('[data-sidebar-view]').should('be.visible')
    cy.get('[data-cy="sidebar-loading"]').should('not.exist')

    cy.get(`[data-annotation="${apiUrl}/example/book1/page1/rev1/annotation-1"]`)
      .find('[id="famous-opening-lines"]')
      .click()

    cy.get(selectors.popoverReferenceSection)
      .should('be.visible')
      .and('contain.text', 'Moby-Dick')
      .and('contain.text', ', transcription')
  })

  // 3. Two views, each restricted to a single content type and without an activeContentType - the
  // EUPT setup. Each view shows its own content type as a plain label and only ever loads its own
  // text: neither view must fetch the first content type of the item (transcription) on the way.
  it('Should only load the configured content type of a restricted view', () => {
    const diplomatic = `${apiUrl}/example/html/book2-page1_diplomatic.html`
    const normalized = `${apiUrl}/example/html/book2-page1_normalized.html`
    const transcription = `${apiUrl}/example/html/book2-page1_transcription.html`

    cy.intercept('GET', transcription).as('transcription')

    visit([
      `panels[0].collection=${apiUrl}/example/collections/example.json`,
      `panels[0].manifest=${apiUrl}/example/manifests/book2.json`,
      viewParams([
        { label: 'Diplomatic', view: 'text', contentTypes: ['diplomatic'] },
        { label: 'Normalized', view: 'text', contentTypes: ['normalized'] },
      ]),
    ])

    cy.get(selectors.textContainer).should('have.length', 2)
    cy.get(selectors.textContainer).eq(0).should('have.attr', 'data-content-url', diplomatic)
    cy.get(selectors.textContainer).eq(1).should('have.attr', 'data-content-url', normalized)

    // a single content type is a plain label, so there is nothing to open
    cy.get(selectors.contentType).eq(0).click()
    cy.get(selectors.contentTypesDropdown).should('not.exist')
    cy.get(selectors.contentType).eq(1).click()
    cy.get(selectors.contentTypesDropdown).should('not.exist')

    cy.get('@transcription.all').should('have.length', 0)
  })

  // 4. The view is configured for translation only. The first item of the content types book has
  // just a transcription, so the view shows a notice instead of a text. The second item offers
  // translation, so the configured restriction applies again.
  it('Should show a notice when the item offers none of the configured content types', () => {
    const transcription = `${apiUrl}/example/html/content-types-page1_transcription.html`
    cy.intercept('GET', transcription).as('transcription')

    visit([
      `panels[0].collection=${apiUrl}/example/collections/content-types.json`,
      viewParams([{ label: 'Text', view: 'text', contentTypes: ['translation'] }]),
    ])

    cy.get(selectors.itemLabel).should('contain.text', 'One Content Type Page')
    cy.get(selectors.missingContentTypes)
      .should('be.visible')
      .and('contain.text', 'translation')
    cy.get(selectors.textContainer).find('#page1-transcription').should('not.exist')
    cy.get('@transcription.all').should('have.length', 0)

    // the label of the view is still there, it opens nothing
    cy.get(selectors.contentType).should('contain.text', 'Text').click()
    cy.get(selectors.contentTypesDropdown).should('not.exist')

    cy.get(selectors.nextItemButton).click()
    cy.get(selectors.itemLabel).should('contain.text', 'Three Content Types Page')

    cy.get(selectors.missingContentTypes).should('not.exist')
    cy.get(selectors.textContainer).find('#page2-translation').should('be.visible')

    // translation is the only configured content type, so the view shows its plain label again
    cy.get(selectors.contentType).should('contain.text', 'Text').click()
    cy.get(selectors.contentTypesDropdown).should('not.exist')
  })

  // 5. The view is restricted to two of the three content types of book 2. The content type the
  // user selects survives the navigation, and the menu still offers only the configured two.
  it('Should keep the selected content type and the configured subset when navigating', () => {
    visit([
      `panels[0].collection=${apiUrl}/example/collections/example.json`,
      `panels[0].manifest=${apiUrl}/example/manifests/book2.json`,
      viewParams([{ label: 'Text', view: 'text', contentTypes: ['transcription', 'diplomatic'] }]),
    ])

    cy.get(selectors.itemLabel).should('contain.text', 'Page 1')
    cy.get(selectors.textContainer).find('#ishmael').should('exist')

    openContentTypes()
    expectOptions([
      ['transcription', 'checked'],
      ['diplomatic', 'unchecked'],
    ])
    cy.get(selectors.contentTypesDropdown).contains('diplomatic').click()
    cy.get(selectors.contentTypesDropdown).should('not.exist')
    cy.get(selectors.textContainer)
      .should('have.attr', 'data-content-url', `${apiUrl}/example/html/book2-page1_diplomatic.html`)

    cy.get(selectors.nextItemButton).click()
    cy.get(selectors.itemLabel).should('contain.text', 'Page 2')
    cy.get(selectors.textContainer)
      .should('have.attr', 'data-content-url', `${apiUrl}/example/html/book2-page2_diplomatic.html`)
    cy.get(selectors.textContainer).find('#dipl-shirt').should('exist')

    openContentTypes()
    expectOptions([
      ['transcription', 'unchecked'],
      ['diplomatic', 'checked'],
    ])
  })

  // 6. The configured list decides the order in the menu, not the item: book 2 offers transcription,
  // diplomatic, normalized. The configured list names a content type the item does not offer, which
  // is left out.
  it('Should offer the content types in the configured order', () => {
    visit([
      `panels[0].collection=${apiUrl}/example/collections/example.json`,
      `panels[0].manifest=${apiUrl}/example/manifests/book2.json`,
      viewParams([{ label: 'Text', view: 'text', contentTypes: ['normalized', 'translation', 'transcription'] }]),
    ])

    cy.get(selectors.itemLabel).should('contain.text', 'Page 1')
    // without a configured activeContentType the first configured one the item offers is shown
    cy.get(selectors.textContainer)
      .should('have.attr', 'data-content-url', `${apiUrl}/example/html/book2-page1_normalized.html`)

    openContentTypes()
    expectOptions([
      ['normalized', 'checked'],
      ['transcription', 'unchecked'],
    ])
  })

  // 7. The configured activeContentType is not offered by the first item (superset book, item 1 has
  // diplomatic and normalized), so the view starts on diplomatic. That fallback is no choice of the
  // user: on item 2, which offers translation, the configured content type applies again.
  it('Should apply the configured content type again after a fallback', () => {
    visit([
      `panels[0].collection=${apiUrl}/example/collections/content-types-superset.json`,
      viewParams([{ label: 'Text', view: 'text', activeContentType: 'translation' }]),
    ])

    cy.get(selectors.itemLabel).should('contain.text', 'Two Content Types Page')
    cy.get(selectors.textContainer).find('#superset-page1-diplomatic').should('exist')

    cy.get(selectors.nextItemButton).click()
    cy.get(selectors.itemLabel).should('contain.text', 'Three Content Types Superset Page')
    cy.get(selectors.textContainer).find('#superset-page2-translation').should('exist')
    cy.get(selectors.contentType).should('contain.text', 'translation')
  })

  // 8. The user chooses translation on item 2 of the superset book, over the configured normalized.
  // Item 1 does not offer it, so the view shows the configured content type there - but the choice is
  // kept and applies again on item 2.
  it('Should keep the choice of the user over an item that does not offer it', () => {
    visit([
      `panels[0].collection=${apiUrl}/example/collections/content-types-superset.json`,
      `panels[0].item=${apiUrl}/example/items/content-types-superset-page2.json`,
      `panels[0].manifest=${apiUrl}/example/manifests/content-types-superset.json`,
      viewParams([{ label: 'Text', view: 'text', activeContentType: 'normalized' }]),
    ])

    cy.get(selectors.itemLabel).should('contain.text', 'Three Content Types Superset Page')
    cy.get(selectors.textContainer).find('#superset-page2-normalized').should('exist')

    openContentTypes()
    cy.get(selectors.contentTypesDropdown).contains('translation').click()
    cy.get(selectors.contentTypesDropdown).should('not.exist')
    cy.get(selectors.textContainer).find('#superset-page2-translation').should('exist')

    // item 1 has no translation: the view falls back to the configured content type, not its first one
    cy.get(selectors.prevItemButton).click()
    cy.get(selectors.itemLabel).should('contain.text', 'Two Content Types Page')
    cy.get(selectors.textContainer).find('#superset-page1-normalized').should('exist')

    // back on item 2 the choice of the user applies again
    cy.get(selectors.nextItemButton).click()
    cy.get(selectors.itemLabel).should('contain.text', 'Three Content Types Superset Page')
    cy.get(selectors.textContainer).find('#superset-page2-translation').should('exist')
    cy.get(selectors.contentType).should('contain.text', 'translation')
  })
})
