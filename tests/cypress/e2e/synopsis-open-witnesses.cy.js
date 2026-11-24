import { getTargetPosition } from '../support/synopsis-helpers'

// A sync target that carries no annotation, only synced targets: '#new-york' near the top of the short
// transcription of 'Jazz Age', Chapter 2 is synced (synopsis-14) with two witnesses in two other items,
// which no panel shows yet. Both targets sit halfway down long texts, so their panes have to scroll:
//   - '#manhatto' of the transcription of 'Whale Voyages', Chapter 2
//   - '#feelings-or-views' of the transcription of 'Country Manners', Chapter 1
// Opening both from the popover opens each one in a new panel, scrolled so that its target sits on the
// same height as the clicked one.

const apiUrl = Cypress.env('API_URL') || 'http://localhost:8181'
const base = `${apiUrl}/example-synopsis-2`
const synopsisCollection = `${base}/collections/example.json`

const source = {
  title: 'Jazz Age',
  manifest: `${base}/manifests/book3.json`,
  item: `${base}/items/book3-page2.json`,
  contentUrl: `${base}/html/book3-page2_transcription.html`,
  selector: '#new-york',
}

const witnesses = [
  { title: 'Whale Voyages', contentUrl: `${base}/html/book2-page2_transcription.html`, selector: '#manhatto' },
  { title: 'Country Manners', contentUrl: `${base}/html/book1-page1_transcription.html`, selector: '#feelings-or-views' },
]

const textView = { label: 'Text', view: 'text', activeContentType: 'transcription' }

const config = [
  `panels[0].collection=${synopsisCollection}`,
  `panels[0].manifest=${source.manifest}`,
  `panels[0].item=${source.item}`,
  `panelViews[]=${encodeURIComponent(JSON.stringify(textView))}`,
].join('&')

// utils/constants.ts - SYNOPSIS_SELECTED_STYLE, the background of a target of the active connection
const SYNOPSIS_STYLE_CLASS = 'bg-synopsis-selected'
// how far apart the synced targets may sit after the panes have been aligned
const ALIGNMENT_TOLERANCE = 10

const getPanel = (index) => cy.get('[data-cy="panels-wrapper"]').find('[data-cy="panel"]').eq(index)
const getPopover = () => cy.get('[data-cy="annotation-popover-content"]')
const textPaneSelector = (contentUrl) => `[data-text-container][data-content-url="${contentUrl}"]`

