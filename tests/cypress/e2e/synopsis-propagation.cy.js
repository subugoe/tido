import { getSyncAnnotations, getSyncTargetCounts, getTargetPosition } from '../support/synopsis-helpers'

// A synoptic connection is a set of targets standing for the same thing in different texts. Scrolling
// one of them into the sync band of its pane moves the others to the same height - but that is only
// half of it. The same move also happens when the connection is driven from somewhere else: a card in
// the sidebar, a cross reference, a clicked target. Those paths write the scroll themselves and
// therefore never see the scroll event the band detection listens for, so the other texts used to
// stay where they were. These specs pin the propagation down for those paths, in both modes.
//
// The connection is exercised between the two texts of one panel. The 'Example' panel of this config
// holds no synced targets at all, and the engine resolves counterparts across the whole app
// (resolveSyncedTargetElements queries the document, not a panel), so the two texts of one panel go
// through the very same propagation two panels would.
//
// '#ishmael' is the target to watch: the transcription has a card of its own (annotation-1) and the
// diplomatic has none - it is there only as a synoptic counterpart. So every path that moves the
// transcription's '#ishmael' has to carry the diplomatic's '#ishmael' along.

const exampleCollection = 'http://localhost:8181/example/collections/example.json'
const synopsisCollection = 'http://localhost:8181/example-synopsis-2/collections/example.json'

const panels = [
  {
    collection: exampleCollection,
    manifest: 'http://localhost:8181/example/manifests/book2.json'
  },
  {
    collection: synopsisCollection,
    manifest: 'http://localhost:8181/example-synopsis-2/manifests/book2.json'
  }
]

const rootCollections = [exampleCollection]

const panelViews = [
  {
    label: 'Text',
    view: 'text',
    contentTypes: ['diplomatic', 'transcription', 'translation']
  },
  {
    label: 'Text',
    view: 'text',
    activeContentType: 'diplomatic',
    contentTypes: ['diplomatic', 'transcription', 'translation', 'normalized']
  }
]

// The panel holding the connection, and the two content types its texts are addressed by
const PANEL = 1
const ORIGIN = 'transcription'
const COUNTERPART = 'diplomatic'
const ISHMAEL = '#ishmael'
// The card of '#ishmael' in the origin text
const ISHMAEL_CARD = 'http://localhost:8181/example-synopsis-2/book2/page1/rev1/annotation-1'
// How far apart the two targets may end up after the propagation. Far below the height of a pane, so
// a spec fails when a counterpart was not moved at all rather than when it was moved a little.
const PROPAGATION_TOLERANCE = 10
// The middle of the sync band: the target landing there is the focused one, the first of the targets
// overlapping the band (findFocusedTarget of utils/scroller.ts)
const SYNC_BAND_RATIO = 0.4
// Where the sidebar band that picks the driving card starts, as a fraction of the sidebar height -
// the same threshold the text band uses (SYNC_SCROLL_THRESHOLD_TOP of utils/scroller.ts)
const SIDEBAND_TOP = 0.35

// The texts of the panel, by content type
let texts = []

function config(extra = []) {
  return [
    ...panels.flatMap((panel, i) => [
      `panels[${i}].collection=${panel.collection}`,
      `panels[${i}].manifest=${panel.manifest}`
    ]),
    ...rootCollections.map(collection => `rootCollections[]=${collection}`),
    'annotations.crossRefContentType=CrossRef',
    ...panelViews.map(view => `panelViews[]=${encodeURIComponent(JSON.stringify(view))}`),
    ...extra
  ].join('&')
}

function getPanel(index) {
  return cy.get('[data-cy="panels-wrapper"]')
    .find('[data-cy="panel"]')
    .eq(index)
}

function getTextPane(contentUrl) {
  return getPanel(PANEL).find(`[data-text-container][data-content-url="${contentUrl}"]`)
}

// The scroll container of the annotation list - the same element the app scrolls and the one the
// alignment measures against (getSidebarEl of utils/annotation-alignment.ts)
function getSidebar() {
  return getPanel(PANEL).find('[data-sidebar-scroll-container]')
}

function findText(contentType) {
  const text = texts.find(entry => entry.contentType === contentType)
  if (!text) throw new Error(`the panel renders no '${contentType}' text: ${JSON.stringify(texts)}`)
  return text
}

