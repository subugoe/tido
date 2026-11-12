import { getTargetPosition, SYNC_SCROLL_THRESHOLD_BOTTOM, SYNC_SCROLL_THRESHOLD_TOP } from '../support/synopsis-helpers'

// Three panels on long texts (tests/mocks/example-synopsis-scroll, see generate-synopsis-scroll.py): the
// second panel shows two panes, its transcription and its diplomatic text. The first third of every text
// carries no sync target; further down, four sync annotations (#sync-1 .. #sync-4) link one target of each
// of the four texts, sitting at slightly different paragraphs in every text.
//
// Scrolling the first pane of the second panel drives the synopsis: while no sync target has entered its
// sync band the other panes stay where they are. Once one does, the other panes - the first and third
// panel and the second pane of the same panel - scroll so that their target of the same connection sits
// on the same height. Scrolling on to the next sync target moves them on to theirs.

const apiUrl = Cypress.env('API_URL') || 'http://localhost:8181'
const base = `${apiUrl}/example-synopsis-scroll`
const collection = `${base}/collections/example.json`

const contentUrl = (book, contentType) => `${base}/html/${book}-page1_${contentType}.html`
const textView = (activeContentType) => ({ label: 'Text', view: 'text', activeContentType, contentTypes: [activeContentType] })

const panels = [
  { book: 'book1', title: 'River Chronicle', views: [textView('transcription')] },
  { book: 'book2', title: 'Harbour Letters', views: [textView('transcription'), textView('diplomatic')] },
  { book: 'book3', title: 'Mountain Diary', views: [textView('transcription')] },
]

const config = panels.flatMap(({ book, views }, i) => [
  `panels[${i}].collection=${collection}`,
  `panels[${i}].manifest=${base}/manifests/${book}.json`,
  ...views.map((view) => `panels[${i}].views[]=${encodeURIComponent(JSON.stringify(view))}`),
]).join('&')

// The pane the user scrolls: the first pane of the second panel ...
const scrolled = { name: 'Harbour Letters, transcription', contentUrl: contentUrl('book2', 'transcription') }
// ... and the panes that follow it: the first and third panel and the second pane of the second panel
const followers = [
  { name: 'River Chronicle, transcription', contentUrl: contentUrl('book1', 'transcription') },
  { name: 'Harbour Letters, diplomatic', contentUrl: contentUrl('book2', 'diplomatic') },
  { name: 'Mountain Diary, transcription', contentUrl: contentUrl('book3', 'transcription') },
]

// Where a target is placed to become the focused one of its pane: in the middle of the sync band
const SYNC_BAND_SCROLL_RATIO = (SYNC_SCROLL_THRESHOLD_TOP + SYNC_SCROLL_THRESHOLD_BOTTOM) / 2
// how far apart the synced targets may sit after the panes have been aligned
const ALIGNMENT_TOLERANCE = 10
// how long the followers are given to (not) move after a scroll that must not sync them
const SETTLE_TIME = 500

const paneSelector = (url) => `[data-text-container][data-content-url="${url}"]`
const getPane = (url) => cy.get(paneSelector(url))

// Scroll the given pane until the element enters its sync band. Only a genuine user scroll drives the
// synopsis sync, so the gesture the pane listens for (a pressed pointer) is triggered around it.
function scrollIntoSyncBand(url, selector) {
  getPane(url).find(selector).should('exist')
  getPane(url).trigger('pointerdown', { button: 0 })
  getPane(url).then(($pane) => {
    const pane = $pane[0]
    const { top } = getTargetPosition(pane, selector)
    cy.wrap($pane).scrollTo(0, Math.max(0, pane.scrollTop + top - pane.clientHeight * SYNC_BAND_SCROLL_RATIO))
  })
  getPane(url).trigger('pointerup')
}

// Every follower scrolled down to its target of the connection, which sits fully in view and on the
// same height as the one of the scrolled pane
function expectFollowersAlignedOn(selector, minScrollTops = {}) {
  cy.get('[data-text-container]').should(($panes) => {
    const scrolledPane = $panes.filter(paneSelector(scrolled.contentUrl))[0]
    const y = getTargetPosition(scrolledPane, selector).top

    followers.forEach(({ name, contentUrl: url }) => {
      const pane = $panes.filter(paneSelector(url))[0]
      const { top, bottom } = getTargetPosition(pane, selector)

      expect(pane.scrollTop, `${name} scrolled further down`).to.be.greaterThan(minScrollTops[url] ?? 0)
      expect(top, `${selector} of ${name} below the top of its pane`).to.be.at.least(0)
      expect(bottom, `${selector} of ${name} above the bottom of its pane`).to.be.at.most(pane.clientHeight)
      expect(Math.abs(top - y), `y distance of ${selector} of ${name} and of ${scrolled.name}`)
        .to.be.lessThan(ALIGNMENT_TOLERANCE)
    })
  })
}

describe('Synopsis: scroll sync of three panels on long texts', () => {

  beforeEach(() => {
    cy.visit('/e2e.html?' + config)
    cy.get('[data-cy="panel"]').should('have.length', panels.length)
    panels.forEach(({ title }, i) => cy.get('[data-cy="panel"]').eq(i).find('[data-cy="manifest-label"]').should('contain.text', title))

    // the second panel shows both of its panes, and every text has arrived with its sync targets
    cy.get('[data-cy="panel"]').eq(1).find('[data-text-container]').should('have.length', 2)
    ;[scrolled, ...followers].forEach(({ contentUrl: url }) => getPane(url).find('#sync-4').should('exist'))
    cy.get('[data-cy="panel"]').eq(1).find('[data-cy="sync-target-counter"]').should('contain.text', '/8')
  })

  it('Should only scroll the other panes once a sync target is scrolled to, and keep them following it', () => {
    // 1. Scrolling through the first third, which holds no sync target, leaves the other panes alone
    scrollIntoSyncBand(scrolled.contentUrl, '#para10')
    getPane(scrolled.contentUrl).its('0.scrollTop').should('be.greaterThan', 0)
    cy.wait(SETTLE_TIME)
    followers.forEach(({ name, contentUrl: url }) =>
      getPane(url).its('0.scrollTop').should((scrollTop) => expect(scrollTop, `${name} did not scroll`).to.equal(0)))

    // 2. Scrolling the first sync target into the sync band scrolls every other pane - the second pane
    // of the same panel too - to its own target of that connection, shown on the same height
    scrollIntoSyncBand(scrolled.contentUrl, '#sync-1')
    expectFollowersAlignedOn('#sync-1')

    // 3. Scrolling on to the next sync target moves them on to theirs
    cy.get('[data-text-container]').then(($panes) => {
      const scrollTops = Object.fromEntries(followers.map(({ contentUrl: url }) =>
        [url, $panes.filter(paneSelector(url))[0].scrollTop]))

      scrollIntoSyncBand(scrolled.contentUrl, '#sync-2')
      expectFollowersAlignedOn('#sync-2', scrollTops)
    })
  })
})
