/**
 * Panel fullscreen.
 *
 * A panel goes fullscreen on its own root element - the div PanelProvider renders around the panel -
 * rather than on the panel itself, so that portalled content (dropdowns, popovers, tooltips) can be
 * rendered inside that root via PanelContext's panelRootRef and stay visible while fullscreen.
 *
 * Why the Fullscreen API is stubbed here
 * --------------------------------------
 * Chrome refuses requestFullscreen() inside the Cypress AUT iframe: it rejects with
 * "TypeError: Permissions check failed", because Cypress renders that iframe without an
 * allow="fullscreen" permission policy. (Verified while writing this spec - the AUT iframe carries
 * no allow/allowfullscreen attribute at all, and setting one before a reload does not change the
 * outcome.) So the API is stubbed, keeping the real contract: requestFullscreen() and
 * exitFullscreen() move document.fullscreenElement and fire a bubbling "fullscreenchange".
 *
 * That exercises everything the app itself does with fullscreen - the document listener in
 * PanelContext, the isFullscreen state, the toggle's icon and label, the PanelResizer guards, and
 * the panel state that has to survive the round trip.
 *
 * The fullscreen layout itself is covered too, via the [data-fullscreen] seam: PanelProvider
 * mirrors :fullscreen onto the panel root as an attribute, and every fullscreen rule in style.css
 * matches on both. See "The fullscreen layout" below for what that can and cannot show.
 */

const apiUrl = Cypress.env('API_URL') || 'http://localhost:8181'
const collection = `${apiUrl}/example/collections/example.json`
const manifest = `${apiUrl}/example/manifests/book2.json`
// Page 3 is the item of book2 that carries annotations, so the sidebar toggle is rendered
// (PanelHeader hides it entirely when there is nothing to list).
const annotatedItem = `${apiUrl}/example/items/book2-page3.json`

const config = [
  'annotations.defaultMode=list',
  `panels[0].collection=${collection}`,
  `panels[0].manifest=${manifest}`,
  `panels[0].item=${annotatedItem}`,
].join('&')

const twoPanelConfig = [
  config,
  `panels[1].collection=${collection}`,
  `panels[1].manifest=${manifest}`,
  `panels[1].item=${annotatedItem}`,
].join('&')

const selectors = {
  panel: '[data-cy="panel"]',
  panelMenu: '[data-cy="panel-menu"]',
  panelMenuDropdown: '[data-cy="panel-menu-dropdown"]',
  fullscreenToggle: '[data-cy="fullscreen-toggle"]',
  sidebarToggle: '[data-cy="sidebar-toggle"]',
  sidebarView: '[data-sidebar-view]',
  sidebarLoading: '[data-cy="sidebar-loading"]',
  itemLabel: '[data-cy="item-label"]',
  itemsDropdown: '[data-cy="items-dropdown"]',
  resizeHandle: '[data-panel-resize-handle]',
  panelCard: '.panel-card',
  sidebarContainer: '[data-sidebar-container]',
  mainContent: '.main-content',
}

/**
 * Replaces the Fullscreen API on the AUT window with a working in-page equivalent.
 * Installed via onBeforeLoad so it is in place before any app code runs.
 */
function stubFullscreenApi(win) {
  let current = null
  const doc = win.document

  Object.defineProperty(doc, 'fullscreenElement', {
    configurable: true,
    get: () => current,
  })

  // The real event fires on the element and bubbles up to the document, which is where
  // PanelContext listens - dispatch it that way rather than straight at the document, so the
  // test would still catch a listener attached to the element instead.
  const fireChange = (target) =>
    target.dispatchEvent(new win.Event('fullscreenchange', { bubbles: true }))

  win.Element.prototype.requestFullscreen = function () {
    current = this
    fireChange(this)
    return win.Promise.resolve()
  }

  doc.exitFullscreen = function () {
    const previous = current
    current = null
    fireChange(previous ?? doc)
    return win.Promise.resolve()
  }
}

