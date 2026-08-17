import {
  getActiveViews,
  getItem,
  getSyncAnnotations,
  getSyncTargetCounts,
  getTargetPosition,
  isInSyncBand,
  sumSyncTargets,
  SYNC_SCROLL_THRESHOLD_BOTTOM,
  SYNC_SCROLL_THRESHOLD_TOP
} from '../support/synopsis-helpers'

// Panels are opened exactly as in examples/config/example.json:
// Panel 1: 'Example' collection, second manifest (book2), first item
// Panel 2: 'Synopsis-example' collection, second manifest (book2), first item
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

const config = [
  ...panels.flatMap((panel, i) => [
    `panels[${i}].collection=${panel.collection}`,
    `panels[${i}].manifest=${panel.manifest}`
  ]),
  ...rootCollections.map(collection => `rootCollections[]=${collection}`),
  'annotations.crossRefContentType=CrossRef',
  ...panelViews.map(view => `panelViews[]=${encodeURIComponent(JSON.stringify(view))}`)
].join('&')

const SYNOPSIS_STYLE_CLASS = 'bg-yellow-300'
// utils/constants.ts - ACTIVE_TARGET_STYLE is a tailwind variant of this background, the one a
// clicked target carries while its popover is open
const ACTIVE_STYLE_BACKGROUND = 'bg-annotation-selected'
const SYNOPSIS_PANEL = 1
// Where a target is placed to become the focused one of its pane: in the middle of the sync band,
// which leaves the targets of the lines above it above the band - the focused target is the first
// one overlapping it (findFocusedTarget of utils/scroller.ts)
const SYNC_BAND_SCROLL_RATIO = (SYNC_SCROLL_THRESHOLD_TOP + SYNC_SCROLL_THRESHOLD_BOTTOM) / 2
// how far apart the two synced targets may sit after the panes have been aligned
const ALIGNMENT_TOLERANCE = 10
const ISHMAEL = '#ishmael'
const WATERY_PART = '#watery-part'
// '#ocean' of the transcription of Panel 2 carries exactly one annotation and is synced with
// exactly one target ('#man' of Chapter 1 of the 'Country Manners' manifest, which no panel shows)
const OCEAN = '#ocean'
const MAN = '#man'
const OCEAN_ANNOTATION = 'http://localhost:8181/example-synopsis-2/book2/page1/rev1/annotation-3'
const OCEAN_ANNOTATION_TEXT = 'The ocean as a universal'
const MAN_CONTENT_URL = 'http://localhost:8181/example-synopsis-2/html/book1-page1_transcription.html'
const WITNESS_TITLE = 'Country Manners'
const WITNESS_ITEM_LABEL = 'Chapter 1'
// the manifest Panel 2 opens - '#ishmael' is synced with its own diplomatic text, with Chapter 2 of
// this manifest and with Chapter 1 of 'Country Manners'
const WHALE_VOYAGES = 'Whale Voyages'

// Sync targets per rendered text of each panel, computed from the sync annotations of the
// collections in 'panels' and in 'rootCollections' - see support/synopsis-helpers.js
const syncTargets = []

// The first two items of the synopsis panel (Chapter 1, Chapter 2) and the sync targets of the
// second one - the panel keeps its rendered content types while navigating to it
const items = []
let nextItemSyncTargets = []

function getPanel(index) {
  return cy.get('[data-cy="panels-wrapper"]')
    .find('[data-cy="panel"]')
    .eq(index)
}

function getSyncTargetNavigation(panelIndex) {
  return getPanel(panelIndex).find('[data-cy="sync-target-navigation"]')
}

// Toggle a text view of a panel on/off in the panel views menu
function togglePanelView(panelIndex, viewIndex) {
  getPanel(panelIndex)
    .find('[data-cy="panel-mode-select"]')
    .click()

  cy.get('[data-cy="panel-mode-menu"]')
    .find('[data-cy="panel-view-toggle"]')
    .eq(viewIndex)
    .click()

  // close the menu again so it does not cover the panel
  cy.get('body').type('{esc}')
  cy.get('[data-cy="panel-mode-menu"]').should('not.exist')
}

