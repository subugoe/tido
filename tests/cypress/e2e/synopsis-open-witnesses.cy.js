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

    // 1. The target has synced targets only, so the popover shows the synopsis section alone
    getPopover().should('be.visible')
    getPopover().find('[data-cy="popover-section-label"]').should('have.length', 1).and('have.text', 'Synopsis')
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