/**
 * Reproduces the part of Chrome's UA stylesheet that applies to a fullscreen element, keyed off the
 * [data-fullscreen] seam. Without this the panel root would stay an in-flow flex item sized by its own
 * content, and the fullscreen rules in style.css - which size the panel relative to its root -
 * would resolve against the wrong box and collapse the panel to its minimum width.
 */
function injectFullscreenUaStyles(doc) {
  const style = doc.createElement('style')
  style.textContent = `
    [data-fullscreen] {
      position: fixed !important;
      inset: 0 !important;
      width: 100% !important;
      height: 100% !important;
      margin: 0 !important;
      background: var(--background);
    }
  `
  doc.head.appendChild(style)
}

function visit(query = config, panelCount = 1) {
  cy.visit(`/e2e.html?${query}`, { onBeforeLoad: stubFullscreenApi })
  cy.document().then(injectFullscreenUaStyles)
  cy.get(selectors.panel).should('have.length', panelCount)
  // The item label only renders once the panel has loaded its item.
  cy.get(selectors.itemLabel).should('be.visible')
}

const panel = (index = 0) => cy.get('#panels-wrapper').find(selectors.panel).eq(index)

/** The element that actually goes fullscreen: the root PanelProvider renders around the panel. */
const panelRoot = (index = 0) => panel(index).parent()

function openPanelMenu(index = 0) {
  panel(index).find(selectors.panelMenu).click()
  return cy.get(selectors.panelMenuDropdown).should('be.visible')
}

/** Opens the panel menu and clicks the fullscreen entry, then waits for the menu to close. */
function clickFullscreenToggle(index = 0) {
  openPanelMenu(index)
  cy.get(selectors.fullscreenToggle).click()
  cy.get(selectors.panelMenuDropdown).should('not.exist')
}

function shouldBeFullscreen(index = 0) {
  panelRoot(index).then(($panelRoot) => {
    cy.document().its('fullscreenElement').should('equal', $panelRoot[0])
  })
}

function shouldNotBeFullscreen() {
  cy.document().its('fullscreenElement').should('be.null')
}

/** Asserts the label the fullscreen menu entry currently shows, with the menu left open. */
function fullscreenEntryShould(text, index = 0) {
  openPanelMenu(index)
  cy.get(selectors.fullscreenToggle).should('contain.text', text)
}

function closePanelMenu() {
  cy.get('body').type('{esc}')
  cy.get(selectors.panelMenuDropdown).should('not.exist')
}

function openSidebar(index = 0) {
  panel(index).find(selectors.sidebarToggle).click()
  cy.get(selectors.sidebarView).should('be.visible')
  cy.get(selectors.sidebarLoading).should('not.exist')
}

