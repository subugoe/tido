import { panelSelectors } from '../support/panel-helpers'

// The headers of the text and annotations views stand above their content, which scrolls below them.
// A text view names its content type there unless showContentTypesToggle (per view) or
// showContentTypeToggle (globally) turns that off.
describe('View headers', () => {
  const apiUrl = Cypress.env('API_URL') || 'http://localhost:8181'
  const collection = `${apiUrl}/example/collections/example.json`

  const selectors = {
    ...panelSelectors,
    textHeader: '[data-cy="text-view-header"]',
    textLabel: '[data-cy="text-view-label"]',
  }

  const view = (options) => encodeURIComponent(JSON.stringify(options))

  const visit = (params) => {
    cy.visit(`/e2e.html?${[`panels[0].collection=${collection}`, ...params].join('&')}`)
    cy.get(selectors.itemLabel).contains('Page 1')
  }

  const rect = ($el) => $el[0].getBoundingClientRect()

  // the content types named in the headers of the text views, in order - null where none is named
  const expectContentTypes = (expected) => cy.get(selectors.textHeader).should(($headers) => {
    expect([...$headers].map(header => header.querySelector(selectors.contentType)?.textContent ?? null)).to.deep.equal(expected)
  })

  it('Lets the text and the annotations scroll below their headers, starting at the same height', () => {
    visit([
      `panelViews[]=${view({ view: 'text', label: 'Text', activeContentType: 'transcription' })}`,
      `panelViews[]=${view({ view: 'annotations', visible: true })}`,
    ])

    cy.get(selectors.textHeader).then(($header) => {
      cy.get(selectors.textContainer).should(($container) => {
        expect(rect($container).top).to.be.closeTo(rect($header).bottom, 1)
      })
    })
    cy.get(selectors.annotationsHeader).then(($header) => {
      cy.get(selectors.annotationsScrollContainer).should(($container) => {
        expect(rect($container).top).to.be.closeTo(rect($header).bottom, 1)
      })
    })
    cy.get(selectors.textContainer).then(($text) => {
      cy.get(selectors.annotationsScrollContainer).should(($annotations) => {
        expect(rect($annotations).top).to.be.closeTo(rect($text).top, 1)
      })
    })
  })

  it('Keeps the header of a text view without the content type toggle, so text and annotations start at the same height', () => {
    visit([
      'showContentTypeToggle=false',
      `panelViews[]=${view({ view: 'text', label: 'Text', activeContentType: 'transcription' })}`,
      `panelViews[]=${view({ view: 'annotations', visible: true })}`,
    ])

    cy.get(selectors.textHeader).find(selectors.textLabel).should('have.text', 'Text')
    cy.get(selectors.contentType).should('not.exist')
    cy.get(selectors.textContainer).then(($text) => {
      cy.get(selectors.annotationsScrollContainer).should(($annotations) => {
        expect(rect($annotations).top).to.be.closeTo(rect($text).top, 1)
      })
    })
  })

  it('Names the content type of a text view by default', () => {
    visit([
      `panelViews[]=${view({ view: 'text', label: 'Text', activeContentType: 'transcription' })}`,
      `panelViews[]=${view({ view: 'text', label: 'Text', contentTypes: ['diplomatic'] })}`,
    ])

    expectContentTypes(['transcription', 'diplomatic'])
  })

  it('Leaves out the content type of a view of the panelViews with showContentTypesToggle false', () => {
    visit([
      `panelViews[]=${view({ view: 'text', label: 'Text', activeContentType: 'transcription' })}`,
      `panelViews[]=${view({ view: 'text', label: 'Text', contentTypes: ['diplomatic'], showContentTypesToggle: false })}`,
    ])

    expectContentTypes(['transcription', null])
    cy.get(selectors.textLabel).should('have.length', 2).each($label => expect($label).to.have.text('Text'))
  })

  it('Leaves out the content type of a view of the panel views with showContentTypesToggle false', () => {
    visit([
      `panels[0].views[]=${view({ view: 'text', label: 'Text', activeContentType: 'transcription', showContentTypesToggle: false })}`,
      `panels[0].views[]=${view({ view: 'text', label: 'Text', activeContentType: 'diplomatic' })}`,
    ])

    expectContentTypes([null, 'diplomatic'])
  })

  it('Names the content type when showContentTypesToggle is not a boolean', () => {
    visit([
      `panelViews[]=${view({ view: 'text', label: 'Text', activeContentType: 'transcription', showContentTypesToggle: 'no' })}`,
    ])

    expectContentTypes(['transcription'])
  })
})