describe('Synopsis: opening the witnesses of a sync target', () => {

  beforeEach(() => {
    cy.visit('/e2e.html?' + config)
    cy.get('[data-cy="panel"]').should('have.length', 1)
    getPanel(0).find('[data-cy="manifest-label"]').should('contain.text', source.title)
    getPanel(0).find(textPaneSelector(source.contentUrl)).find(source.selector).should('exist')
  })

  it('Should open each selected witness in a new panel and align its target with the clicked one', () => {
    getPanel(0).find(textPaneSelector(source.contentUrl)).find(source.selector).click()

    // 1. The target has synced targets only, so the popover shows the synopsis section alone - headed
    // by its witnesses title, without a section label
    getPopover().should('be.visible')
    getPopover().find('[data-cy="popover-section-label"]').should('not.exist')
    getPopover().find('[data-cy="popover-annotations-section"]').should('not.exist')
    getPopover().find('[data-cy="synoptical-witnesses-title"]').should('have.text', 'Synoptical Witnesses')

    // 2. It lists both witnesses, none of them opened in a panel and therefore none preselected
    getPopover().find('[data-cy="synoptical-witnesses-counter"]').should('have.text', '0/2')
    getPopover().find('[data-cy="witness-item"]').should('have.length', 2)
    witnesses.forEach(({ title }) => {
      getPopover().find('[data-cy="witness-label"]').should('contain.text', title)
    })
    getPopover().find('[data-cy="open-synced-panels"]').should('be.disabled')

    // 3. Selecting both of them
    witnesses.forEach(({ title }) => {
      getPopover().contains('[data-cy="witness-item"]', title).click()
    })
    getPopover().find('[data-cy="synoptical-witnesses-counter"]').should('have.text', '2/2')
    getPopover().find('[data-cy="witness-item"][data-selected]').should('have.length', 2)

    // 4. ... and opening them closes the popover and opens one new panel per witness, right of the
    // source panel which stays as it is
    getPopover().find('[data-cy="open-synced-panels"]').should('contain.text', '(2)').click()
    getPopover().should('not.exist')

    cy.get('[data-cy="panel"]').should('have.length', 1 + witnesses.length)
    getPanel(0).find('[data-cy="manifest-label"]').should('contain.text', source.title)

    witnesses.forEach(({ title, contentUrl, selector }) => {
      const panel = () => cy.contains('[data-cy="panel"]', title)

      // each witness has a panel of its own showing the text its target lives in
      panel().find('[data-cy="manifest-label"]').should('contain.text', title)
      panel().find(textPaneSelector(contentUrl)).find(selector)
        .should(($target) => expect($target[0].classList.contains(SYNOPSIS_STYLE_CLASS),
          `synced '${selector}' of ${title} carries the synopsis style`).to.be.true)
    })

    // 5. The clicked target is part of the connection as well ...
    getPanel(0).find(textPaneSelector(source.contentUrl)).find(source.selector)
      .should(($target) => expect($target[0].classList.contains(SYNOPSIS_STYLE_CLASS),
        `clicked '${source.selector}' carries the synopsis style`).to.be.true)

    // 6. ... and every witness target sits on the same height as the clicked one
    cy.get('[data-text-container]').should(($panes) => {
      const sourcePane = $panes.filter(`[data-content-url="${source.contentUrl}"]`)[0]
      const sourceY = getTargetPosition(sourcePane, source.selector).top

      witnesses.forEach(({ title, contentUrl, selector }) => {
        const pane = $panes.filter(`[data-content-url="${contentUrl}"]`)[0]
        expect(pane, `text pane of ${title}`).to.exist
        expect(pane.scrollTop, `text pane of ${title} scrolled to its target`).to.be.greaterThan(0)
        const y = getTargetPosition(pane, selector).top
        expect(Math.abs(y - sourceY), `y distance of '${source.selector}' and '${selector}' of ${title}`)
          .to.be.lessThan(ALIGNMENT_TOLERANCE)
      })
    })
  })
})

