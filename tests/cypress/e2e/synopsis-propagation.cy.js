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
// How long the texts of the panel may still be settling before a spec stops waiting. This belongs to
// the query the assertion is built on, not to the assertion: .should() takes no timeout of its own
// and silently ignores one passed to it, so the assertion would otherwise give up after the 4s
// default while the panel was still perfectly on its way to being aligned.
const SETTLE_TIMEOUT = 20000
// Consecutive samples the two texts have to keep the same scroll positions for before the alignment
// is read at all - see expectAligned.
const STABLE_SAMPLES = 3
// The options a query of a wait carries. Only the query in front of an assertion passes them on, so
// a chain of queries has to name them on each of its own - see getPanel.
const patient = { timeout: SETTLE_TIMEOUT }
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

// The options are handed to the last query of the chain, and that is the only place a timeout can be
// set: .should() takes none of its own and silently ignores one passed to it, and an earlier query's
// options do not reach it either - only the query right in front of the assertion does. Getting this
// wrong is quiet, since the assertion then simply falls back to the 4s default.
function getPanel(index, options) {
  return cy.get('[data-cy="panels-wrapper"]')
    .find('[data-cy="panel"]')
    .eq(index, options)
}

function getTextPane(contentUrl, options) {
  return getPanel(PANEL).find(`[data-text-container][data-content-url="${contentUrl}"]`, options)
}

