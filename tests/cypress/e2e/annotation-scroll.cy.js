describe('Annotation scrolling and alignment', () => {

  const apiUrl = Cypress.env('API_URL') || 'http://localhost:8181';
  const collection = `${apiUrl}/example/collections/example.json`;
  const manifest = `${apiUrl}/example/manifests/book2.json`;
  const item = `${apiUrl}/example/items/book2-page1.json`;

  // Aligned mode is what positions every annotation card against its target in the text - the
  // list mode renders the cards in normal flow and has nothing to align.
  const config = `annotations.defaultMode=aligned&panels[0].collection=${collection}&panels[0].manifest=${manifest}&panels[0].item=${item}`;

  const cardFor = (annotation) => `[data-annotation="${apiUrl}/example/book2/page1/rev1/${annotation}"]`

  // "watery part of the world" sits in the first paragraph of Chapter 1, roughly halfway down the
  // transcription, so it is off screen until the text is scrolled to it.
  const targetSelector = '#watery-part'
  const card = cardFor('annotation-19')

  // "Narcissus" sits several paragraphs further down, so selecting it means moving on from the
  // position "watery part of the world" left the text and the sidebar in.
  const secondTargetSelector = '#narcissus'
  const secondCard = cardFor('annotation-29')

  // "meditation and water are wedded for ever" closes the paragraph just above "Narcissus", so
  // selecting it means moving the selection back up the text.
  const thirdTargetSelector = '#meditation-water'
  const thirdCard = cardFor('annotation-28')

  // "never mind how long precisely" is spelled out as its own target in the diplomatic text only,
  // so clicking it is only possible in a view showing that content type.
  const diplomaticTargetSelector = '#dipl-precisely'
  const diplomaticCard = cardFor('annotation-diplomatic-1')

  // Two text views side by side: the transcription on the left and the diplomatic text on the
  // right, the same pairing the example config ships.
  const twoTextViews = [
    { label: 'Text', view: 'text', activeContentType: 'transcription', contentTypes: ['diplomatic', 'transcription', 'translation'] },
    { label: 'Text', view: 'text', activeContentType: 'diplomatic', contentTypes: ['diplomatic', 'transcription', 'translation', 'normalized'] },
  ]
  const twoTextViewsConfig = twoTextViews
    .map((view) => `&panelViews[]=${encodeURIComponent(JSON.stringify(view))}`)
    .join('')

  const selectors = {
    panel: '[data-cy="panel"]',
    sidebarContainer: '[data-sidebar-container]',
    sidebarLoading: '[data-cy="sidebar-loading"]',
    sidebarScroll: '[data-sidebar-scroll-container]',
    sidebarToggle: '[data-cy="sidebar-toggle"]',
    textContainer: '[data-text-container]',
  }

  // Vertical distance from the top of the panel - the frame both the text and the sidebar live in.
  const yInPanel = (el, panel) => el.getBoundingClientRect().top - panel.getBoundingClientRect().top

  // The overlay covers the sidebar while the annotations load and while the cards are being
  // positioned. Nothing about their placement is final until it is gone.
  const waitForSidebar = () => {
    cy.get(selectors.sidebarContainer).should('be.visible')
    cy.get(selectors.sidebarLoading).should('not.exist')
  }

  // Puts the target at a given fraction of the text container height, measured from its top, so
  // the click starts from a scrolled position rather than from the top of the document.
  const scrollTargetTo = (target, fraction) => {
    cy.get(selectors.textContainer).then(($container) => {
      const container = $container[0]
      const targetEl = container.querySelector(target)
      const targetTop = targetEl.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop

      cy.wrap(container).scrollTo(0, targetTop - (container.clientHeight * fraction) + (targetEl.offsetHeight / 2), { duration: 1000 })
    })

    cy.get(selectors.textContainer).should(($container) => {
      const container = $container[0]
      const targetEl = container.querySelector(target)
      const targetMiddle = targetEl.getBoundingClientRect().top + (targetEl.offsetHeight / 2) - container.getBoundingClientRect().top

      expect(targetMiddle, `target sits at ${fraction * 100}% of the text height`)
        .to.be.closeTo(container.clientHeight * fraction, 2)
    })
  }

  // Puts the annotation card at a given fraction of the sidebar height, measured from its top, so
  // the click starts from a scrolled sidebar rather than from the top of the annotation list.
  const scrollCardIntoSidebarAt = (annotationCard, fraction) => {
    cy.get(selectors.sidebarScroll).then(($sidebar) => {
      const sidebar = $sidebar[0]
      const cardEl = sidebar.querySelector(annotationCard)
      const cardTop = cardEl.getBoundingClientRect().top - sidebar.getBoundingClientRect().top + sidebar.scrollTop

      cy.wrap(sidebar).scrollTo(0, cardTop - (sidebar.clientHeight * fraction), { duration: 1000 })
    })

    cy.get(selectors.sidebarScroll).should(($sidebar) => {
      const sidebar = $sidebar[0]
      const cardEl = sidebar.querySelector(annotationCard)
      const cardY = cardEl.getBoundingClientRect().top - sidebar.getBoundingClientRect().top

      expect(cardY, `card sits at ${fraction * 100}% of the sidebar height`)
        .to.be.closeTo(sidebar.clientHeight * fraction, 2)
    })
  }

  // A selection made in the text syncs the sidebar to the text scroll position.
  const expectSidebarToFollowText = () => {
    cy.get(selectors.textContainer).then(($text) => {
      cy.get(selectors.sidebarScroll).should(($sidebar) => {
        expect($sidebar[0].scrollTop, 'sidebar scrollTop follows text scrollTop')
          .to.be.closeTo($text[0].scrollTop, 1)
      })
    })
  }

  // The card ends up inside the visible part of the sidebar, at the same height as its target.
  // Pass a tolerance of 0 to require the two to sit on exactly the same y position.
  const expectCardAlignedWithTarget = (annotationCard, target, tolerance = 1) => {
    cy.get(selectors.sidebarScroll).then(($sidebar) => {
      cy.get(annotationCard).should(($card) => {
        const sidebarRect = $sidebar[0].getBoundingClientRect()
        const cardTop = $card[0].getBoundingClientRect().top

        expect(cardTop, 'card is inside the sidebar viewport').to.be.within(sidebarRect.top, sidebarRect.bottom)
      })
    })

    cy.get(selectors.panel).then(($panel) => {
      cy.get(annotationCard).should(($card) => {
        const targetEl = Cypress.$(target)[0]
        const targetY = yInPanel(targetEl, $panel[0])
        const cardY = yInPanel($card[0], $panel[0])

        expect(cardY, `card y ${cardY} vs target y ${targetY}`).to.be.closeTo(targetY, tolerance)
      })
    })
  }

  // Scrolls "watery part of the world" into the middle of the text and clicks it, which opens the
  // sidebar and aligns its card with the target. Test 1 asserts this end state; the tests after it
  // start from there.
  const selectFirstAnnotationInText = () => {
    scrollTargetTo(targetSelector, 0.5)

    // The target has to be clicked centred: Cypress scrolls a subject to the top of the container
    // before clicking, and there the content type toolbar floats over the text.
    cy.get(selectors.textContainer).find(targetSelector).click({ scrollBehavior: 'center' })

    waitForSidebar()
    cy.get(card).should('have.attr', 'data-selected', 'true')
      .wait(100)
  }

  // Loads the item. Tests needing a different panel layout pass their own config on top.
  const visitItem = (extraConfig = '') => {
    cy.visit('/e2e.html?' + config + extraConfig)
    cy.get('[data-cy="item-label"]').contains('Moby-Dick, Chapter 1 - Loomings')
    cy.get(selectors.textContainer).find(targetSelector).should('exist')
  }

  it('Should click a target and open the sidebar + align the annotation with its target', () => {
    visitItem()

    selectFirstAnnotationInText()

    expectSidebarToFollowText()
    expectCardAlignedWithTarget(card, targetSelector)
  })

  it('Should scroll the text to the target when the annotation is selected in the sidebar', () => {
    visitItem()

    // Open the sidebar without touching the text, so the target is still off screen.
    cy.get(selectors.sidebarToggle).click()
    waitForSidebar()

    cy.get(selectors.textContainer).its('0.scrollTop').should('equal', 0)

    // Bring the card 20% down the sidebar before selecting it, so the selection happens from a
    // scrolled sidebar position.
    scrollCardIntoSidebarAt(card, 0.2)

    cy.get(selectors.sidebarScroll).its('0.scrollTop').as('sidebarScrollTopBeforeClick')

    cy.get(card).click({ scrollBehavior: false }).should('have.attr', 'data-selected', 'true')

    // Selecting in the sidebar marks the target in the text too.
    cy.get(selectors.textContainer).find(targetSelector)
      .should('have.attr', 'data-annotation-selected', 'true')

    // The text scrolls down to bring the target up to the card.
    cy.get(selectors.textContainer).its('0.scrollTop').should('be.greaterThan', 200)

    // Only the text moves: the card stays exactly where the sidebar was scrolled to.
    cy.get('@sidebarScrollTopBeforeClick').then((scrollTopBeforeClick) => {
      cy.get(selectors.sidebarScroll).its('0.scrollTop')
        .should('equal', scrollTopBeforeClick)
    })

    cy.get(selectors.panel).then(($panel) => {
      cy.get(selectors.textContainer).find(targetSelector).should(($target) => {
        const cardEl = Cypress.$(card)[0]
        const targetY = yInPanel($target[0], $panel[0])
        const cardY = yInPanel(cardEl, $panel[0])

        expect(targetY, `target y ${targetY} vs card y ${cardY}`).to.be.closeTo(cardY, 1)
      })
    })
  })

  it('Should follow a second target clicked further down the text', () => {
    visitItem()

    // Start from the end state of the first test: sidebar open, "watery part of the world"
    // selected and aligned in the middle of the panel.
    selectFirstAnnotationInText()

    // Move on to "Narcissus", a few paragraphs below, and leave it at 75% of the text height so
    // the click happens well away from where the previous selection sat.
    scrollTargetTo(secondTargetSelector, 0.75)

    // Clicking without Cypress re-scrolling keeps the target at the 75% position.
    cy.get(selectors.textContainer).find(secondTargetSelector).click({ scrollBehavior: false })

    cy.get(secondCard).should('have.attr', 'data-selected', 'true')
      .wait(100)
    cy.get(card).should('not.have.attr', 'data-selected', 'true')

    expectSidebarToFollowText()
    expectCardAlignedWithTarget(secondCard, secondTargetSelector)

    // Now select the target sitting just above it, without scrolling the text first: the card has
    // to land on exactly the same y position as the target, not merely close to it.
    cy.get(selectors.textContainer).find(thirdTargetSelector).click({ scrollBehavior: false })

    cy.get(thirdCard).should('have.attr', 'data-selected', 'true')
      .wait(100)
    cy.get(secondCard).should('not.have.attr', 'data-selected', 'true')

    expectSidebarToFollowText()
    expectCardAlignedWithTarget(thirdCard, thirdTargetSelector, 0)
  })

  it('Should scroll the sidebar back to the annotation when a target in the second text view is clicked', () => {
    visitItem(twoTextViewsConfig)

    cy.get(selectors.textContainer).should('have.length', 2)
    cy.get(selectors.textContainer).eq(1).find(diplomaticTargetSelector).should('exist')

    cy.get(selectors.sidebarToggle).click()
    waitForSidebar()

    // Park the sidebar at the very bottom, far away from where the diplomatic annotation sits.
    cy.get(selectors.sidebarScroll).scrollTo('bottom', { duration: 1000 })
    cy.get(selectors.sidebarScroll).its('0.scrollTop').should('be.greaterThan', 0)
      .as('sidebarScrollTopAtBottom')

    cy.get(selectors.textContainer).eq(1).find(diplomaticTargetSelector).click({ scrollBehavior: false })

    cy.get(diplomaticCard).should('have.attr', 'data-selected', 'true')
      .wait(100)

    // The sidebar has to leave the bottom to bring the card back into view.
    cy.get('@sidebarScrollTopAtBottom').then((scrollTopAtBottom) => {
      cy.get(selectors.sidebarScroll).its('0.scrollTop').should('be.lessThan', scrollTopAtBottom)
    })

    expectCardAlignedWithTarget(diplomaticCard, diplomaticTargetSelector, 0)
  })
})