// The three items above, each in a panel of its own, are interconnected by further sync annotations,
// every one of them linking a target of each item:
//   - synopsis-15: '#west-egg2' (Jazz Age) - '#cape-horn' (Whale Voyages) - '#no-answer' (Country Manners)
//   - synopsis-16: '#motor-road' (Jazz Age) - '#saturday-night' (Whale Voyages) - '#same-composure' (Country Manners)
// Hovering a target of the first panel highlights the targets of its own connection in the two other
// panels - and none of the other connection.
describe('Synopsis: hovering interconnected sync targets across panels', () => {

  // The three panels the test above ends with, opened directly: Jazz Age first, then its two witnesses
  const threePanelsConfig = [
    { manifest: source.manifest, item: source.item },
    { manifest: `${base}/manifests/book2.json`, item: `${base}/items/book2-page2.json` },
    { manifest: `${base}/manifests/book1.json`, item: `${base}/items/book1-page1.json` },
  ].flatMap((panel, i) => [
    `panels[${i}].collection=${synopsisCollection}`,
    `panels[${i}].manifest=${panel.manifest}`,
    `panels[${i}].item=${panel.item}`,
  ]).concat(`panelViews[]=${encodeURIComponent(JSON.stringify(textView))}`).join('&')

  // utils/constants.ts - SYNOPSIS_HOVER_STYLE, the background of a hovered target and its synced ones
  const SYNOPSIS_HOVER_CLASS = 'bg-synopsis-hover'

  // Per connection, the target of each panel - in panel order
  const connections = [
    {
      name: 'synopsis-15',
      targets: [
        { contentUrl: source.contentUrl, selector: '#west-egg2' },
        { contentUrl: witnesses[0].contentUrl, selector: '#cape-horn' },
        { contentUrl: witnesses[1].contentUrl, selector: '#no-answer' },
      ],
    },
    {
      name: 'synopsis-16',
      targets: [
        { contentUrl: source.contentUrl, selector: '#motor-road' },
        { contentUrl: witnesses[0].contentUrl, selector: '#saturday-night' },
        { contentUrl: witnesses[1].contentUrl, selector: '#same-composure' },
      ],
    },
  ]

  const targetEl = (panelIndex, { contentUrl, selector }) =>
    getPanel(panelIndex).find(textPaneSelector(contentUrl)).find(selector)

  const expectHovered = (connection, hovered) => connection.targets.forEach((target, panelIndex) =>
    targetEl(panelIndex, target).should(hovered ? 'have.class' : 'not.have.class', SYNOPSIS_HOVER_CLASS))

  beforeEach(() => {
    cy.visit('/e2e.html?' + threePanelsConfig)
    cy.get('[data-cy="panel"]').should('have.length', 3)
    getPanel(0).find('[data-cy="manifest-label"]').should('contain.text', source.title)
    witnesses.forEach(({ title }, i) => getPanel(i + 1).find('[data-cy="manifest-label"]').should('contain.text', title))

    // every target of both connections is rendered before the first hover - the synced targets are
    // looked up in the document at the moment of the hover
    connections.forEach(({ targets }) => targets.forEach((target, panelIndex) =>
      targetEl(panelIndex, target).should('exist')))

    // ... and every panel has its sync targets wired up. The text renders before the sync annotations
    // of the collection are loaded, and only then do the targets get their hover listeners - a hover
    // that comes earlier is never retried. The Sync Target Navigation appears once a panel's sync
    // targets are known.
    for (let i = 0; i < 3; i++) getPanel(i).find('[data-cy="sync-target-navigation"]').should('exist')
  })

  it('Should hover the synced targets of the two other panels for each of two sync targets of the first panel', () => {
    const [first, second] = connections

    // nothing is hovered to begin with
    connections.forEach((connection) => expectHovered(connection, false))

    // 1. Hovering the first target highlights its connection in all three panels, not the other one
    targetEl(0, first.targets[0]).trigger('mouseenter', { force: true })
    expectHovered(first, true)
    expectHovered(second, false)

    // 2. Hovering out drops the highlight again
    targetEl(0, first.targets[0]).trigger('mouseleave', { force: true })
    expectHovered(first, false)

    // 3. Hovering the second target highlights its own connection, not the first one
    targetEl(0, second.targets[0]).trigger('mouseenter', { force: true })
    expectHovered(second, true)
    expectHovered(first, false)

    targetEl(0, second.targets[0]).trigger('mouseleave', { force: true })
    connections.forEach((connection) => expectHovered(connection, false))
  })
})

