const apiUrl = Cypress.env('API_URL') || 'http://localhost:8181'
const synopsisCollection = `${apiUrl}/example-synopsis-2/collections/example.json`
const book2Manifest = `${apiUrl}/example-synopsis-2/manifests/book2.json`
const book1Manifest = `${apiUrl}/example-synopsis-2/manifests/book1.json`

// Both panels render sources carrying sync targets (see annotations/annotationPage/example.json):
// book2-page1 and book1-page1, each in their transcription and diplomatic texts.
const textView = (activeContentType) => ({
  label: 'Text',
  view: 'text',
  activeContentType,
  contentTypes: ['transcription', 'diplomatic']
})

function getPanel(index) {
  return cy.get('[data-cy="panels-wrapper"]')
    .find('[data-cy="panel"]')
    .eq(index)
}

function getSyncTargetNavigation(panelIndex) {
  return getPanel(panelIndex).find('[data-cy="sync-target-navigation"]')
}

function buildConfig(panelOptions = [], rootOptions = []) {
  return [
    ...rootOptions,
    `panels[0].collection=${synopsisCollection}`,
    `panels[0].manifest=${book2Manifest}`,
    `panels[1].collection=${synopsisCollection}`,
    `panels[1].manifest=${book1Manifest}`,
    ...panelOptions,
    'showContentTypeToggle=false',
    `panelViews[]=${encodeURIComponent(JSON.stringify(textView('transcription')))}`,
    `panelViews[]=${encodeURIComponent(JSON.stringify(textView('diplomatic')))}`,
  ].join('&')
}

describe('Panel showSynopsisNavigation', () => {

  describe('When not configured', () => {
    it('Shows the Sync Target Navigation by default', () => {
      cy.visit(`/e2e.html?${buildConfig()}`)
      cy.get('[data-cy="panel"]').should('have.length', 2)

      getSyncTargetNavigation(0).should('exist')
      getSyncTargetNavigation(1).should('exist')
    })
  })

  describe('When configured per panel', () => {
    it('Shows the Sync Target Navigation when explicitly set to true', () => {
      cy.visit(`/e2e.html?${buildConfig(['panels[0].showSynopsisNavigation=true'])}`)
      cy.get('[data-cy="panel"]').should('have.length', 2)

      getSyncTargetNavigation(0).should('exist')
      getSyncTargetNavigation(1).should('exist')
    })

    it('Hides the Sync Target Navigation only in the panel where it is disabled', () => {
      cy.visit(`/e2e.html?${buildConfig(['panels[0].showSynopsisNavigation=false'])}`)
      cy.get('[data-cy="panel"]').should('have.length', 2)

      getSyncTargetNavigation(0).should('not.exist')
      getSyncTargetNavigation(1).should('exist')
    })

    it('Hides the Sync Target Navigation in all panels where it is disabled', () => {
      cy.visit(`/e2e.html?${buildConfig([
        'panels[0].showSynopsisNavigation=false',
        'panels[1].showSynopsisNavigation=false',
      ])}`)
      cy.get('[data-cy="panel"]').should('have.length', 2)

      getSyncTargetNavigation(0).should('not.exist')
      getSyncTargetNavigation(1).should('not.exist')
    })

    it('Lets a panel-level true override a root-level false', () => {
      cy.visit(`/e2e.html?${buildConfig(
        ['panels[0].showSynopsisNavigation=true'],
        ['showSynopsisNavigation=false'],
      )}`)
      cy.get('[data-cy="panel"]').should('have.length', 2)

      getSyncTargetNavigation(0).should('exist')
      getSyncTargetNavigation(1).should('not.exist')
    })
  })

  describe('When configured on root level', () => {
    it('Hides the Sync Target Navigation in all panels when set to false', () => {
      cy.visit(`/e2e.html?${buildConfig([], ['showSynopsisNavigation=false'])}`)
      cy.get('[data-cy="panel"]').should('have.length', 2)

      getSyncTargetNavigation(0).should('not.exist')
      getSyncTargetNavigation(1).should('not.exist')
    })

    it('Shows the Sync Target Navigation in all panels when set to true', () => {
      cy.visit(`/e2e.html?${buildConfig([], ['showSynopsisNavigation=true'])}`)
      cy.get('[data-cy="panel"]').should('have.length', 2)

      getSyncTargetNavigation(0).should('exist')
      getSyncTargetNavigation(1).should('exist')
    })
  })
})