// The scroll container of the annotation list - the same element the app scrolls and the one the
// alignment measures against (getSidebarEl of utils/annotation-alignment.ts)
function getSidebar(options) {
  return getPanel(PANEL).find('[data-sidebar-scroll-container]', options)
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

// How many samples in a row the card has to come out the same before its position is taken to be the
// one the click will find it at.
const CARD_SETTLED_SAMPLES = 3

// Waits until the card of the given annotation has stopped moving inside the sidebar.
//
// The aligned list positions its cards absolutely and computes those positions in effects of its
// own - once it has collected the elements, and again whenever the text or its width changes - and
// the cards animate into every new position. Each of those rounds moves the card the specs are
// about to click, so a position read too early is one the card is only passing through: the scroll
// aimed at it puts the card somewhere else, and the click fails with 'the center of this element is
// hidden from view'. Nothing announces those rounds, so the specs wait for the card to come to rest -
// both the position it is laid out at and the one it is being drawn at, so the transition into it
// counts as movement too. The plain list lays its cards out in the flow and leaves them where they
// are, so it is at rest from the first sample and this costs a single round trip.
function waitForCardToSettle(annotationId, settledSamples = 0, samplesLeft = 20, previous = null) {
  return getSidebar().then($sidebar => {
    const sidebar = $sidebar[0]
    const { card, top } = getCard($sidebar, annotationId)

    // The scroll height travels along: the sidebar is exactly as tall as its cards reach, so a round
    // that moves the last one down changes it even when this card itself does not.
    const current = `${top}/${Math.round(card.getBoundingClientRect().top)}/${sidebar.scrollHeight}`
    const samples = current === previous ? settledSamples + 1 : 0

    if (samples >= CARD_SETTLED_SAMPLES) return
    if (samplesLeft <= 0) throw new Error(`the card of '${annotationId}' never came to rest in the sidebar`)

    return cy.wait(100).then(() => waitForCardToSettle(annotationId, samples, samplesLeft - 1, current))
  })
}

// Scrolls the annotation list until the card of the given annotation lies inside its visible area,
// and only then returns. A forced click does not scroll an element into view, and the card of
// '#ishmael' starts well below the fold of the aligned list, so the specs place it themselves - which
// is also the app's own situation: the list is long and the interesting card is rarely the first on
// screen.
//
// Rather than scrolling once against the position the card happens to have, this scrolls and looks:
// as long as the card is not in view, the scroll did not put it there and is repeated against the
// position it has by then. The plain list lays its cards out in the flow, so they are in view as they
// are and this returns at once.
function scrollCardIntoView(annotationId, ratio = 0.2, attemptsLeft = 20) {
  return getSidebar().then($sidebar => {
    const sidebar = $sidebar[0]
    const { card, top } = getCard($sidebar, annotationId)

    const { top: visibleTop, bottom: visibleBottom } = sidebar.getBoundingClientRect()
    const { top: cardTop, bottom: cardBottom } = card.getBoundingClientRect()

    if (cardTop >= visibleTop && cardBottom <= visibleBottom) return

    if (attemptsLeft <= 0) throw new Error(`the card of '${annotationId}' never came into view of the sidebar`)

    const maxScrollTop = sidebar.scrollHeight - sidebar.clientHeight
    const target = Math.max(0, Math.min(top - sidebar.clientHeight * ratio, maxScrollTop))

    return cy.wrap($sidebar).scrollTo(0, target)
      .then(() => cy.wait(50))
      .then(() => scrollCardIntoView(annotationId, ratio, attemptsLeft - 1))
  })
}

// Clicks the card of the given annotation - the way a card is reached in the app, and the one that
// tells the specs which annotation the connection they assert is about.
function clickCard(annotationId) {
  waitForCardToSettle(annotationId)
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
//
// The retry only counts once the texts have stopped moving, which is the other half of it. Every
// action these specs drive ends in a smooth scroll that keeps running for a few hundred milliseconds
// after the command returned, and the positions the texts pass through on the way are not the state
// the specs are about: the two texts start out a little over a hundred pixels apart, so a scroll of
// the origin that is only a few frames old can line its target up with the counterpart's by
// coincidence. Reading the alignment then would let a spec pass on that coincidence - and fail
// moments later on the propagation it never got to see, since that only happens once the scroll has
// come to a stop. So the positions have to hold still across STABLE_SAMPLES retries first; any
// movement in between resets the count and the wait starts over. This can only ever cost retries -
// a text that never stops moving fails with a message saying so - and it never turns into a pass the
// steady state would not have produced.
function expectAligned() {
  let stillSamples = 0
  let lastScrollTops = null

  return getPanel(PANEL, patient).should($panels => {
    const origin = $panels.find(`[data-text-container][data-content-url="${findText(ORIGIN).contentUrl}"]`)[0]
    const counterpart = $panels.find(`[data-text-container][data-content-url="${findText(COUNTERPART).contentUrl}"]`)[0]

    const scrollTops = `${origin.scrollTop}/${counterpart.scrollTop}`
    stillSamples = scrollTops === lastScrollTops ? stillSamples + 1 : 0
    lastScrollTops = scrollTops

    if (stillSamples < STABLE_SAMPLES) {
      throw new Error(`the texts of the panel are still scrolling (${scrollTops})`)
    }

    const originY = targetY(origin, ISHMAEL)
    const counterpartY = targetY(counterpart, ISHMAEL)

    expect(Math.abs(counterpartY - originY), `y distance of both '${ISHMAEL}' targets (${originY} vs ${counterpartY})`)
      .to.be.lessThan(PROPAGATION_TOLERANCE)
  })
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
    // nothing about it. Every query of a wait carries the timeout, see getPanel.
    getPanel(PANEL, patient).find('[data-text-container]', patient).should('have.length', panelViews.length)
    getTextPane(findText(ORIGIN).contentUrl, patient).find(ISHMAEL, patient).should('exist')
    getTextPane(findText(COUNTERPART).contentUrl, patient).find(ISHMAEL, patient).should('exist')
    getSidebar(patient).find(`[data-annotation="${ISHMAEL_CARD}"]`, patient).should('exist')
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
    // This mode keeps the sidebar and the texts off each other's scroll, but the text still moves
    // through the scroller - which is what carries the connection: the counterpart follows through
    // the explicit propagation of the target the scroll was for, not through the band detection of
    // the text, which skips a scroll the engine started itself. The spec does not discriminate
    // between the two, it guards that the plain list keeps following at all.
    switchMode('list')

    clickCard(ISHMAEL_CARD)

    expectAligned()
  })
})
