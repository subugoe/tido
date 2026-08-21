const apiUrl = Cypress.env('API_URL') || 'http://localhost:8181'
const synopsisCollection = `${apiUrl}/example-synopsis-2/collections/example.json`
const book2Manifest = `${apiUrl}/example-synopsis-2/manifests/book2.json`
const book1Manifest = `${apiUrl}/example-synopsis-2/manifests/book1.json`

const textView = (activeContentType) => ({
  label: 'Text',
  view: 'text',
  activeContentType,
  contentTypes: ['transcription', 'diplomatic', 'normalized']
})

const BOOK2_PAGE1_TRANSCRIPTION = `${apiUrl}/example-synopsis-2/html/book2-page1_transcription.html`
const OCEAN_SELECTOR = '#ocean'
const OCEAN_ANNOTATION_TEXT = 'The ocean as a universal'
const SYNOPSIS_SELECTED_STYLE = 'bg-yellow-500'

function getPanel(index) {
  return cy.get('[data-cy="panels-wrapper"]')
    .find('[data-cy="panel"]')
    .eq(index)
}

function getSyncTargetNavigation(panelIndex) {
  return getPanel(panelIndex).find('[data-cy="sync-target-navigation"]')
}

function getPopover() {
  return cy.get('[data-cy="annotation-popover-content"]')
}

function clickSyncTarget(contentUrl, selector) {
  cy.get(`[data-text-container][data-content-url="${contentUrl}"]`).find(selector).click()
}

function visit(config, panelCount = 2) {
  cy.visit(`/e2e.html?${config}`)
  cy.get('[data-cy="panel"]').should('have.length', panelCount)
}

