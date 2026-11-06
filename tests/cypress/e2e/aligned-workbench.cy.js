import { isGrouped, openEntry, slotOf } from '../support/aligned-helpers'

// The workbench of the aligned annotations sidebar: selected annotations open as cards on an overlay
// over the column, newest on top. The list behind it stands still while it is open.
describe('Aligned annotations workbench', () => {
  const apiUrl = Cypress.env('API_URL') || 'http://localhost:8181'
  const collection = `${apiUrl}/example/collections/example.json`
  const manifest = `${apiUrl}/example/manifests/book2.json`
  const item = `${apiUrl}/example/items/book2-page1.json`
  const annotationId = (name) => `${apiUrl}/example/book2/page1/rev1/${name}`

  const twoTextViews = [
    { label: 'Text', view: 'text', activeContentType: 'transcription', contentTypes: ['diplomatic', 'transcription'] },
    { label: 'Text', view: 'text', activeContentType: 'diplomatic', contentTypes: ['diplomatic', 'transcription'] },
  ].map((view) => `&panelViews[]=${encodeURIComponent(JSON.stringify(view))}`).join('')

  const selectors = {
    sidebarToggle: '[data-cy="sidebar-toggle"]',
    sidebarLoading: '[data-cy="sidebar-loading"]',
    sidebarScroll: '[data-sidebar-scroll-container]',
    textContainer: '[data-text-container]',
    workbench: '[data-workbench]',
    card: '[data-workbench-card]',
    cardHeader: '[data-workbench-card-header]',
    cardClose: '[data-workbench-close]',
    collapseAll: '[data-workbench-collapse-all]',
    closeAll: '[data-workbench-close-all]',
    note: '[data-workbench-note]',
  }

  const workbench = () => cy.get(selectors.workbench)
  const cards = () => workbench().find(selectors.card)
  const row = (id) => `[data-workbench-row="${id}"]`

  // "watery part of the world" and "Narcissus" - two annotations of the transcription a few
  // paragraphs apart.
  const watery = annotationId('annotation-19')
  const narcissus = annotationId('annotation-29')

  const open = (extraConfig = '') => {
    cy.visit(`/e2e.html?annotations.defaultMode=aligned&panels[0].collection=${collection}&panels[0].manifest=${manifest}&panels[0].item=${item}${twoTextViews}${extraConfig}`)
    cy.get(selectors.textContainer).should('have.length', 2)
    cy.get(selectors.textContainer).eq(0).find('#watery-part').should('exist')
    cy.get(selectors.sidebarToggle).click()
    cy.get(selectors.sidebarLoading).should('not.exist')
    cy.get('[data-aligned-list]').should('exist')
  }

  it('Opens a card with the note when an entry is clicked, and moves the focus to it', () => {
    open()
    openEntry(watery)

    workbench().should('be.visible')
    cards().should('have.length', 1)
    cards().first().should('have.attr', 'data-active')
    cards().first().find(row(watery)).find('> button').should('have.attr', 'aria-expanded', 'true')
    cards().first().find(row(watery)).find(selectors.note).should('contain.text', 'deliberately vague')
    cy.get(`[data-annotation="${watery}"]`).should('have.attr', 'data-selected', 'true')
    cy.get(selectors.textContainer).eq(0).find('#watery-part').should('have.attr', 'data-annotation-selected', 'true')

    cy.focused().should('have.attr', 'data-workbench-card-header')
  })

  it('Puts new cards on top and brings an open one forward instead of opening it twice', () => {
    open()
    openEntry(watery)
    workbench().find(selectors.closeAll).should('exist')

    // the list is behind the workbench now - the next entry is selected through its target
    cy.get(selectors.textContainer).eq(0).find('#narcissus').click({ scrollBehavior: 'center' })
    cards().should('have.length', 2)
    cards().first().find(row(narcissus)).should('exist')

    cy.get(selectors.textContainer).eq(0).find('#watery-part').click({ scrollBehavior: 'center' })
    cards().should('have.length', 2)
    cards().first().find(row(watery)).should('exist')
    cards().first().should('have.attr', 'data-active')
  })

  it('Opens a group as one card whose rows select their annotation', () => {
    open()

    cy.get('[data-annotation-group]').first().then(($group) => {
      const members = [...$group[0].querySelectorAll('[data-annotation]')].map((el) => el.getAttribute('data-annotation'))
      cy.wrap($group).children('button').click({ scrollBehavior: false })

      cards().should('have.length', 1)
      cards().first().find('[data-workbench-row]').should('have.length', members.length)
      cards().first().find('[data-workbench-row] > button[aria-expanded="true"]').should('have.length', 0)

      cards().first().find(row(members[1])).find('> button').click()
      cards().first().find(row(members[1])).find('> button').should('have.attr', 'aria-expanded', 'true')
      cy.get(`[data-annotation="${members[1]}"]`).should('have.attr', 'data-selected', 'true')
    })
  })

  it('Collapses and closes cards one by one and all at once, and gives the focus back', () => {
    open()
    openEntry(watery)
    cy.get(selectors.textContainer).eq(0).find('#narcissus').click({ scrollBehavior: 'center' })
    cards().should('have.length', 2)

    cards().first().find(selectors.cardHeader).click()
    cards().first().find(selectors.cardHeader).should('have.attr', 'aria-expanded', 'false')
    cards().first().find('[data-workbench-row]').should('not.exist')

    workbench().find(selectors.collapseAll).click()
    cards().find(`${selectors.cardHeader}[aria-expanded="true"]`).should('not.exist')

    // closing the active card makes the card now on top the active one - and selects its annotation
    cards().first().find(selectors.cardClose).click()
    cards().should('have.length', 1)
    cards().first().should('have.attr', 'data-active')

    workbench().find(selectors.closeAll).click()
    workbench().should('not.exist')
    cy.get(`[data-annotation="${watery}"]`).should('not.have.attr', 'data-selected')

    // the first card was opened from the watery entry - or the group holding it
    cy.get(`[data-annotation="${watery}"]`).then(($entry) => {
      const trigger = isGrouped($entry[0]) ? slotOf($entry[0]).querySelector(':scope > button') : $entry[0]
      cy.focused().should(($focused) => expect($focused[0]).to.equal(trigger))
    })
  })

  it('Closes the active card on Escape', () => {
    open()
    openEntry(watery)
    cards().should('have.length', 1)

    cy.focused().type('{esc}')
    workbench().should('not.exist')
  })

  it('Keeps the list behind the workbench still while the texts scroll on', () => {
    open()
    openEntry(watery)
    workbench().should('be.visible')

    cy.get(selectors.sidebarScroll).should('have.css', 'overflow-y', 'hidden')
    cy.get(selectors.sidebarScroll).its('0.scrollTop').then((frozenScrollTop) => {
      cy.get(selectors.textContainer).eq(0).scrollTo(0, 1200, { duration: 300 })
      cy.wait(200)
      cy.get(selectors.sidebarScroll).its('0.scrollTop').should('equal', frozenScrollTop)
    })

    // closed, the sidebar takes up the scroll position of the text that leads
    workbench().find(selectors.closeAll).click()
    cy.get(selectors.sidebarScroll).should('not.have.css', 'overflow-y', 'hidden')
    cy.get(selectors.textContainer).eq(0).then(($text) => {
      cy.get(selectors.sidebarScroll).its('0.scrollTop').should('be.closeTo', $text[0].scrollTop, 1)
    })
  })

  it('Cuts a long note after six lines and shows it in full on demand', () => {
    // make the note of "watery part of the world" long enough to be cut
    cy.intercept('GET', '**/annotationPage/book2-page1.json', (req) => {
      req.continue((res) => {
        const annotation = res.body.items.find((a) => a.id === watery)
        annotation.body.value = `<p>${'The watery part of the world draws every land walker down to the sea. '.repeat(8)}</p>`
      })
    })
    open()
    openEntry(watery)

    const note = () => cards().first().find(row(watery)).find(selectors.note)
    note().should(($note) => expect($note[0].scrollHeight).to.be.greaterThan($note[0].clientHeight))
    cards().first().find(row(watery)).contains('button', 'Show full note')
      .should('have.attr', 'aria-expanded', 'false')
      .click()
      .should('have.attr', 'aria-expanded', 'true')
      .and('contain.text', 'Show less')
    note().should(($note) => expect($note[0].scrollHeight).to.equal($note[0].clientHeight))
  })

  describe('Sub-annotations', () => {
    // The Great Gatsby, Page 2: annotation-1 targets #valley in the transcription, and a chain of
    // annotations hangs off it, each one targeting the note of the one before.
    const gatsby = (name) => `${apiUrl}/example/book3/page2/rev1/${name}`
    const root = gatsby('annotation-1')
    const level2 = gatsby('annotation-L2-1')
    const level3 = gatsby('annotation-L3-1')

    beforeEach(() => {
      const view = encodeURIComponent(JSON.stringify({ label: 'Text', view: 'text', activeContentType: 'transcription' }))
      cy.request(collection).its('body.manifests').then((manifests) => {
        cy.request(manifests[2]).its('body.items').then((items) => {
          cy.visit(`/e2e.html?annotations.defaultMode=aligned&panels[0].collection=${collection}&panelViews[]=${view}&panels[0].manifest=${manifests[2]}&panels[0].item=${items[1]}`)
        })
      })
      cy.get(selectors.textContainer).find('#valley').should('exist')
      cy.get(selectors.sidebarToggle).click()
      cy.get(selectors.sidebarLoading).should('not.exist')
      openEntry(root)
    })

    it('Lists the sub-annotations under the note and opens them down the chain', () => {
      cards().first().find(row(root)).contains('h4', 'Sub-annotations (1)')

      cards().first().find(row(level2)).find('> button').click()
      cards().first().find(row(level2)).find('> button').should('have.attr', 'aria-expanded', 'true')
      cy.get(selectors.workbench).find(row(level2)).find(selectors.note).should('contain.text', 'post-war wasteland tradition')

      cards().first().find(row(level3)).find('> button').click()
      cards().first().find(row(level3)).find('> button').should('have.attr', 'aria-expanded', 'true')
    })

    it('Opens a sub-annotation when its target is clicked in the note', () => {
      cards().first().find(row(root)).find(selectors.note).find('#ash-valley-decay').click()
      cards().first().find(row(level2)).find('> button').should('have.attr', 'aria-expanded', 'true')
    })

    it('Closes the deepest open sub-annotation on Escape, then the card', () => {
      cards().first().find(row(level2)).find('> button').click()
      cards().first().find(row(level3)).find('> button').click()
      cards().first().find(row(level3)).find('> button').should('have.attr', 'aria-expanded', 'true')

      cy.focused().type('{esc}')
      cards().first().find(row(level3)).find('> button').should('have.attr', 'aria-expanded', 'false')
      cards().first().find(row(level2)).find('> button').should('have.attr', 'aria-expanded', 'true')

      cy.focused().type('{esc}')
      cards().first().find(row(level2)).find('> button').should('have.attr', 'aria-expanded', 'false')

      cy.focused().type('{esc}')
      workbench().should('not.exist')
    })
  })
})