// Navigate a panel to the next / previous item
function navigateItem(panelIndex, direction) {
  getPanel(panelIndex)
    .find('[data-cy="panel-title-and-nav-arrows"]')
    .find(`[data-cy="${direction}-item-button"]`)
    .click({force: true})
}

function findText(panelIndex, contentType) {
  return syncTargets[panelIndex].find(text => text.contentType === contentType)
}

function getTextPane(contentUrl) {
  return cy.get(`[data-text-container][data-content-url="${contentUrl}"]`)
}

// The two text panes of the synopsis panel, by content type
function getPanes() {
  return getPanel(SYNOPSIS_PANEL).find('[data-text-container]')
}

function pickPanes($panes) {
  return {
    transcription: $panes.filter(`[data-content-url="${findText(SYNOPSIS_PANEL, 'transcription').contentUrl}"]`)[0],
    diplomatic: $panes.filter(`[data-content-url="${findText(SYNOPSIS_PANEL, 'diplomatic').contentUrl}"]`)[0]
  }
}

function hasSynopsisStyle(pane, selector) {
  return pane.querySelector(selector).classList.contains(SYNOPSIS_STYLE_CLASS)
}

// The background a target actually shows: a target accumulates background classes (annotation
// highlight, synopsis, active) and the one added last wins, so the synopsis style is asserted
// through the last background class of the class list rather than through its mere presence.
function lastBackgroundClass(el) {
  const backgrounds = Array.from(el.classList).filter(name => name.includes('bg-'))
  return backgrounds[backgrounds.length - 1]
}

// The active style is a tailwind variant of ACTIVE_STYLE_BACKGROUND that overrides every other
// background of the target (utils/constants.ts), so its presence in the class list is enough.
function hasActiveStyle(el) {
  return Array.from(el.classList).some(name => name.includes(ACTIVE_STYLE_BACKGROUND))
}

function getPopover() {
  return cy.get('[data-cy="annotation-popover-content"]')
}

// y position of a target within the visible height of its own pane - the value the synopsis aligns
// across panes
function targetYPosition(pane, selector) {
  return getTargetPosition(pane, selector).top
}

// Scroll a text pane until the given target enters its sync band. Only a genuine user scroll drives
// the synopsis sync, so the gesture the pane listens for (a pressed pointer) is triggered before
// scrolling - see the scroll listener in GenericTextRenderer.
function scrollTargetIntoSyncBand(contentUrl, selector) {
  getTextPane(contentUrl).trigger('pointerdown', { button: 0 })

  getTextPane(contentUrl).then($pane => {
    const pane = $pane[0]
    const { top } = getTargetPosition(pane, selector)
    const scrollTop = pane.scrollTop + top - pane.clientHeight * SYNC_BAND_SCROLL_RATIO

    cy.wrap($pane).scrollTo(0, Math.max(0, scrollTop))
  })

  getTextPane(contentUrl).trigger('pointerup')
}

// How far inside its pane a target has to sit to be hovered safely - closer to an edge it may be
// clipped or covered by the elements floating above the pane (sync target navigation, scrollbar)
const HOVER_SAFE_MARGIN = 60

// Hover a target in / out. The target is awaited until it exists and, only if it sits outside the
// safely visible area of its pane, scrolled in by the smallest amount that brings it there - the
// scroll position of the pane is part of the state under test, so neither cypress nor this helper
// may scroll the target to the top of the pane. A scroll without a pressed pointer does not drive
// the synopsis sync (see the scroll listener of GenericTextRenderer), so the state under test
// survives the correction.
function hoverTarget(contentUrl, selector, event) {
  getTextPane(contentUrl).find(selector).should('exist')

  getTextPane(contentUrl).then($pane => {
    const pane = $pane[0]
    const { top, bottom, height } = getTargetPosition(pane, selector)
    const above = top - HOVER_SAFE_MARGIN
    const below = bottom - (height - HOVER_SAFE_MARGIN)
    // negative: the target sits above the safe area, positive: below it, 0: it is already inside
    const delta = above < 0 ? above : Math.max(below, 0)

    if (delta !== 0) cy.wrap($pane).scrollTo(0, Math.max(0, pane.scrollTop + delta))
  })

  getTextPane(contentUrl).find(selector).trigger(event, { scrollBehavior: false, force: true })
}