describe('Annotation disableSynopsisSelection', () => {

  describe('When annotations.disableSynopsisSelection is true', () => {
    const config = [
      `panels[0].collection=${synopsisCollection}`,
      `panels[0].manifest=${book2Manifest}`,
      `panels[1].collection=${synopsisCollection}`,
      `panels[1].manifest=${book2Manifest}`,
      'annotations.disableSynopsisSelection=true',
      'showContentTypeToggle=false',
      `panelViews[]=${encodeURIComponent(JSON.stringify(textView('transcription')))}`,
      `panelViews[]=${encodeURIComponent(JSON.stringify(textView('diplomatic')))}`,
    ].join('&')

    beforeEach(() => visit(config))

    it('Shows the Sync Target Navigation for panels with sync targets', () => {
      getSyncTargetNavigation(0).should('exist')
    })

    it('Does not open a popover when clicking a sync target', () => {
      clickSyncTarget(BOOK2_PAGE1_TRANSCRIPTION, OCEAN_SELECTOR)
      getPopover().should('not.exist')
    })

    it('Does not apply the active style to the clicked sync target', () => {
      clickSyncTarget(BOOK2_PAGE1_TRANSCRIPTION, OCEAN_SELECTOR)
      cy.get(`[data-text-container][data-content-url="${BOOK2_PAGE1_TRANSCRIPTION}"]`)
        .find(OCEAN_SELECTOR)
        .should('not.have.class', SYNOPSIS_SELECTED_STYLE)
    })
  })

  describe('When annotations.disableSynopsisSelection is false (default)', () => {
    const config = [
      `panels[0].collection=${synopsisCollection}`,
      `panels[0].manifest=${book2Manifest}`,
      `panels[1].collection=${synopsisCollection}`,
      `panels[1].manifest=${book1Manifest}`,
      'showContentTypeToggle=false',
      `panelViews[]=${encodeURIComponent(JSON.stringify(textView('transcription')))}`,
      `panelViews[]=${encodeURIComponent(JSON.stringify(textView('diplomatic')))}`,
    ].join('&')

    it('Opens a popover with simplified UI when all witnesses are opened', () => {
      visit(config)
      clickSyncTarget(BOOK2_PAGE1_TRANSCRIPTION, OCEAN_SELECTOR)

      getPopover().should('be.visible')

      getPopover()
        .find('[data-cy="popover-section-label"]')
        .should('have.length', 2)
        .then($labels => expect(Array.from($labels, label => label.textContent))
          .to.deep.equal(['Annotations', 'Synopsis']))

      getPopover()
        .find('[data-cy="popover-annotations-section"] [data-cy="popover-annotation-item"]')
        .should('have.length', 1)
        .should('contain.text', OCEAN_ANNOTATION_TEXT)

      // allWitnessesOpened=true: witness-item rendered as a select-only button
      getPopover()
        .find('[data-cy="witness-item"]')
        .should('have.length', 1)
        .find('[data-cy="witness-label"]')
        .should('have.text', 'Country Manners', { timeout: 8000 })

      // simplified UI: no WitnessesArea title, no "Open in panels" button
      getPopover().find('[data-cy="synoptical-witnesses-title"]').should('not.exist')
      getPopover().find('[data-cy="open-synced-panels"]').should('not.exist')

      // no checkbox rendered inside the witness-item (selectOnly mode)
      getPopover().find('[data-cy="witness-item"]').then(($items) => {
        expect($items.find('[data-slot="checkbox"]')).to.have.length(0)
      })
    })
  })

  // A sync target ('#multi') that carries multiple regular annotations (three): with the synopsis
  // selection disabled the click must still open the popover listing them - only the synopsis
  // action area stays hidden. Fixture: example-disable-synopsis, one panel showing the item's
  // transcription and diplomatic texts; '#multi' is synced between both.
  describe('When a sync target carries multiple annotations', () => {
    const multiCollection = `${apiUrl}/example-disable-synopsis/collections/example.json`
    const multiManifest = `${apiUrl}/example-disable-synopsis/manifests/book1.json`
    const MULTI_TRANSCRIPTION = `${apiUrl}/example-disable-synopsis/html/book1-page1_transcription.html`
    const MULTI_SELECTOR = '#multi'
    const MULTI_ANNOTATION_1 = `${apiUrl}/example-disable-synopsis/book1/page1/rev1/annotation-1`
    const MULTI_ANNOTATION_2 = `${apiUrl}/example-disable-synopsis/book1/page1/rev1/annotation-2`
    const MULTI_ANNOTATION_3 = `${apiUrl}/example-disable-synopsis/book1/page1/rev1/annotation-3`
    const MULTI_ANNOTATION_1_TEXT = 'The stone quays are the oldest surviving structure'
    const MULTI_ANNOTATION_2_TEXT = 'Building the quays in stone instead of wood'
    const MULTI_ANNOTATION_3_TEXT = 'The diplomatic text spells the phrase'

    const multiTextView = (activeContentType) => ({
      label: 'Text',
      view: 'text',
      activeContentType,
      contentTypes: ['transcription', 'diplomatic']
    })

    const buildConfig = (extra = []) => [
      `panels[0].collection=${multiCollection}`,
      `panels[0].manifest=${multiManifest}`,
      'showContentTypeToggle=false',
      `panelViews[]=${encodeURIComponent(JSON.stringify(multiTextView('transcription')))}`,
      `panelViews[]=${encodeURIComponent(JSON.stringify(multiTextView('diplomatic')))}`,
      ...extra,
    ].join('&')

    it('Opens a popover with both annotations but without the synopsis section when disableSynopsisSelection is true', () => {
      visit(buildConfig(['annotations.disableSynopsisSelection=true']), 1)

      clickSyncTarget(MULTI_TRANSCRIPTION, MULTI_SELECTOR)

      getPopover().should('be.visible')

      // only the annotations section - no synopsis action area
      getPopover()
        .find('[data-cy="popover-section-label"]')
        .should('have.length', 1)
        .then($labels => expect(Array.from($labels, label => label.textContent))
          .to.deep.equal(['Annotations']))

      getPopover()
        .find('[data-cy="popover-annotations-section"] [data-cy="popover-annotation-item"]')
        .should('have.length', 3)

      getPopover()
        .find(`[data-annotation="${MULTI_ANNOTATION_1}"]`)
        .should('contain.text', MULTI_ANNOTATION_1_TEXT)

      getPopover()
        .find(`[data-annotation="${MULTI_ANNOTATION_2}"]`)
        .should('contain.text', MULTI_ANNOTATION_2_TEXT)

      getPopover()
        .find(`[data-annotation="${MULTI_ANNOTATION_3}"]`)
        .should('contain.text', MULTI_ANNOTATION_3_TEXT)

      getPopover().find('[data-cy="popover-synopsis-section"]').should('not.exist')
    })

    it('Shows the annotations and the synopsis section when disableSynopsisSelection is false (default)', () => {
      visit(buildConfig(), 1)

      clickSyncTarget(MULTI_TRANSCRIPTION, MULTI_SELECTOR)

      getPopover().should('be.visible')

      getPopover()
        .find('[data-cy="popover-section-label"]')
        .should('have.length', 2)
        .then($labels => expect(Array.from($labels, label => label.textContent))
          .to.deep.equal(['Annotations', 'Synopsis']))

      getPopover()
        .find('[data-cy="popover-annotations-section"] [data-cy="popover-annotation-item"]')
        .should('have.length', 3)

      getPopover()
        .find('[data-cy="popover-synopsis-section"] [data-cy="witness-item"]')
        .should('have.length', 1)
        .find('[data-cy="witness-label"]')
        .should('have.text', 'Island Chronicle', { timeout: 8000 })
    })
  })
})