// A witness of the popover is disabled when it can not be navigated to - with an error icon and a
// tooltip telling why:
//   - its text (source.id) is not one of the contents of its item (source.item)
//   - its synced target (selector) is not found in its text
// Each test breaks the 'Whale Voyages' target of synopsis-14 in the annotation page response, while
// 'Country Manners' stays valid.
describe('Synopsis: disabled witnesses', () => {

  const annotationPageUrl = '**/example-synopsis-2/annotations/annotationPage/example.json'
  const syncAnnotationId = `${base}/annotations/annotation/synopsis-14`
  const [brokenWitness, validWitness] = witnesses

  const getWitness = (title) => getPopover().contains('[data-cy="witness-item"]', title)

  // Changes the 'Whale Voyages' target of synopsis-14 in the annotation page response
  function breakWitnessTarget(change) {
    cy.intercept('GET', annotationPageUrl, (req) => {
      req.continue((res) => {
        const page = typeof res.body === 'string' ? JSON.parse(res.body) : res.body
        const annotation = page.items.find((a) => a.id === syncAnnotationId)
        const target = annotation.target.find((t) => t.source.id === brokenWitness.contentUrl)
        change(target)
        res.send(page)
      })
    })
  }

  function openSynopsisPopover() {
    cy.visit('/e2e.html?' + config)
    cy.get('[data-cy="panel"]').should('have.length', 1)
    getPanel(0).find(textPaneSelector(source.contentUrl)).find(source.selector).should('exist').click()
    getPopover().should('be.visible')
    getPopover().find('[data-cy="witness-item"]').should('have.length', 2)
  }

  function expectDisabledWitness(description) {
    // 1. The broken witness is disabled, the valid one isn't
    getWitness(brokenWitness.title).should('have.attr', 'data-disabled')
    getWitness(brokenWitness.title).should('have.attr', 'aria-disabled', 'true')

    getWitness(validWitness.title).should('not.have.attr', 'data-disabled')

    // 2. Only the valid witness counts
    getPopover().find('[data-cy="synoptical-witnesses-counter"]').should('have.text', '0/1')

    // 3. Clicking the disabled witness doesn't select it
    getWitness(brokenWitness.title).click()
    getWitness(brokenWitness.title).should('not.have.attr', 'data-selected')
    getPopover().find('[data-cy="synoptical-witnesses-counter"]').should('have.text', '0/1')
    getPopover().find('[data-cy="open-synced-panels"]').should('be.disabled')

    // 4. Its tooltip tells what went wrong, with the error icon
    getWitness(brokenWitness.title).focus()
    cy.get('[data-cy="witness-error-tooltip"]')
      .should('be.visible')
      .and('contain.text', 'Synoptic target unavailable')
      .and('contain.text', description)
    cy.get('[data-cy="witness-error-tooltip"]').find('[data-cy="witness-error-icon"]').should('exist')

    // 5. "Select all" only selects the valid witness
    getPopover().contains('label', 'Select all').click()
    getPopover().find('[data-cy="synoptical-witnesses-counter"]').should('have.text', '1/1')
    getWitness(validWitness.title).should('have.attr', 'data-selected')
    getWitness(brokenWitness.title).should('not.have.attr', 'data-selected')
    getPopover().find('[data-cy="open-synced-panels"]').should('contain.text', '(1)')
  }

  it('Should disable a witness whose text is not part of its item', () => {
    // the item of 'Whale Voyages', Chapter 2 has no such content
    breakWitnessTarget((target) => { target.source.id = `${base}/html/not-part-of-item.html` })
    openSynopsisPopover()

    expectDisabledWitness('The text where the synoptic target should appear, was not found')
  })

  it('Should disable a witness whose synced target is not found in its text', () => {
    // the transcription of 'Whale Voyages', Chapter 2 has no such element
    breakWitnessTarget((target) => { target.selector.value = '#not-in-text' })
    openSynopsisPopover()

    expectDisabledWitness('The synoptic target was not found in the text.')
  })
})