describe('Panel Synopsis', () => {
  before(() => {
    cy.then(async () => {
      const collections = [...panels.map(panel => panel.collection), ...rootCollections]
      const syncAnnotations = await getSyncAnnotations(collections)

      for (const panel of panels) {
        syncTargets.push(await getSyncTargetCounts(panel, panelViews, syncAnnotations))
      }

      // the next item (Chapter 2) is rendered with the content types the panel already shows
      const activeViews = getActiveViews(panelViews, syncTargets[SYNOPSIS_PANEL])
      nextItemSyncTargets = await getSyncTargetCounts(panels[SYNOPSIS_PANEL], activeViews, syncAnnotations, 1)
      items.push(await getItem(panels[SYNOPSIS_PANEL], 0), await getItem(panels[SYNOPSIS_PANEL], 1))
    }).then(() => syncTargets.forEach((counts, i) =>
      cy.log(`Panel ${i + 1} sync targets: ${counts.map(c => `${c.contentType}=${c.count}`).join(', ')}`)))
  })

  beforeEach(() => {
    cy.visit('/e2e.html?' + config)
    // wait until both panels have rendered their texts
    cy.get('[data-cy="panel"]').should('have.length', panels.length)
    getPanel(SYNOPSIS_PANEL).find('[data-text-container]').should('have.length', panelViews.length)
  })

  it('Should show the Sync Target Navigation only in a panel that renders synced targets', () => {
    // the data of this config gives synced targets to Panel 2 only
    expect(sumSyncTargets(syncTargets[0])).to.equal(0)
    expect(sumSyncTargets(syncTargets[SYNOPSIS_PANEL])).to.be.greaterThan(0)

    // Panel 2 renders synced targets -> navigation is displayed on top of the panel
    getSyncTargetNavigation(SYNOPSIS_PANEL).should('exist')

    // Panel 1 renders no synced targets -> no navigation
    getSyncTargetNavigation(0).should('not.exist')
  })

  /*

  it('Should display the first of all synced targets in the Sync Target Navigation of Panel 2', () => {
    getSyncTargetNavigation(SYNOPSIS_PANEL)
      .find('[data-cy="sync-target-counter"]')
      .should('have.text', `1/${sumSyncTargets(syncTargets[SYNOPSIS_PANEL])}`)

    // bottom button (next synoptic target) is active, top button (previous synoptic target) is disabled
    getSyncTargetNavigation(SYNOPSIS_PANEL)
      .find('[data-cy="sync-target-nav-button"]')
      .should('have.length', 2)
      .eq(0)
      .should('not.have.attr', 'disabled')

    getSyncTargetNavigation(SYNOPSIS_PANEL)
      .find('[data-cy="sync-target-nav-button"]')
      .eq(1)
      .should('have.attr', 'disabled')
  })

  it('Should highlight the first synced target of the left pane in Panel 2', () => {
    getPanel(SYNOPSIS_PANEL)
      .find('[data-text-container]')
      .eq(0)                                 // left pane
      .find('#ishmael')
      .should(($target) => {
        const classList = Array.from($target[0].classList)
        expect(classList[classList.length - 1]).to.equal(SYNOPSIS_STYLE_CLASS)
      })
  }) */

  it('Should count only the synced targets of the visible texts when a text is toggled off and on again', () => {
    const transcription = findText(SYNOPSIS_PANEL, 'transcription')
    const total = sumSyncTargets(syncTargets[SYNOPSIS_PANEL])
    const withoutTranscription = sumSyncTargets(syncTargets[SYNOPSIS_PANEL], ['diplomatic'])

    getSyncTargetNavigation(SYNOPSIS_PANEL)
      .find('[data-cy="sync-target-counter"]')
      .should('have.text', `1/${total}`)

    // toggle 'transcription' off -> only the synced targets of the visible 'diplomatic' text are counted
    togglePanelView(SYNOPSIS_PANEL, transcription.viewIndex)

    getPanel(SYNOPSIS_PANEL)
      .find('[data-text-container]:visible')
      .should('have.length', panelViews.length - 1)

    getSyncTargetNavigation(SYNOPSIS_PANEL)
      .find('[data-cy="sync-target-counter"]')
      .should('have.text', `1/${withoutTranscription}`)

    // toggle 'transcription' back on -> the whole panel is counted again
    togglePanelView(SYNOPSIS_PANEL, transcription.viewIndex)

    getPanel(SYNOPSIS_PANEL)
      .find('[data-text-container]:visible')
      .should('have.length', panelViews.length)

    getSyncTargetNavigation(SYNOPSIS_PANEL)
      .find('[data-cy="sync-target-counter"]')
      .should('have.text', `1/${total}`)
  })

  it('Should update the synced targets when navigating to the next item and back to the previous one', () => {
    const [chapter1, chapter2] = items
    const chapter1Total = sumSyncTargets(syncTargets[SYNOPSIS_PANEL])
    const chapter2Total = sumSyncTargets(nextItemSyncTargets)

    expect(chapter2Total).to.be.greaterThan(0)

    getPanel(SYNOPSIS_PANEL)
      .find('[data-cy="item-label"]')
      .should('contain.text', chapter1.division)

    getSyncTargetNavigation(SYNOPSIS_PANEL)
      .find('[data-cy="sync-target-counter"]')
      .should('have.text', `1/${chapter1Total}`)

    // next item (Chapter 2) -> the navigation counts the synced targets of the new texts
    navigateItem(SYNOPSIS_PANEL, 'next')

    getPanel(SYNOPSIS_PANEL)
      .find('[data-cy="item-label"]')
      .should('contain.text', chapter2.division)

    getSyncTargetNavigation(SYNOPSIS_PANEL)
      .find('[data-cy="sync-target-counter"]')
      .should('have.text', `1/${chapter2Total}`)

    // back to the previous item (Chapter 1) -> the counts of that item are restored
    navigateItem(SYNOPSIS_PANEL, 'prev')

    getPanel(SYNOPSIS_PANEL)
      .find('[data-cy="item-label"]')
      .should('contain.text', chapter1.division)

    getSyncTargetNavigation(SYNOPSIS_PANEL)
      .find('[data-cy="sync-target-counter"]')
      .should('have.text', `1/${chapter1Total}`)
  })

  it('Should align the synced target of the other pane when a target is scrolled into the sync band', () => {
    const transcription = findText(SYNOPSIS_PANEL, 'transcription')

    // scroll '#ishmael' of the transcription pane into the sync band of that pane
    scrollTargetIntoSyncBand(transcription.contentUrl, ISHMAEL)

    getPanes().should($panes => {
      const panes = pickPanes($panes)
      const scrolled = getTargetPosition(panes.transcription, ISHMAEL)
      const synced = getTargetPosition(panes.diplomatic, ISHMAEL)

      // the diplomatic pane scrolled its own '#ishmael' to the y position of the scrolled one
      expect(Math.abs(synced.top - scrolled.top), `y distance of both '${ISHMAEL}' targets`)
        .to.be.lessThan(ALIGNMENT_TOLERANCE)

      // both targets sit in the sync band of their pane
      expect(isInSyncBand(panes.transcription, ISHMAEL), `'${ISHMAEL}' of transcription in sync band`).to.be.true
      expect(isInSyncBand(panes.diplomatic, ISHMAEL), `'${ISHMAEL}' of diplomatic in sync band`).to.be.true
    })
  })

  /*

  it('Should move the synopsis style to the target scrolled into the sync band and highlight a hovered pair temporarily', () => {
    const transcription = findText(SYNOPSIS_PANEL, 'transcription')
    const diplomatic = findText(SYNOPSIS_PANEL, 'diplomatic')

    // 1. scroll '#ishmael' of the transcription pane into its sync band - the diplomatic pane follows
    scrollTargetIntoSyncBand(transcription.contentUrl, ISHMAEL)

    getPanes().should($panes => {
      const panes = pickPanes($panes)
      const scrolled = getTargetPosition(panes.transcription, ISHMAEL)
      const synced = getTargetPosition(panes.diplomatic, ISHMAEL)

      expect(Math.abs(synced.top - scrolled.top), `y distance of both '${ISHMAEL}' targets`)
        .to.be.lessThan(ALIGNMENT_TOLERANCE)
      expect(isInSyncBand(panes.transcription, ISHMAEL), `'${ISHMAEL}' of transcription in sync band`).to.be.true
      expect(isInSyncBand(panes.diplomatic, ISHMAEL), `'${ISHMAEL}' of diplomatic in sync band`).to.be.true

      expect(hasSynopsisStyle(panes.transcription, ISHMAEL), `'${ISHMAEL}' of transcription is styled`).to.be.true
      expect(hasSynopsisStyle(panes.diplomatic, ISHMAEL), `'${ISHMAEL}' of diplomatic is styled`).to.be.true
    })

    // 2. now scroll '#watery-part' of the diplomatic pane into its sync band - the transcription
    // pane follows and the synopsis style moves from the '#ishmael' pair to the '#watery-part' pair
    scrollTargetIntoSyncBand(diplomatic.contentUrl, WATERY_PART)

    getPanes().should($panes => {
      const panes = pickPanes($panes)
      const scrolled = getTargetPosition(panes.diplomatic, WATERY_PART)
      const synced = getTargetPosition(panes.transcription, WATERY_PART)

      expect(Math.abs(synced.top - scrolled.top), `y distance of both '${WATERY_PART}' targets`)
        .to.be.lessThan(ALIGNMENT_TOLERANCE)

      expect(hasSynopsisStyle(panes.diplomatic, WATERY_PART), `'${WATERY_PART}' of diplomatic is styled`).to.be.true
      expect(hasSynopsisStyle(panes.transcription, WATERY_PART), `'${WATERY_PART}' of transcription is styled`).to.be.true

      // the previously synced pair lost the synopsis style again
      expect(hasSynopsisStyle(panes.diplomatic, ISHMAEL), `'${ISHMAEL}' of diplomatic is styled`).to.be.false
      expect(hasSynopsisStyle(panes.transcription, ISHMAEL), `'${ISHMAEL}' of transcription is styled`).to.be.false
    })

    // 3. hovering '#ishmael' in the diplomatic pane highlights it and its synced target in the other
    // pane, while the pair in the sync band keeps its style
    hoverTarget(diplomatic.contentUrl, ISHMAEL, 'mouseenter')

    getPanes().should($panes => {
      const panes = pickPanes($panes)

      expect(hasSynopsisStyle(panes.diplomatic, ISHMAEL), `hovered '${ISHMAEL}' of diplomatic is styled`).to.be.true
      expect(hasSynopsisStyle(panes.transcription, ISHMAEL), `synced '${ISHMAEL}' of transcription is styled`).to.be.true

      expect(hasSynopsisStyle(panes.diplomatic, WATERY_PART), `'${WATERY_PART}' of diplomatic is styled`).to.be.true
      expect(hasSynopsisStyle(panes.transcription, WATERY_PART), `'${WATERY_PART}' of transcription is styled`).to.be.true
    })

    // 4. hovering out removes the style of the hovered pair only
    hoverTarget(diplomatic.contentUrl, ISHMAEL, 'mouseleave')

    getPanes().should($panes => {
      const panes = pickPanes($panes)

      expect(hasSynopsisStyle(panes.diplomatic, ISHMAEL), `'${ISHMAEL}' of diplomatic is styled`).to.be.false
      expect(hasSynopsisStyle(panes.transcription, ISHMAEL), `'${ISHMAEL}' of transcription is styled`).to.be.false

      expect(hasSynopsisStyle(panes.diplomatic, WATERY_PART), `'${WATERY_PART}' of diplomatic is styled`).to.be.true
      expect(hasSynopsisStyle(panes.transcription, WATERY_PART), `'${WATERY_PART}' of transcription is styled`).to.be.true
    })
  })

  it('Should open a popover for a clicked sync target and open its witness in a new panel', () => {
    const transcription = findText(SYNOPSIS_PANEL, 'transcription')

    // 1. scroll '#ocean' into the sync band of the transcription pane - it becomes the target the
    // panel is synced on and is highlighted with the synopsis style
    scrollTargetIntoSyncBand(transcription.contentUrl, OCEAN)

    getTextPane(transcription.contentUrl).find(OCEAN).should($target =>
      expect(lastBackgroundClass($target[0]), `background of '${OCEAN}' in the sync band`)
        .to.equal(SYNOPSIS_STYLE_CLASS))

    // 2. clicking it opens the popover and marks it as the active target
    getTextPane(transcription.contentUrl).find(OCEAN).click({ scrollBehavior: false })

    getPopover().should('be.visible')

    getTextPane(transcription.contentUrl).find(OCEAN).should($target =>
      expect(hasActiveStyle($target[0]), `clicked '${OCEAN}' carries the active style`).to.be.true)

    // 3. '#ocean' has one annotation and one synced target, so the popover shows both sections
    getPopover()
      .find('[data-cy="popover-section-label"]')
      .should('have.length', 2)
      .then($labels => expect(Array.from($labels, label => label.textContent))
        .to.deep.equal(['Annotations', 'Synopsis']))

    getPopover()
      .find('[data-cy="popover-annotations-section"] [data-cy="popover-annotation-item"]')
      .should('have.length', 1)
      .should('contain.text', OCEAN_ANNOTATION_TEXT)

    getPopover()
      .find('[data-cy="synoptical-witnesses-title"]')
      .should('have.text', 'Synoptical Witnesses')

    // none of the witnesses is opened in a panel yet, so none is preselected
    getPopover()
      .find('[data-cy="synoptical-witnesses-counter"]')
      .should('have.text', '0/1')

    getPopover()
      .find('[data-cy="witness-list"] [data-cy="witness-item"]')
      .should('have.length', 1)
      .find('[data-cy="witness-label"]')
      .should('have.text', WITNESS_TITLE)

    // 4. selecting the annotation in the popover opens the sidebar and selects the card of the
    // same annotation there
    getPopover().find('[data-cy="popover-annotation-item"]').click()

    getPanel(SYNOPSIS_PANEL).find('[data-sidebar-view]').should('be.visible')
    getPanel(SYNOPSIS_PANEL)
      .find(`[data-sidebar-view] [data-annotation="${OCEAN_ANNOTATION}"]`)
      .should('have.attr', 'data-selected')

    // 5. deselecting it in the popover clears the selection in both places
    getPopover().find('[data-cy="popover-annotation-item"]').click()

    getPopover().find('[data-cy="popover-annotation-item"]').should('not.have.attr', 'data-selected')
    getPanel(SYNOPSIS_PANEL)
      .find(`[data-sidebar-view] [data-annotation="${OCEAN_ANNOTATION}"]`)
      .should('not.have.attr', 'data-selected')

    // 6. selecting the 'Country Manners' witness and opening it adds a third panel showing the
    // item the synced target lives in
    getPopover().find('[data-cy="witness-item"]').click()
    getPopover().find('[data-cy="synoptical-witnesses-counter"]').should('have.text', '1/1')

    getPopover().find('[data-cy="open-synced-panels"]').click()

    // the popover closed with the selection
    cy.get('[data-cy="annotation-popover-content"]').should('not.exist')

    cy.get('[data-cy="panel"]').should('have.length', panels.length + 1)
    getPanel(panels.length).find('[data-cy="manifest-label"]').should('contain.text', WITNESS_TITLE)
    getPanel(panels.length).find('[data-cy="item-label"]').should('contain.text', WITNESS_ITEM_LABEL)

    // 7. the synced target of the new panel is highlighted and aligned with the clicked one, which
    // stays the active target
    getPanel(panels.length)
      .find(`[data-text-container][data-content-url="${MAN_CONTENT_URL}"]`)
      .find(MAN)
      .should($target => expect($target[0].classList.contains(SYNOPSIS_STYLE_CLASS),
        `synced '${MAN}' carries the synopsis style`).to.be.true)

    getTextPane(transcription.contentUrl).find(OCEAN).should($target =>
      expect(hasActiveStyle($target[0]), `clicked '${OCEAN}' carries the active style`).to.be.true)

    cy.get('[data-text-container]').should($panes => {
      const clickedPane = $panes.filter(`[data-content-url="${transcription.contentUrl}"]`)[0]
      const syncedPane = $panes.filter(`[data-content-url="${MAN_CONTENT_URL}"]`)[0]

      expect(Math.abs(targetYPosition(syncedPane, MAN) - targetYPosition(clickedPane, OCEAN)),
        `y distance of '${OCEAN}' and its synced '${MAN}'`).to.be.lessThan(ALIGNMENT_TOLERANCE)
    })
  })

  // Panel 2 opens 'Whale Voyages', Chapter 1 - the item both tests below work on
  it('Should keep the synopsis style of a scrolled sync connection when one of its targets is hovered out', () => {
    const transcription = findText(SYNOPSIS_PANEL, 'transcription')
    const diplomatic = findText(SYNOPSIS_PANEL, 'diplomatic')

    // scrolling '#watery-part' into the sync band of the transcription makes it the scrolled
    // connection: the target itself plus the '#watery-part' it is synced with in the diplomatic text
    scrollTargetIntoSyncBand(transcription.contentUrl, WATERY_PART)

    const expectPairStyled = (label) => getPanes().should($panes => {
      const panes = pickPanes($panes)
      expect(hasSynopsisStyle(panes.transcription, WATERY_PART), `'${WATERY_PART}' of transcription is styled ${label}`).to.be.true
      expect(hasSynopsisStyle(panes.diplomatic, WATERY_PART), `'${WATERY_PART}' of diplomatic is styled ${label}`).to.be.true
    })

    expectPairStyled('after the scroll')

    // hovering the scrolled target itself in and out leaves the connection untouched
    hoverTarget(transcription.contentUrl, WATERY_PART, 'mouseenter')
    hoverTarget(transcription.contentUrl, WATERY_PART, 'mouseleave')

    expectPairStyled('after hovering the transcription target out')

    // ... and so does hovering its synced target in the other pane
    hoverTarget(diplomatic.contentUrl, WATERY_PART, 'mouseenter')
    hoverTarget(diplomatic.contentUrl, WATERY_PART, 'mouseleave')

    expectPairStyled('after hovering the diplomatic target out')
  })

  it('Should keep the styles of an active sync connection when one of its targets is hovered out', () => {
    const transcription = findText(SYNOPSIS_PANEL, 'transcription')
    const diplomatic = findText(SYNOPSIS_PANEL, 'diplomatic')

    scrollTargetIntoSyncBand(transcription.contentUrl, ISHMAEL)

    // DEBUG: let the scroll driven sync settle before '#ishmael' is looked up and clicked
    cy.wait(1000)

    getTextPane(transcription.contentUrl).find(ISHMAEL).click({ force: true })
    getPopover().should('be.visible')

    // add the second 'Whale Voyages' witness (Chapter 2) to the selection and open it
    getPopover()
      .find('[data-cy="witness-item"]')
      .filter((_, el) => el.querySelector('[data-cy="witness-label"]').textContent === WHALE_VOYAGES)
      .should('have.length', 3)
      .eq(1)
      .click()

    getPopover().find('[data-cy="open-synced-panels"]').click()

    cy.get('[data-cy="annotation-popover-content"]').should('not.exist')
    cy.get('[data-cy="panel"]').should('have.length', panels.length + 1)

    // the clicked target keeps the active style when it is hovered in and out again
    hoverTarget(transcription.contentUrl, ISHMAEL, 'mouseenter')
    hoverTarget(transcription.contentUrl, ISHMAEL, 'mouseleave')

    getTextPane(transcription.contentUrl).find(ISHMAEL).should($target =>
      expect(hasActiveStyle($target[0]), `clicked '${ISHMAEL}' keeps the active style`).to.be.true)

    // ... and its synced target of the diplomatic text keeps the synopsis style
    hoverTarget(diplomatic.contentUrl, ISHMAEL, 'mouseenter')
    hoverTarget(diplomatic.contentUrl, ISHMAEL, 'mouseleave')

    getTextPane(diplomatic.contentUrl).find(ISHMAEL).should($target =>
      expect($target[0].classList.contains(SYNOPSIS_STYLE_CLASS),
        `synced '${ISHMAEL}' of diplomatic keeps the synopsis style`).to.be.true)
  })

*/
})