// Switches the annotation list between the aligned and the plain mode
function switchMode(mode) {
  getPanel(PANEL)
    .find('[data-cy="annotations-menu"]')
    .click()

  cy.get(`[data-cy="${mode}"]`).click()

  // The menu is a Radix dropdown: it keeps the trigger marked open and the page pointer-events: none
  // until it has closed, and the card click below would be swallowed by that.
  getPanel(PANEL).find('[data-cy="annotations-menu"]').should('have.attr', 'data-state', 'closed')
  cy.get('body').should('not.have.attr', 'data-scroll-locked')

  // The mode itself is applied through a timeout inside the component (updateMode), and the two
  // lists lay their cards out differently - the aligned one positions them against their targets, the
  // plain one leaves them in the flow. The card of the sidebar is the signal that the switch has been
  // carried out, so the specs wait for that rather than for a duration.
  getSidebar().find(`[data-annotation="${ISHMAEL_CARD}"]`).should(($card) => {
    const positioned = Boolean($card[0].style.top)
    expect(positioned, `the list is in '${mode}' mode`).to.equal(mode === 'aligned')
  })
}

// The card of the given annotation, together with the y position it is laid out at inside the
// sidebar. The aligned list positions its cards against their targets with a style, the plain list
// leaves them in the flow - so the style is read where there is one and the offset where there is
// not, which works for both.
function getCard($sidebar, annotationId) {
  const card = $sidebar[0].querySelector(`[data-annotation="${annotationId}"]`)
  if (!card) throw new Error(`the sidebar renders no card of '${annotationId}'`)

  return { card, top: parseInt(card.style.top) || card.offsetTop }
}

// Scrolls the annotation list so the card of the given annotation sits at the given fraction of the
// sidebar height. A forced click does not scroll an element into view, and the card of '#ishmael'
// starts well below the fold of the aligned list, so the specs place it themselves - which is also
// the app's own situation: the list is long and the interesting card is rarely the first on screen.
// The plain list needs no scrolling, its cards fit, so the scroll is skipped where there is nothing
// to scroll.
function scrollCardIntoView(annotationId, ratio = 0.2) {
  return getSidebar().then($sidebar => {
    const sidebar = $sidebar[0]
    if (sidebar.scrollHeight <= sidebar.clientHeight) return

    const { top } = getCard($sidebar, annotationId)

    cy.wrap($sidebar).scrollTo(0, Math.max(0, top - sidebar.clientHeight * ratio))
  })
}

// Clicks the card of the given annotation - the way a card is reached in the app, and the one that
// tells the specs which annotation the connection they assert is about.
function clickCard(annotationId) {
  scrollCardIntoView(annotationId)

  cy.get(`[data-annotation="${annotationId}"]`)
    .click({ scrollBehavior: false })
    .should('have.attr', 'data-selected', 'true')
}

// The y position of a target within the visible height of its own pane - the value the synopsis
// aligns across texts.
function targetY(pane, selector) {
  return getTargetPosition(pane, selector).top
}

// Scrolls the sidebar so the card of the given annotation lands in the band that picks the driving
// card, and keeps nudging the sidebar until the text of the origin actually follows it.
//
// The text following is the precondition of what the caller asserts, not the assertion itself, so it
// is waited for here. A panel hands its matched map to the scroller in an effect of its own, after
// the cards have been positioned, and a sidebar scroll that arrives before that is a no-op - so
// rather than waiting an arbitrary time for the panel to settle, the scroll is repeated until it
// takes effect. Every round lands on a different position, so a scroll event fires each time.
function scrollSidebarUntilTheTextFollows(annotationId, attemptsLeft = 20) {
  return getSidebar().then($sidebar => {
    const sidebar = $sidebar[0]
    const { top } = getCard($sidebar, annotationId)
    const target = Math.max(0, top - sidebar.clientHeight * SIDEBAND_TOP)

    const pane = sidebar
      .closest('[data-cy="panel"]')
      .querySelector(`[data-text-container][data-content-url="${findText(ORIGIN).contentUrl}"]`)

    if (pane.scrollTop > 0) return
    if (attemptsLeft <= 0) throw new Error('the text of the origin never followed the sidebar')

    const nudge = sidebar.scrollTop === target ? Math.max(0, target - 200) : target

    return cy.wrap($sidebar).scrollTo(0, nudge)
      .then(() => cy.wait(100))
      .then(() => scrollSidebarUntilTheTextFollows(annotationId, attemptsLeft - 1))
  })
}