// A sync target can be synced with several targets of the same witness (manifest). The popover then
// lists the witness once, with a badge counting its targets. Its invalid targets are split off into a
// disabled entry of their own.
// Each test replaces the witness targets of synopsis-14 in the annotation page response with three
// targets of the 'Whale Voyages' transcription, so 'Whale Voyages' is the only witness.
describe('Synopsis: a witness with multiple synced targets', () => {

  const annotationPageUrl = '**/example-synopsis-2/annotations/annotationPage/example.json'
  const syncAnnotationId = `${base}/annotations/annotation/synopsis-14`
  const [whaleVoyages] = witnesses
  const whaleVoyagesSelectors = ['#manhatto', '#cape-horn', '#new-bedford']

  const getValidWitness = () => getPopover().find('[data-cy="witness-item"]:not([data-disabled])')
  const getDisabledWitness = () => getPopover().find('[data-cy="witness-item"][data-disabled]')

  // Syncs the clicked target with the given selectors of the 'Whale Voyages' transcription only
  function syncWithWhaleVoyages(selectors) {
    cy.intercept('GET', annotationPageUrl, (req) => {
      req.continue((res) => {
        const page = typeof res.body === 'string' ? JSON.parse(res.body) : res.body
        const annotation = page.items.find((a) => a.id === syncAnnotationId)
        const ownTarget = annotation.target.find((t) => t.source.id === source.contentUrl)
        const whaleVoyagesTarget = annotation.target.find((t) => t.source.id === whaleVoyages.contentUrl)
        annotation.target = [
          ownTarget,
          ...selectors.map((value) => ({ ...whaleVoyagesTarget, selector: { ...whaleVoyagesTarget.selector, value } })),
        ]
        res.send(page)
      })
    })
  }

  function openSynopsisPopover() {
    cy.visit('/e2e.html?' + config)
    cy.get('[data-cy="panel"]').should('have.length', 1)
    getPanel(0).find(textPaneSelector(source.contentUrl)).find(source.selector).should('exist').click()
    getPopover().should('be.visible')
  }

  it('Should show one witness with a count of 3 when all of its synced targets are valid', () => {
    syncWithWhaleVoyages(whaleVoyagesSelectors)
    openSynopsisPopover()

    // 1. The three targets are listed as one witness ...
    getPopover().find('[data-cy="witness-item"]').should('have.length', 1)
    getDisabledWitness().should('not.exist')
    getValidWitness().find('[data-cy="witness-label"]').should('contain.text', whaleVoyages.title)
    getPopover().find('[data-cy="synoptical-witnesses-counter"]').should('have.text', '0/1')

    // 2. ... counting its three targets
    getValidWitness().find('[data-cy="witness-targets-count"]').should('have.text', '3')

    // 3. Selecting it selects all three targets
    getValidWitness().click()
    getPopover().find('[data-cy="synoptical-witnesses-counter"]').should('have.text', '1/1')
    getPopover().find('[data-cy="open-synced-panels"]').should('contain.text', '(3)')
  })

  it('Should split a witness into a valid one with a count of 2 and a disabled one when one of its 3 targets is invalid', () => {
    // the transcription of 'Whale Voyages', Chapter 2 has no '#not-in-text' element
    syncWithWhaleVoyages([whaleVoyagesSelectors[0], '#not-in-text', whaleVoyagesSelectors[1]])
    openSynopsisPopover()

    // 1. The witness is listed twice: once for its valid targets, once for its invalid one
    getPopover().find('[data-cy="witness-item"]').should('have.length', 2)
    getPopover().find('[data-cy="witness-label"]').each(($label) => expect($label.text()).to.contain(whaleVoyages.title))

    // 2. The valid entry counts its two valid targets
    getValidWitness().should('have.length', 1)
    getValidWitness().find('[data-cy="witness-targets-count"]').should('have.text', '2')

    // 3. The invalid entry is disabled, without a count, and its tooltip tells what went wrong
    getDisabledWitness().should('have.length', 1).and('have.attr', 'aria-disabled', 'true')
    getDisabledWitness().find('[data-cy="witness-targets-count"]').should('not.exist')
    getDisabledWitness().focus()
    cy.get('[data-cy="witness-error-tooltip"]')
      .should('be.visible')
      .and('contain.text', 'Synoptic target unavailable')
      .and('contain.text', 'The synoptic target was not found in the text.')
    cy.get('[data-cy="witness-error-tooltip"]').find('[data-cy="witness-error-icon"]').should('exist')

    // 4. Only the valid entry counts - and selecting it selects its two valid targets
    getPopover().find('[data-cy="synoptical-witnesses-counter"]').should('have.text', '0/1')
    getDisabledWitness().click()
    getPopover().find('[data-cy="synoptical-witnesses-counter"]').should('have.text', '0/1')
    getValidWitness().click()
    getPopover().find('[data-cy="synoptical-witnesses-counter"]').should('have.text', '1/1')
    getPopover().find('[data-cy="open-synced-panels"]').should('contain.text', '(2)')
  })
})