describe('Panel fullscreen', () => {
  describe('Entering and exiting', () => {
    beforeEach(() => visit())

    it('Should not be fullscreen initially and should offer to open fullscreen', () => {
      shouldNotBeFullscreen()
      fullscreenEntryShould('Open fullscreen')
    })

    it('Should request fullscreen on the panel root, not on the panel itself', () => {
      clickFullscreenToggle()
      shouldBeFullscreen()

      // The root is what must go fullscreen - the panel itself would leave portalled
      // content (rendered into the root) outside the fullscreen element and invisible.
      panel().then(($panel) => {
        cy.document().its('fullscreenElement').should('not.equal', $panel[0])
      })
    })

    it('Should offer to exit fullscreen once fullscreen', () => {
      clickFullscreenToggle()
      fullscreenEntryShould('Exit fullscreen')
    })

    it('Should exit fullscreen when the entry is clicked again', () => {
      clickFullscreenToggle()
      shouldBeFullscreen()

      clickFullscreenToggle()
      shouldNotBeFullscreen()
      fullscreenEntryShould('Open fullscreen')
    })
  })

  describe('The sidebar while fullscreen', () => {
    beforeEach(() => visit())

    it('Should open the sidebar while fullscreen', () => {
      clickFullscreenToggle()
      shouldBeFullscreen()

      openSidebar()
      // Still fullscreen - opening the sidebar resizes the panel, which must not drop fullscreen.
      shouldBeFullscreen()
    })

  })

  describe('State across the fullscreen round trip', () => {
    beforeEach(() => visit())

    it('Should keep the sidebar open after leaving fullscreen', () => {
      clickFullscreenToggle()
      openSidebar()

      clickFullscreenToggle()
      shouldNotBeFullscreen()

      cy.get(selectors.sidebarView).should('be.visible')
      panel().find('[data-sidebar-container]').should('have.attr', 'style').and('not.contain', 'width: 0px')
    })

    it('Should restore the windowed panel width after leaving fullscreen', () => {
      // The windowed width lives in inline styles that the :fullscreen rules only override, so it
      // has to come back untouched - no JS restore step is involved.
      let windowedWidth
      panel().then(($panel) => { windowedWidth = $panel[0].style.width })

      clickFullscreenToggle()
      clickFullscreenToggle()

      panel().then(($panel) => {
        expect($panel[0].style.width).to.equal(windowedWidth)
      })
    })

    it('Should keep the selected item across the round trip', () => {
      cy.get(selectors.itemLabel).invoke('text').then((label) => {
        clickFullscreenToggle()
        cy.get(selectors.itemLabel).should('have.text', label)

        clickFullscreenToggle()
        cy.get(selectors.itemLabel).should('have.text', label)
      })
    })
  })

  describe('The fullscreen layout', () => {
    // The panel root fills the viewport here the same way the UA stylesheet makes it fill the screen
    // (see injectFullscreenUaStyles), so these assert the part that is ours: that the fullscreen
    // rules override the windowed inline widths and derive the panel's layout from its root.
    const SCREEN_WIDTH = Cypress.config('viewportWidth')
    // PanelResizer's SIDEBAR_DEFAULT_WIDTH.
    const SIDEBAR_WIDTH = 400

    beforeEach(() => visit())

    it('Should leave the windowed widths alone until the panel is fullscreen', () => {
      // No data-fullscreen yet, so the inline width still wins - this is what shows the
      // assertions below are the fullscreen rules doing something.
      panelRoot().should('not.have.attr', 'data-fullscreen')
      panel().should('not.have.css', 'width', `${SCREEN_WIDTH}px`)
    })

    it('Should give the whole width to the main content when the sidebar is closed', () => {
      clickFullscreenToggle()
      panel().find(selectors.mainContent).should('have.css', 'width', `${SCREEN_WIDTH}px`)
    })

    it('Should split the width between main content and sidebar when the sidebar is open', () => {
      clickFullscreenToggle()
      openSidebar()

      const mainWidth = SCREEN_WIDTH - SIDEBAR_WIDTH
      panel().find(selectors.mainContent).should('have.css', 'width', `${mainWidth}px`)
      panel().find(selectors.sidebarContainer)
        .should('have.css', 'width', `${SIDEBAR_WIDTH}px`)
        .and('have.css', 'left', `${mainWidth}px`)
    })

    it('Should publish the sidebar width the layout is derived from', () => {
      // The split point is the one value the CSS cannot know by itself, so PanelResizer publishes
      // it; if it went stale the two assertions above would drift apart.
      panel().should('have.css', '--panel-sidebar-width', '0px')

      openSidebar()
      panel().should('have.css', '--panel-sidebar-width', `${SIDEBAR_WIDTH}px`)
    })

    it('Should drop the windowed card chrome while fullscreen', () => {
      panel().find(selectors.panelCard).should('not.have.css', 'border-radius', '0px')

      clickFullscreenToggle()

      panel().find(selectors.panelCard)
        .should('have.css', 'border-radius', '0px')
        .and('have.css', 'border-top-width', '0px')
        .and('have.css', 'box-shadow', 'none')
    })

    it('Should hide the resize handle while fullscreen', () => {
      panel().find(selectors.resizeHandle).should('not.have.css', 'display', 'none')

      clickFullscreenToggle()

      // Asserted on display rather than visibility: while fullscreen the panel spans the viewport,
      // so the handle - which sits just outside the panel's right edge - is off-screen and would
      // read as "not visible" to Cypress even if the rule hiding it were gone.
      panel().find(selectors.resizeHandle).should('have.css', 'display', 'none')
    })

    it('Should restore the windowed layout on exit', () => {
      clickFullscreenToggle()
      panel().should('have.css', 'width', `${SCREEN_WIDTH}px`)

      clickFullscreenToggle()

      panelRoot().should('not.have.attr', 'data-fullscreen')
      panel().then(($panel) => {
        cy.wrap($panel).should('have.css', 'width', $panel[0].style.width)
      })
      panel().find(selectors.panelCard).should('not.have.css', 'border-radius', '0px')
      panel().find(selectors.resizeHandle).should('be.visible')
    })
  })

  describe('Portalled content', () => {
    beforeEach(() => visit())

    it('Should render the panel menu inside the panel root rather than at the tido root', () => {
      // This is what makes fullscreen usable at all: menus portalled to .tido would sit outside
      // the fullscreen element and never be painted. It holds windowed too, which is why it can
      // be asserted here without real fullscreen.
      openPanelMenu()
      panelRoot().find(selectors.panelMenuDropdown).should('exist')
      cy.get('.tido').children(selectors.panelMenuDropdown).should('not.exist')
      closePanelMenu()
    })

    it('Should render the panel menu inside the fullscreen element while fullscreen', () => {
      clickFullscreenToggle()
      openPanelMenu()
      panelRoot().find(selectors.panelMenuDropdown).should('exist')
      closePanelMenu()
    })

    it('Should render the item dropdown inside the panel root', () => {
      // A second portal, in a different component to the panel menu - each portalled surface has
      // to be given the panel container individually, so each call site needs its own guard.
      cy.get(selectors.itemLabel).click()
      panelRoot().find(selectors.itemsDropdown).should('exist')
      cy.get('.tido').children(selectors.itemsDropdown).should('not.exist')
    })
  })

  describe('Resizing while fullscreen', () => {
    beforeEach(() => visit())

    it('Should not let an edge drag change the width the panel returns to', () => {
      let windowedWidth
      panel().then(($panel) => { windowedWidth = $panel[0].style.width })

      clickFullscreenToggle()

      // While fullscreen the panel edge is the screen edge and widths are CSS-driven; PanelResizer
      // ignores drags so they cannot rewrite the width restored on exit.
      panel().then(($panel) => {
        const rect = $panel[0].getBoundingClientRect()
        cy.wrap($panel)
          .trigger('mousedown', { clientX: rect.right - 4, clientY: rect.top + 50 })
        cy.window().then((win) => {
          win.dispatchEvent(new win.MouseEvent('mousemove', {
            clientX: rect.right - 300, clientY: rect.top + 50, bubbles: true
          }))
          win.dispatchEvent(new win.MouseEvent('mouseup', { bubbles: true }))
        })
      })

      clickFullscreenToggle()
      panel().then(($panel) => {
        expect($panel[0].style.width).to.equal(windowedWidth)
      })
    })
  })

  describe('With more than one panel', () => {
    beforeEach(() => visit(twoPanelConfig, 2))

    it('Should put only the panel whose toggle was used into fullscreen', () => {
      clickFullscreenToggle(1)

      // Each toggle has to act on its own panel's context - a shared or stale ref would send the
      // wrong root fullscreen.
      shouldBeFullscreen(1)
      panelRoot(0).then(($first) => {
        cy.document().its('fullscreenElement').should('not.equal', $first[0])
      })
    })

    it('Should leave the other panel believing it is not fullscreen', () => {
      clickFullscreenToggle(1)

      // fullscreenchange is a document-level event, so every panel hears it. Each one has to
      // compare the target against its own root - otherwise all of them would believe they are
      // fullscreen and lay themselves out for it. data-fullscreen is that belief, per panel.
      panelRoot(1).should('have.attr', 'data-fullscreen')
      panelRoot(0).should('not.have.attr', 'data-fullscreen')
    })
  })
})
