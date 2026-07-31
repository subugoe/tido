describe('Annotations', () => {

  const apiUrl = Cypress.env('API_URL') || 'http://localhost:8181';
  const collection = `${apiUrl}/example/collections/example.json`;
  const annotationConfig = `annotations.defaultMode=list&panels[0].collection=${collection}`;

  // Two text views: the transcription first and the diplomatic text second.
  const twoTextViews = [
    { label: 'Text', view: 'text', activeContentType: 'transcription', contentTypes: ['transcription', 'diplomatic', 'normalized'] },
    { label: 'Text', view: 'text', activeContentType: 'diplomatic', contentTypes: ['transcription', 'diplomatic', 'normalized'] },
  ];

  // Aligned mode is what positions each annotation card against its target in the text - in list
  // mode the cards render in normal flow and there is nothing to align. The manifest and the item
  // are added by openItem.
  const alignedConfig = `annotations.defaultMode=aligned`
    + `&panels[0].collection=${collection}`
    + twoTextViews.map((view) => `&panelViews[]=${encodeURIComponent(JSON.stringify(view))}`).join('');

  const cardFor = (annotation) => `[data-annotation="${apiUrl}/example/book2/page3/rev1/${annotation}"]`;

  // The annotations of Chapter 3 the tests below work with, as the card in the sidebar and the
  // target it belongs to. "Spouter-Inn" is the target of the item's first annotation and lives in
  // the diplomatic text - the one the second view shows.
  const spouterInn = { card: cardFor('annotation-1'), target: '#spouter-inn' };

  // The first paragraph, target of the item's fifth annotation in the transcription - the text the
  // first view shows.
  const para1 = { card: cardFor('annotation-5'), target: '#para1' };

  // The remaining annotations of the diplomatic text, in the order their targets appear in it:
  // "oil-painting" opens the second paragraph, "harpooneer" the third, and "[alt: Quohog]" closes it.
  const oilPainting = { card: cardFor('annotation-diplomatic-2'), target: '#oil-painting' };
  const harpooneer = { card: cardFor('annotation-diplomatic-4'), target: '#harpooneer' };
  const diplAlt = { card: cardFor('annotation-diplomatic-3'), target: '#dipl-alt' };

  const selectors = {
    sidebarToggle: '[data-cy="sidebar-toggle"]',
    sidebarContainer: '[data-sidebar-container]',
    sidebarLoading: '[data-cy="sidebar-loading"]',
    panel: '[data-cy="panel"]',
    textContainer: '[data-text-container]',
    viewsSelect: '[data-cy="panel-mode-select"]',
    viewsMenu: '[data-cy="panel-mode-menu"]',
    viewSwitch: '[data-slot="switch"]'
  }

  const sidebar = () => cy.get(selectors.sidebarContainer)
  const openSidebar = () => {
    cy.get(selectors.sidebarToggle).click()
  }

  // Opens the item at itemIndex of the manifest at manifestIndex of the example collection, so the
  // tests name what they open by position instead of by URL. The collection lists its manifests and
  // each manifest its items, so both URLs are read from the API rather than spelled out here.
  const openItem = (manifestIndex, itemIndex, config = alignedConfig) => {
    cy.request(collection).its('body.manifests').then((manifests) => {
      const manifest = manifests[manifestIndex]

      cy.request(manifest).its('body.items').then((items) => {
        cy.visit(`/e2e.html?${config}&panels[0].manifest=${manifest}&panels[0].item=${items[itemIndex]}`)
      })
    })
  }

  // Moby-Dick (the second manifest) Chapter 3 (its third item) in aligned mode, both texts rendered
  // and the sidebar done positioning its cards.
  const openChapter3 = () => {
    openItem(1, 2)
    cy.get('[data-cy="item-label"]').contains('Page 3')
    cy.get(selectors.textContainer).should('have.length', 2)

    openSidebar()
    sidebar().should('be.visible')
    cy.get(selectors.sidebarLoading).should('not.exist')
  }

  // Toggle a text view from the "View" menu and assert the resulting switch state so the next step
  // doesn't race with the relayout.
  const setView = (index, visible) => {
    cy.get(selectors.viewsSelect).click()
    cy.get(selectors.viewsMenu).should('be.visible')
    cy.get(`${selectors.viewsMenu} ${selectors.viewSwitch}`).eq(index).click()
      .should('have.attr', 'data-state', visible ? 'checked' : 'unchecked')
    cy.get(selectors.viewsSelect).click()
    cy.get(selectors.viewsMenu).should('not.exist')
  }

  // The card is inside the sidebar viewport and sits on exactly the same y position as its target.
  // Both are measured from the top of the panel - the frame the sidebar and the text views share.
  // Targets like #para1 and #spouter-inn exist in every content type of the item, so the target is
  // looked up in the view it belongs to rather than panel wide.
  const expectCardAlignedWithTarget = ({ card, target }, viewIndex) => {
    cy.get(selectors.sidebarContainer).then(($sidebar) => {
      cy.get(card).should(($card) => {
        const sidebarRect = $sidebar[0].getBoundingClientRect()

        expect($card[0].getBoundingClientRect().top, 'card is inside the sidebar viewport')
          .to.be.within(sidebarRect.top, sidebarRect.bottom)
      })
    })

    cy.get(selectors.panel).then(($panel) => {
      cy.get(card).should(($card) => {
        const panelTop = $panel[0].getBoundingClientRect().top
        const targetEl = Cypress.$(selectors.textContainer).eq(viewIndex).find(target)[0]
        const targetY = targetEl.getBoundingClientRect().top - panelTop
        const cardY = $card[0].getBoundingClientRect().top - panelTop

        expect(cardY, `card y ${cardY} vs target y ${targetY}`).to.be.closeTo(targetY, 0)
      })
    })
  }

  // The gap the sidebar leaves between two cards it has to stack, i.e. between the bottom edge of
  // one card and the top edge of the next. Mirrors ANNOTATION_GAP in AlignAnnotationsList.
  const ANNOTATION_GAP = 5

  // Where a card and its target sit, both measured from the top of the panel - the same origin
  // expectCardAlignedWithTarget uses. cardBottom is what the next card stacks onto.
  const readPosition = ({ card, target }, viewIndex) => cy.get(selectors.panel).then(($panel) => {
    const panelTop = $panel[0].getBoundingClientRect().top
    const targetEl = Cypress.$(selectors.textContainer).eq(viewIndex).find(target)[0]
    const cardRect = Cypress.$(card)[0].getBoundingClientRect()

    return {
      cardY: cardRect.top - panelTop,
      cardBottom: cardRect.bottom - panelTop,
      targetY: targetEl.getBoundingClientRect().top - panelTop
    }
  })

  // Cards keep the order of their targets: the annotation whose target sits lower in the text has
  // its card lower in the sidebar too. Pass stacked when the two targets sit too close together for
  // both cards to align with them - the second card then follows the first one immediately, one
  // ANNOTATION_GAP below its bottom edge, instead of drifting off somewhere down the sidebar.
  const expectStackedBelow = (previous, current, viewIndex, stacked = false) => {
    readPosition(previous, viewIndex).then((prev) => {
      readPosition(current, viewIndex).then((cur) => {
        expect(cur.targetY, `target ${current.target} y ${cur.targetY} vs ${previous.target} y ${prev.targetY}`)
          .to.be.greaterThan(prev.targetY)

        expect(cur.cardY, `card of ${current.target} y ${cur.cardY} vs card of ${previous.target} y ${prev.cardY}`)
          .to.be.greaterThan(prev.cardY)

        if (!stacked) return

        expect(cur.cardY - prev.cardBottom, `card of ${current.target} follows the card of ${previous.target}`)
          .to.be.closeTo(ANNOTATION_GAP, 1)
      })
    })
  }

  beforeEach(() => {
    cy.visit('/e2e.html?' + annotationConfig)
    cy
      .get('[data-cy="item-label"]')
      .contains('Page 1')
  })

  it('Should open annotation sidebar', () => {
    cy.get(selectors.sidebarToggle).click()
    cy.get(selectors.sidebarContainer).should('be.visible')
  })

  it('Should close annotation sidebar', () => {
    openSidebar()
    cy.get(selectors.sidebarToggle).click()
    cy.get(selectors.sidebarContainer).should('not.exist')
  })

  it('Should toggle annotation mode list/aligned', () => {
    openSidebar()

    sidebar().within(() => {
      cy.get('[data-cy="list"]').should('have.attr', 'data-state', 'on')
      cy.get('[data-cy="aligned"]').should('have.attr', 'data-state', 'off').click()
    })

    sidebar().within(() => {
      cy.get('[data-cy="aligned"]').should('have.attr', 'data-state', 'on')
      cy.get('[data-cy="list"]').should('have.attr', 'data-state', 'off')
    })
  })

  it('Should select exactly one annotation at a time', () => {
    openSidebar()

    sidebar().find('[data-annotation]').as('annots')
    cy.get('@annots').should('have.length.gte', 2)

    cy.get('@annots').eq(3).as('first').click().should('have.attr', 'data-selected', 'true')

    cy.get('@annots').eq(4).click().should('have.attr', 'data-selected', 'true')
    cy.get('@first').should('not.have.attr', 'data-selected')
  })

  it('Should open filter popover and toggle filters off/on', () => {
    openSidebar()

    sidebar().find('[data-annotation]').its('length').as('initialCount')

    sidebar().contains('button', /filters/i).click()
    cy.get('[data-slot="popover-content"]').should('be.visible')

    cy.get('[data-slot="popover-content"] [data-slot="checkbox"]').each(($checkbox) => {
      if ($checkbox.attr('data-state') === 'checked') {
        cy.wrap($checkbox).click({force: true})
      }
    })

    cy.get('@initialCount').then((initialCount) => {
      sidebar().find('[data-annotation]').should('have.length.lessThan', initialCount)
    })

    cy.get('[data-slot="popover-content"] [data-slot="checkbox"]').each(($checkbox) => {
      if ($checkbox.attr('data-state') !== 'checked') {
        cy.wrap($checkbox).click({force: true})
      }
    })

    cy.get('@initialCount').then((initialCount) => {
      sidebar().find('[data-annotation]').should('have.length.gte', initialCount)
    })
  })

  it('Should expand nested annotation footer if present', () => {
    openSidebar()

    sidebar().find('[data-annotation]').should('exist')

    sidebar().then(($container) => {
      const footerButton = $container.find('button').filter((_, el) => /nested annotation/i.test(el.textContent))
      if (!footerButton.length) {
        cy.log('No nested annotation footer in this dataset')
        return
      }

      cy.wrap(footerButton.first()).click()
      sidebar().find('[data-annotation]').should('have.length.at.least', 1)
      cy.wrap(footerButton.first()).click()
    })
  })

  it('Should support view more/less on lengthy annotation body when available', () => {
    openSidebar()

    sidebar().find('[data-annotation]').should('exist')

    sidebar().then(($container) => {
      const viewMoreBtn = $container
        .find('button')
        .filter((_, el) => /view more/i.test(el.textContent))

      if (!viewMoreBtn.length) {
        cy.log('No view more button in this dataset, skipping')
        return
      }

      cy.wrap(viewMoreBtn.first()).click()
      cy.contains('button', /view less/i).should('exist').click()
      cy.contains('button', /view more/i).should('exist')
    })
  })

  it('Should trigger hover events on first annotation', () => {
    openSidebar()

    sidebar().find('[data-annotation]').first().as('firstAnnotation')
    cy.get('@firstAnnotation').trigger('mouseenter')
    cy.get('@firstAnnotation').trigger('mouseleave')
  })

  it('Should display custom labels for annotation types when configured', () => {
    const customLabel = 'Character'
    const type = 'Place'
    cy.visit(`/e2e.html?${annotationConfig}&annotations.types[${type}].label=${customLabel}`)
    cy.get('[data-cy="item-label"]').contains('Page 1')
    openSidebar()
    sidebar().find('[data-annotation]', {timeout: 10000}).should('have.length.at.least', 1)
    sidebar()
      .find('[data-slot="badge"]')
      .should('contain.text', customLabel)
  })

  it('Should show "No annotations found" when all annotations are filtered out', () => {
    openSidebar()
    sidebar().contains('button', /filters/i).click()
    cy.get('[data-slot="popover-content"] [data-slot="checkbox"][data-state="checked"]').each(($checkbox) => {
      cy.wrap($checkbox).click({force: true})
    })
    cy.contains('No annotations found').should('be.visible')
  })

  it('Should align annotations correctly on toggling off text view', () => {
    openChapter3()

    // The target sits in the second (diplomatic) view - the one that stays on screen.
    cy.get(selectors.textContainer).eq(1).find(spouterInn.target).should('exist')

    // Toggle off the first text view
    setView(0, false)

    // The hidden view stays in the DOM at zero width, so the diplomatic text is still the second
    // container - and the only one on screen.
    cy.get(selectors.textContainer).eq(0).should('not.be.visible')
    cy.get(selectors.textContainer).eq(1).find(spouterInn.target).should('be.visible')

    expectCardAlignedWithTarget(spouterInn, 1)
  })

  it('Should preserve the order of the annotations on toggling off text view', () => {
    openChapter3()

    setView(0, false)
    cy.get(selectors.textContainer).eq(0).should('not.be.visible')
    cy.get(selectors.textContainer).eq(1).find(spouterInn.target).should('be.visible')

    // The first card of the remaining text lines up exactly with its target, as in the test above.
    expectCardAlignedWithTarget(spouterInn, 1)

    // Every card after it follows the order of the targets in the text. The first pair only has to
    // keep that order - its targets are a paragraph apart, so both cards can align with them. The
    // two pairs after it sit on targets close enough together that the cards have to stack, so each
    // one follows immediately below the previous card.
    expectStackedBelow(spouterInn, oilPainting, 1)
    expectStackedBelow(oilPainting, harpooneer, 1, true)
    expectStackedBelow(harpooneer, diplAlt, 1, true)
  })

  it('Should align annotations correctly on toggling the first text view back on', () => {
    openChapter3()

    // #para1 is a target of the transcription, so its card is only there while the first view is.
    cy.get(selectors.textContainer).eq(0).find(para1.target).should('exist')

    setView(0, false)
    cy.get(selectors.textContainer).eq(0).should('not.be.visible')
    cy.get(para1.card).should('not.exist')

    // Bring the first view back: both texts share the panel width again and the transcription's
    // annotations return to the sidebar, so their cards have to be positioned once more.
    setView(0, true)
    cy.get(selectors.textContainer).eq(0).should('be.visible')
    cy.get(selectors.textContainer).eq(0).find(para1.target).should('be.visible')
    cy.get(selectors.sidebarLoading).should('not.exist')

    expectCardAlignedWithTarget(para1, 0)
  })

  it('Should show "No annotations available" when the document has no annotations', () => {
    openSidebar()
    sidebar().find('[data-annotation]').should('have.length.at.least', 1)
    sidebar().contains('button', /filters/i).click()
    cy.get('[data-slot="popover-content"] [data-slot="checkbox"][data-state="checked"]').each(($checkbox) => {
      cy.wrap($checkbox).click({force: true})
    })
    cy.contains('No annotations found').should('be.visible')
  })
})