// A sync target can be part of several sync annotations - one sync connection each. The popover lists
// the witnesses of every connection in a group of its own, each with its own "select all".
// The test adds a second sync annotation for '#new-york' to the annotation page response, linking it
// with other targets of both witnesses: '#cape-horn' (Whale Voyages) and '#no-answer' (Country Manners).
describe('Synopsis: a sync target in several sync connections', () => {

  const annotationPageUrl = '**/example-synopsis-2/annotations/annotationPage/example.json'
  const syncAnnotationId = `${base}/annotations/annotation/synopsis-14`
  const secondConnection = { 'Whale Voyages': '#cape-horn', 'Country Manners': '#no-answer' }

  const getConnection = (index) => getPopover().find('[data-cy="synoptical-connection"]').eq(index)
  const selectAllOf = (index) => getConnection(index).contains('label', 'Select all')

  beforeEach(() => {
    cy.intercept('GET', annotationPageUrl, (req) => {
      req.continue((res) => {
        const page = typeof res.body === 'string' ? JSON.parse(res.body) : res.body
        const annotation = page.items.find((a) => a.id === syncAnnotationId)
        const [ownTarget, ...witnessTargets] = annotation.target
        page.items.push({
          ...annotation,
          id: `${base}/annotations/annotation/synopsis-14-second`,
          target: [
            ownTarget,
            ...witnessTargets.map((target, i) => ({
              ...target,
              selector: { ...target.selector, value: secondConnection[witnesses[i].title] },
            })),
          ],
        })
        res.send(page)
      })
    })

    cy.visit('/e2e.html?' + config)
    cy.get('[data-cy="panel"]').should('have.length', 1)
    getPanel(0).find(textPaneSelector(source.contentUrl)).find(source.selector).should('exist').click()
    getPopover().should('be.visible')
  })

  it('Should group the witnesses by sync connection, each with its own select all', () => {
    // 1. One group per sync connection, each listing both witnesses
    getPopover().find('[data-cy="synoptical-connection"]').should('have.length', 2)
    getConnection(0).find('[data-cy="synoptical-connection-title"]').should('have.text', 'Synoptical connection 1')
    getConnection(1).find('[data-cy="synoptical-connection-title"]').should('have.text', 'Synoptical connection 2')
    ;[0, 1].forEach((index) => {
      getConnection(index).find('[data-cy="witness-item"]').should('have.length', 2)
      witnesses.forEach(({ title }) => getConnection(index).find('[data-cy="witness-label"]').should('contain.text', title))
    })
    getPopover().find('[data-cy="synoptical-witnesses-counter"]').should('have.text', '0/4')

    // 2. "Select all" of the second connection selects its witnesses only
    selectAllOf(1).click()
    getConnection(1).find('[data-cy="witness-item"][data-selected]').should('have.length', 2)
    getConnection(0).find('[data-cy="witness-item"][data-selected]').should('have.length', 0)
    getPopover().find('[data-cy="synoptical-witnesses-counter"]').should('have.text', '2/4')
    getPopover().find('[data-cy="open-synced-panels"]').should('contain.text', '(2)')

    // 3. ... and the one of the first connection selects the rest
    selectAllOf(0).click()
    getPopover().find('[data-cy="witness-item"][data-selected]').should('have.length', 4)
    getPopover().find('[data-cy="synoptical-witnesses-counter"]').should('have.text', '4/4')
    getPopover().find('[data-cy="open-synced-panels"]').should('contain.text', '(4)')

    // 4. Clicking "select all" of a fully selected connection unselects it again
    selectAllOf(0).click()
    getConnection(0).find('[data-cy="witness-item"][data-selected]').should('have.length', 0)
    getPopover().find('[data-cy="synoptical-witnesses-counter"]').should('have.text', '2/4')

    // 5. Opening the witnesses of both connections opens each witness text once, highlighting the
    // targets of both connections
    selectAllOf(0).click()
    getPopover().find('[data-cy="open-synced-panels"]').click()
    getPopover().should('not.exist')
    cy.get('[data-cy="panel"]').should('have.length', 1 + witnesses.length)

    witnesses.forEach(({ title, contentUrl, selector }) => {
      const panel = () => cy.contains('[data-cy="panel"]', title)
      ;[selector, secondConnection[title]].forEach((targetSelector) => {
        panel().find(textPaneSelector(contentUrl)).find(targetSelector).should('have.class', SYNOPSIS_STYLE_CLASS)
      })
    })
  })
})