// Asserts that the target sits at the same height in both texts of the panel.
//
// The assertion retries rather than sampling once: the panels of the app are still settling when the
// specs reach their assertion - the annotation list computes its card positions and hands the
// matched map to the scroller in effects of its own - and a scroll that arrives before the engine
// knows the panel is not what is under test here. Retrying asks the question until the panel is ready
// to answer it, and still fails on an implementation that never propagates.
function expectAligned() {
  return getPanel(PANEL).should(($panels) => {
    const origin = $panels.find(`[data-text-container][data-content-url="${findText(ORIGIN).contentUrl}"]`)[0]
    const counterpart = $panels.find(`[data-text-container][data-content-url="${findText(COUNTERPART).contentUrl}"]`)[0]

    const originY = targetY(origin, ISHMAEL)
    const counterpartY = targetY(counterpart, ISHMAEL)

    expect(Math.abs(counterpartY - originY), `y distance of both '${ISHMAEL}' targets (${originY} vs ${counterpartY})`)
      .to.be.lessThan(PROPAGATION_TOLERANCE)
  }, { timeout: 20000 })
}

describe('Synopsis propagation', () => {
  before(() => {
    cy.then(async () => {
      const collections = [...panels.map(panel => panel.collection), ...rootCollections]
      const syncAnnotations = await getSyncAnnotations(collections)

      texts = await getSyncTargetCounts(panels[PANEL], panelViews, syncAnnotations)
    }).then(() => cy.log(`Panel ${PANEL + 1} texts: ${texts.map(t => `${t.contentType}=${t.count}`).join(', ')}`))
  })

  beforeEach(() => {
    // the sidebar is closed by default (PanelStore) - the specs below click cards in it
    cy.visit('/e2e.html?' + config([
      `panels[${PANEL}].showSidebar=true`,
      'annotations.defaultMode=aligned'
    ]))

    // The texts and the annotations of a panel arrive one after the other, so the specs wait for the
    // whole panel rather than for the first thing that renders: the assertions below are the
    // preconditions of the behaviour under test, and a spec that fails on a half loaded panel says
    // nothing about it.
    getPanel(PANEL).find('[data-text-container]').should('have.length', panelViews.length, { timeout: 20000 })
    getTextPane(findText(ORIGIN).contentUrl).find(ISHMAEL).should('exist', { timeout: 20000 })
    getTextPane(findText(COUNTERPART).contentUrl).find(ISHMAEL).should('exist', { timeout: 20000 })
    getSidebar().find(`[data-annotation="${ISHMAEL_CARD}"]`).should('exist', { timeout: 20000 })
  })

  it('Should align the target of the other text when a target is scrolled into the sync band', () => {
    // the reference behaviour: a user scroll is what the band detection reacts to
    getTextPane(findText(ORIGIN).contentUrl).trigger('pointerdown', { button: 0 })

    getTextPane(findText(ORIGIN).contentUrl).then($pane => {
      const pane = $pane[0]
      const scrollTop = pane.scrollTop + targetY(pane, ISHMAEL) - pane.clientHeight * SYNC_BAND_RATIO

      cy.wrap($pane).scrollTo(0, Math.max(0, scrollTop))
    })

    getTextPane(findText(ORIGIN).contentUrl).trigger('pointerup')

    expectAligned()
  })

  it('Should align the target of the other text when a card of the aligned sidebar is clicked', () => {
    clickCard(ISHMAEL_CARD)

    expectAligned()
  })

  it('Should align the target of the other text when the aligned sidebar is scrolled', () => {
    // The band of the sidebar scroll is what picks the card that drives the text, so the scroll is
    // aimed at the card of '#ishmael' rather than at an arbitrary offset: the text only follows
    // while that card is the one in the band. The band of the sidebar starts at 35% of its height
    // (SYNC_SCROLL_THRESHOLD_TOP of utils/scroller.ts), so landing the top of the card there puts
    // the card squarely inside it.
    scrollSidebarUntilTheTextFollows(ISHMAEL_CARD)

    expectAligned()
  })

  it('Should align the target of the other text when a card of the plain list sidebar is clicked', () => {
    // Unlike the aligned list above, the plain list scrolls the text with a plain scroll write that
    // the band detection of that text sees as a user scroll - so the counterpart follows through
    // handleSynopticScroll rather than through the explicit propagation. This spec does not
    // discriminate between the two, it guards that the plain list keeps following at all.
    switchMode('list')

    clickCard(ISHMAEL_CARD)

    expectAligned()
  })
})
