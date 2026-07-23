describe('Scroll positions across content type and item changes', () => {

  const apiUrl = Cypress.env('API_URL') || 'http://localhost:8181';
  const collection = `${apiUrl}/example/collections/example.json`;
  const manifest = `${apiUrl}/example/manifests/book2.json`;

  // Both views open on the transcription, so each one starts from the same text and can be scrolled
  // and switched independently of the other.
  const twoTranscriptionViews = [
    { label: 'Text', view: 'text', activeContentType: 'transcription', contentTypes: ['transcription', 'diplomatic', 'normalized'] },
    { label: 'Text', view: 'text', activeContentType: 'transcription', contentTypes: ['transcription', 'diplomatic', 'normalized'] },
  ]

  // Moby-Dick, first item. The manifest is named explicitly, so the panel opens on Chapter 1 rather
  // than on the first manifest of the collection.
  const config = `panels[0].collection=${collection}&panels[0].manifest=${manifest}`
    + twoTranscriptionViews
      .map((view) => `&panelViews[]=${encodeURIComponent(JSON.stringify(view))}`)
      .join('')

  const chapter1 = {
    label: 'Moby-Dick, Chapter 1 - Loomings',
    ready: '#ishmael',
  }
  // The item the next arrow moves on to.
  const chapter2 = {
    label: 'Moby-Dick, Chapter 2 - The Carpet-Bag',
    ready: '#carpet-bag',
  }

  const selectors = {
    contentType: '[data-cy="content-type"]',
    contentTypesDropdown: '[data-cy="content-types-dropdown"]',
    itemLabel: '[data-cy="item-label"]',
    nextItemButton: '[data-cy="next-item-button"]',
    textContainer: '[data-text-container]',
  }

  // Scrolls one of the two views down by the given fraction of its own visible height, so the view
  // is left at a known position rather than wherever a target happens to sit.
  const scrollViewTo = (index, fraction) => {
    cy.get(selectors.textContainer).eq(index).then(($container) => {
      const container = $container[0]
      cy.wrap(container).scrollTo(0, container.clientHeight * fraction, { duration: 500 })
    })

    cy.get(selectors.textContainer).eq(index).should(($container) => {
      const container = $container[0]
      expect(container.scrollTop, `view ${index} is scrolled to ${fraction * 100}% of its height`)
        .to.be.closeTo(container.clientHeight * fraction, 2)
    })
  }

  // The content type menu is rendered in a portal, hence the unscoped gets - only one menu is open
  // at a time.
  const switchContentType = (index, contentType) => {
    cy.get(selectors.contentType).eq(index).click()
    cy.get(selectors.contentTypesDropdown).contains(contentType).click()
    cy.get(selectors.contentTypesDropdown).should('not.exist')
  }

  beforeEach(() => {
    cy.visit('/e2e.html?' + config)
    cy.get(selectors.itemLabel).contains(chapter1.label)
    cy.get(selectors.textContainer).should('have.length', 2)
    cy.get(selectors.textContainer).eq(1).find(chapter1.ready).should('exist')
  })

  it('Should keep the scroll position of both views when one switches its content type', () => {
    // Two different positions, so neither view can be confused with the other.
    scrollViewTo(0, 0.75)
    scrollViewTo(1, 0.5)

    cy.get(selectors.textContainer).eq(0).its('0.scrollTop').as('leftScrollTop')
    cy.get(selectors.textContainer).eq(1).its('0.scrollTop').as('rightScrollTop')

    switchContentType(1, 'diplomatic')

    // The label flips as soon as the content type is picked, so wait for the diplomatic text itself
    // to be in the view before reading any scroll position.
    cy.get(selectors.contentType).eq(1).should('contain.text', 'diplomatic')
    cy.get(selectors.textContainer).eq(1).find('#dipl-note').should('exist')

    // The left view is untouched and still shows the transcription.
    cy.get(selectors.contentType).eq(0).should('contain.text', 'transcription')
    cy.get(selectors.textContainer).eq(0).find('#dipl-note').should('not.exist')

    // The new content type is shown from the position the previous one was left at ...
    cy.get('@rightScrollTop').then((rightScrollTop) => {
      expect(rightScrollTop, 'the right view was scrolled before switching').to.be.greaterThan(0)

      cy.get(selectors.textContainer).eq(1).its('0.scrollTop').should('equal', rightScrollTop)
    })

    // ... and the view that was not switched has not moved either.
    cy.get('@leftScrollTop').then((leftScrollTop) => {
      expect(leftScrollTop, 'the left view was scrolled before switching').to.be.greaterThan(0)

      cy.get(selectors.textContainer).eq(0).its('0.scrollTop').should('equal', leftScrollTop)
    })

    // The same holds for the left view once it switches too: it keeps the position it was left at,
    // which is a different one from the view that switched first.
    switchContentType(0, 'diplomatic')

    cy.get(selectors.contentType).eq(0).should('contain.text', 'diplomatic')
    cy.get(selectors.textContainer).eq(0).find('#dipl-note').should('exist')

    cy.get('@leftScrollTop').then((leftScrollTop) => {
      cy.get(selectors.textContainer).eq(0).its('0.scrollTop').should('equal', leftScrollTop)
    })

    cy.get('@rightScrollTop').then((rightScrollTop) => {
      cy.get(selectors.textContainer).eq(1).its('0.scrollTop').should('equal', rightScrollTop)
    })
  })

  it('Should reset the scroll position of both views when a new item is opened', () => {
    // Two different positions, so a reset cannot be confused with the views syncing to each other.
    scrollViewTo(0, 0.75)
    scrollViewTo(1, 0.5)

    // Scrolling the second view left the first one where it was.
    cy.get(selectors.textContainer).eq(0).should(($container) => {
      const container = $container[0]
      expect(container.scrollTop, 'the first view is still at 75% of its height')
        .to.be.closeTo(container.clientHeight * 0.75, 2)
    })

    cy.get(selectors.nextItemButton).click()

    cy.get(selectors.itemLabel).contains(chapter2.label)
    cy.get(selectors.textContainer).eq(0).find(chapter2.ready).should('exist')
    cy.get(selectors.textContainer).eq(1).find(chapter2.ready).should('exist')

    cy.get(selectors.textContainer).eq(0).its('0.scrollTop').should('equal', 0)
    cy.get(selectors.textContainer).eq(1).its('0.scrollTop').should('equal', 0)
  })
})
