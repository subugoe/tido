describe('Annotation popover content', () => {

  const apiUrl = Cypress.env('API_URL') || 'http://localhost:8181';
  const collection = `${apiUrl}/example/collections/example.json`;
  const manifest = `${apiUrl}/example/manifests/book1.json`;
  const item = `${apiUrl}/example/items/book1-page1.json`;
  const annotation = (id) => `${apiUrl}/example/book1/page1/rev1/${id}`;

  const selectors = {
    textContainer: '[data-text-container]',
    sidebarContainer: '[data-sidebar-view]',
    popover: '[data-cy="annotation-popover-content"]',
    tooltipSection: '[data-cy="popover-tooltip-section"]',
    tooltipItem: '[data-cy="popover-tooltip-item"]',
    sectionLabel: '[data-cy="popover-section-label"]',
  };

  // Book 1 (Pride and Prejudice) page 1, transcription only, with the given tooltip types
  const openPage1 = ({ tooltipTypes = [], crossRefContentType, mode = 'list' } = {}) => {
    const params = new URLSearchParams()
    params.set('annotations.defaultMode', mode)
    if (crossRefContentType) params.set('annotations.crossRefContentType', crossRefContentType)
    params.set('panels[0].collection', collection)
    params.set('panels[0].manifest', manifest)
    params.set('panels[0].item', item)
    params.append('panelViews[]', JSON.stringify({
      label: 'Text',
      view: 'text',
      activeContentType: 'transcription',
      contentTypes: ['transcription', 'diplomatic', 'normalized'],
    }))
    tooltipTypes.forEach((type) => params.append('annotations.tooltipTypes[]', type))

    cy.visit(`/e2e.html?${params.toString()}`)
    cy.get('[data-cy="item-label"]').contains('Page 1')
  }

  const target = (selector) => cy.get(selectors.textContainer).find(selector)
  const popover = () => cy.get(selectors.popover)

  describe('only 1 tooltip annotation', () => {
    // #bennet is only targeted by annotation-3, a Character annotation - configured as tooltip type
    beforeEach(() => {
      openPage1({ tooltipTypes: ['Character'] })
    })

    it('Gives the target its annotation id and the highlight style', () => {
      target('#bennet')
        .should('have.attr', 'data-annotation-ids', annotation('annotation-3'))
        .and('have.class', 'bg-accent')
    })

    it('Shows the popover with the tooltip annotation when clicking the target', () => {
      target('#bennet').click()

      popover().should('be.visible')

      // only the tooltip section, holding the one tooltip annotation
      popover().find(selectors.sectionLabel).should('have.length', 1).and('have.text', 'Tooltip')
      popover().find(selectors.tooltipSection).should('exist')
      popover().find(selectors.tooltipItem).should('have.length', 1)
        .and('contain.text', 'Mr. Bennet - The patriarch of the Bennet family')
        .and('contain.text', 'Character')

      // a tooltip annotation is shown in place - it is not selected in the sidebar
      cy.get(selectors.sidebarContainer).should('not.exist')
    })
  })

  describe('2 tooltip annotations', () => {
    // #truth is only targeted by annotation-1 (Literary Analysis) and annotation-7 (Rhetorical Analysis) -
    // both types configured as tooltip types. Unlike #man it is no sync target, so the popover has no
    // synopsis section.
    beforeEach(() => {
      openPage1({ tooltipTypes: ['Literary Analysis', 'Rhetorical Analysis'] })
    })

    it('Gives the target both annotation ids and the highlight style', () => {
      target('#truth')
        .should('have.attr', 'data-annotation-ids')
        .then((ids) => {
          expect(ids.split(',')).to.have.members([annotation('annotation-1'), annotation('annotation-7')])
        })
      target('#truth').should('have.class', 'bg-accent')
    })

    it('Shows the popover with both tooltip annotations when clicking the target', () => {
      target('#truth').click()

      popover().should('be.visible')

      // only the tooltip section, holding both tooltip annotations in the order of the annotation page
      popover().find(selectors.sectionLabel).should('have.length', 1).and('have.text', 'Tooltip')
      popover().find(selectors.tooltipItem).should('have.length', 2)
      popover().find(selectors.tooltipItem).eq(0)
        .should('contain.text', 'This is one of the most famous opening lines')
        .and('contain.text', 'Literary Analysis')
      popover().find(selectors.tooltipItem).eq(1)
        .should('contain.text', 'The opening sentence is a classic example of free indirect discourse')
        .and('contain.text', 'Rhetorical Analysis')

      // no annotations section - tooltip annotations are not offered for the sidebar
      popover().find('[data-cy="popover-annotations-section"]').should('not.exist')
      cy.get(selectors.sidebarContainer).should('not.exist')
    })
  })

  describe('1 tooltip and 1 normal annotation', () => {
    // #truth with only Literary Analysis as tooltip type: annotation-1 is shown as tooltip,
    // annotation-7 (Rhetorical Analysis) stays a normal annotation offered for the sidebar
    beforeEach(() => {
      openPage1({ tooltipTypes: ['Literary Analysis'] })
    })

    const normalItem = () => popover().find('[data-cy="popover-annotation-item"]')

    it('Gives the target both annotation ids and the highlight style', () => {
      target('#truth')
        .should('have.attr', 'data-annotation-ids')
        .then((ids) => {
          expect(ids.split(',')).to.have.members([annotation('annotation-1'), annotation('annotation-7')])
        })
      target('#truth').should('have.class', 'bg-accent')
    })

    it('Shows the popover with the tooltip annotation and the normal annotation when clicking the target', () => {
      target('#truth').click()

      popover().should('be.visible')

      // the tooltip section first, then the normal annotation under "More annotations"
      popover().find(selectors.sectionLabel).should('have.length', 2)
      popover().find(selectors.sectionLabel).eq(0).should('have.text', 'Tooltip')
      popover().find(selectors.sectionLabel).eq(1).should('have.text', 'More annotations')

      popover().find(selectors.tooltipItem).should('have.length', 1)
        .and('contain.text', 'This is one of the most famous opening lines')
        .and('contain.text', 'Literary Analysis')

      popover().find('[data-cy="popover-annotations-section"]').should('exist')
      normalItem().should('have.length', 1)
        .and('have.attr', 'data-annotation', annotation('annotation-7'))
        .and('contain.text', 'The opening sentence is a classic example of free indirect discourse')
        .and('not.have.attr', 'data-selected')

      // nothing is selected until the normal annotation is clicked
      cy.get(selectors.sidebarContainer).should('not.exist')
    })

    it('Selects the normal annotation in the sidebar when clicking it in the popover', () => {
      target('#truth').click()
      popover().should('be.visible')

      normalItem().click()

      // the sidebar opens with the clicked annotation selected - and only that one
      cy.get(selectors.sidebarContainer).should('be.visible')
      cy.get(selectors.sidebarContainer)
        .find(`[data-annotation="${annotation('annotation-7')}"]`)
        .should('have.attr', 'data-selected', 'true')
      cy.get(selectors.sidebarContainer).find('[data-selected]').should('have.length', 1)

      // the tooltip annotation is not listed in the sidebar
      cy.get(selectors.sidebarContainer).find(`[data-annotation="${annotation('annotation-1')}"]`).should('not.exist')

      // the popover item and the target show the selection as well
      normalItem().should('have.attr', 'data-selected')
      target('#truth').should('have.class', 'bg-annotation-selected')
    })
  })

  describe('2 normal annotations', () => {
    // #truth without tooltip types: annotation-1 (Literary Analysis) and annotation-7 (Rhetorical Analysis)
    // are both normal annotations, so a click offers them in the popover instead of selecting one
    beforeEach(() => {
      openPage1()
    })

    const normalItems = () => popover().find('[data-cy="popover-annotation-item"]')
    const sidebarCard = (id) => cy.get(selectors.sidebarContainer).find(`[data-annotation="${annotation(id)}"]`)

    it('Gives the target both annotation ids and the highlight style', () => {
      target('#truth')
        .should('have.attr', 'data-annotation-ids')
        .then((ids) => {
          expect(ids.split(',')).to.have.members([annotation('annotation-1'), annotation('annotation-7')])
        })
      target('#truth').should('have.class', 'bg-accent')
    })

    it('Shows the popover with only the 2 normal annotations when clicking the target', () => {
      target('#truth').click()

      popover().should('be.visible')

      // only the annotations section - no tooltip, reference or synopsis section
      popover().find(selectors.sectionLabel).should('have.length', 1).and('have.text', 'Annotations')
      popover().find(selectors.tooltipSection).should('not.exist')
      popover().find(selectors.tooltipItem).should('not.exist')

      normalItems().should('have.length', 2)
      normalItems().eq(0)
        .should('have.attr', 'data-annotation', annotation('annotation-1'))
        .and('contain.text', 'This is one of the most famous opening lines')
      normalItems().eq(1)
        .should('have.attr', 'data-annotation', annotation('annotation-7'))
        .and('contain.text', 'The opening sentence is a classic example of free indirect discourse')
      popover().find('[data-cy="popover-annotation-item"][data-selected]').should('not.exist')

      // nothing is selected until one of the items is clicked
      cy.get(selectors.sidebarContainer).should('not.exist')
    })

    it('Selects the respective annotation in the sidebar when clicking each item', () => {
      target('#truth').click()
      popover().should('be.visible')

      // 1. the first item selects annotation-1
      normalItems().eq(0).click()

      cy.get(selectors.sidebarContainer).should('be.visible')
      sidebarCard('annotation-1').should('have.attr', 'data-selected', 'true')
      sidebarCard('annotation-7').should('not.have.attr', 'data-selected')
      normalItems().eq(0).should('have.attr', 'data-selected')
      normalItems().eq(1).should('not.have.attr', 'data-selected')

      // 2. the second item moves the selection to annotation-7
      normalItems().eq(1).click()

      sidebarCard('annotation-7').should('have.attr', 'data-selected', 'true')
      sidebarCard('annotation-1').should('not.have.attr', 'data-selected')
      cy.get(selectors.sidebarContainer).find('[data-selected]').should('have.length', 1)
      normalItems().eq(1).should('have.attr', 'data-selected')
      normalItems().eq(0).should('not.have.attr', 'data-selected')

      target('#truth').should('have.class', 'bg-annotation-selected')
    })
  })

  describe('only 1 cross ref annotation', () => {
    // #all-about-it is only targeted by annotation-crossref-text-only-1, a CrossRef pointing at #ishmael
    // in the transcription of Moby-Dick, item "1" - and it sits in no other target
    beforeEach(() => {
      openPage1({ crossRefContentType: 'CrossRef' })
    })

    it('Gives the target the cross ref link style only', () => {
      target('#all-about-it')
        .should('have.class', 'text-blue-500')
        .and('have.class', 'underline')
        .and('not.have.class', 'bg-accent')
        .and('not.have.attr', 'data-annotation-ids')
    })

    it('Shows the popover with only the cross ref when clicking the target', () => {
      target('#all-about-it').click()

      popover().should('be.visible')

      // only the reference section - no tooltip, annotations or synopsis section
      popover().find(selectors.sectionLabel).should('have.length', 1).and('have.text', 'Reference')
      popover().find(selectors.tooltipSection).should('not.exist')
      popover().find('[data-cy="popover-annotations-section"]').should('not.exist')

      // the cross ref names the referenced manifest and item and offers both ways to open it
      popover().find('[data-cy="popover-reference-section"]').within(() => {
        cy.contains('p', 'Moby-Dick').should('exist')
        cy.contains('p', '1').should('exist')
        cy.get('button').should('have.length', 2)
        cy.contains('button', 'Open in this Panel').should('exist')
        cy.contains('button', 'Open in new Panel').should('exist')
      })

      // a cross ref is not selected in the sidebar
      cy.get(selectors.sidebarContainer).should('not.exist')
    })
  })

  describe('2 cross ref links in a target with 1 sidebar annotation', () => {
    // #para4 is the target of annotation-9 (Narrative Technique). Two spans inside it are cross ref links,
    // both pointing into Moby-Dick, item "1":
    //   - #replied (annotation-crossref-text-nested-1) at #spleen of the transcription
    //   - #had-not (annotation-crossref-text-diplomatic-1) at #dipl-phantom of the diplomatic text
    beforeEach(() => {
      openPage1({ crossRefContentType: 'CrossRef' })
    })

    const links = ['#replied', '#had-not']
    const referenceSection = () => popover().find('[data-cy="popover-reference-section"]')
    const normalItems = () => popover().find('[data-cy="popover-annotation-item"]')

    it('Gives the whole target the highlight style and each link the link style', () => {
      target('#para4')
        .should('have.attr', 'data-annotation-ids', annotation('annotation-9'))
        .and('have.class', 'bg-accent')

      links.forEach((link) => {
        target(link)
          .should('have.class', 'text-blue-500')
          .and('have.class', 'underline')
      })
    })

    links.forEach((link) => {
      it(`Shows the popover with the cross ref of ${link} and the annotation of the target when clicking it`, () => {
        target(link).click()

        popover().should('be.visible')

        // the cross ref of the clicked link first, then the annotation of the surrounding target
        popover().find(selectors.sectionLabel).should('have.length', 2)
        popover().find(selectors.sectionLabel).eq(0).should('have.text', 'Reference')
        popover().find(selectors.sectionLabel).eq(1).should('have.text', 'More annotations')

        // only the cross ref of this link - the other link's one is not part of the click
        referenceSection().within(() => {
          cy.contains('p', 'Moby-Dick').should('exist')
          cy.get('button').should('have.length', 2)
          cy.contains('button', 'Open in this Panel').should('exist')
          cy.contains('button', 'Open in new Panel').should('exist')
        })

        normalItems().should('have.length', 1)
          .and('have.attr', 'data-annotation', annotation('annotation-9'))
          .and('contain.text', 'Mr. Bennet\'s terse reply demonstrates')

        // nothing is selected until the annotation is clicked
        cy.get(selectors.sidebarContainer).should('not.exist')
      })
    })

    it('Selects the annotation in the sidebar without a popover when clicking the target outside the links', () => {
      // a few pixels into the first line of the paragraph is "Mr. Bennet", before the first link - the
      // exact corner is covered by the pane edge
      target('#para4').click(15, 8, { scrollBehavior: 'center' })

      popover().should('not.exist')

      cy.get(selectors.sidebarContainer).should('be.visible')
      cy.get(selectors.sidebarContainer)
        .find(`[data-annotation="${annotation('annotation-9')}"]`)
        .should('have.attr', 'data-selected', 'true')
      cy.get(selectors.sidebarContainer).find('[data-selected]').should('have.length', 1)

      target('#para4').should('have.class', 'bg-annotation-selected')
    })
  })

  describe('1 cross ref and 1 normal annotation on the same target', () => {
    // #netherfield is the exact target of both annotation-4 (Place) and annotation-crossref-text-1, a
    // CrossRef pointing at #ishmael in the transcription of Moby-Dick, item "1"
    beforeEach(() => {
      openPage1({ crossRefContentType: 'CrossRef' })
    })

    it('Gives the target the highlight style and the cross ref link style', () => {
      target('#netherfield')
        .should('have.attr', 'data-annotation-ids')
        .and('contain', annotation('annotation-4'))
      target('#netherfield')
        .should('have.class', 'bg-accent')
        .and('have.class', 'text-blue-500')
        .and('have.class', 'underline')
    })

    it('Shows the popover with the cross ref and the normal annotation when clicking the target', () => {
      target('#netherfield').click()

      popover().should('be.visible')

      // the cross ref first, then the normal annotation
      popover().find(selectors.sectionLabel).should('have.length', 2)
      popover().find(selectors.sectionLabel).eq(0).should('have.text', 'Reference')
      popover().find(selectors.sectionLabel).eq(1).should('have.text', 'More annotations')

      popover().find('[data-cy="popover-reference-section"]').within(() => {
        cy.contains('p', 'Moby-Dick').should('exist')
        cy.get('button').should('have.length', 2)
        cy.contains('button', 'Open in this Panel').should('exist')
        cy.contains('button', 'Open in new Panel').should('exist')
      })

      popover().find('[data-cy="popover-annotation-item"]').should('have.length', 1)
        .and('have.attr', 'data-annotation', annotation('annotation-4'))
        .and('contain.text', 'The estate rented by Mr. Bingley')

      popover().find(selectors.tooltipSection).should('not.exist')
      cy.get(selectors.sidebarContainer).should('not.exist')
    })
  })

  describe('cross ref link with 2 spans inside it, one of them with a tooltip annotation', () => {
    // #bingley-link is the target of annotation-crossref-text-two-spans-1, a CrossRef pointing at #ishmael
    // in the transcription of Moby-Dick, item "1". Inside it are 2 spans:
    //   - #bingley-name (annotation-17, Editorial Note - configured as tooltip type)
    //   - #bingley-married (no annotation of its own)
    beforeEach(() => {
      openPage1({ tooltipTypes: ['Editorial Note'], crossRefContentType: 'CrossRef' })
    })

    it('Shows the popover with the tooltip annotation and the cross ref when clicking the span inside the link', () => {
      target('#bingley-name').click()

      popover().should('be.visible')

      // the tooltip of the clicked span and the cross ref of the link around it - nothing else
      popover().find(selectors.sectionLabel).should('have.length', 2)
      popover().find(selectors.sectionLabel).eq(0).should('have.text', 'Tooltip')
      popover().find(selectors.sectionLabel).eq(1).should('have.text', 'Reference')

      popover().find(selectors.tooltipItem).should('have.length', 1)
        .and('contain.text', 'Mr. Bingley is named here for the first time')
        .and('contain.text', 'Editorial Note')

      popover().find('[data-cy="popover-reference-section"]').within(() => {
        cy.contains('p', 'Moby-Dick').should('exist')
        cy.get('button').should('have.length', 2)
        cy.contains('button', 'Open in this Panel').should('exist')
        cy.contains('button', 'Open in new Panel').should('exist')
      })

      popover().find('[data-cy="popover-annotations-section"]').should('not.exist')
      cy.get(selectors.sidebarContainer).should('not.exist')
    })
  })

  describe('target with 2 nested targets', () => {
    // #para6 is the target of annotation-11 (Narrative Technique). Two spans inside it are targets of
    // their own:
    //   - #made-no-answer (annotation-12, Literary Analysis)
    //   - #impatiently (annotation-13, Rhetorical Analysis)
    // Aligned mode, where a selected card is lined up with its target.
    beforeEach(() => {
      openPage1({ mode: 'aligned' })
      target('#para6').should('have.attr', 'data-annotation-ids', annotation('annotation-11'))
    })

    const nested = [
      { selector: '#made-no-answer', id: 'annotation-12', text: 'Mr. Bennet\'s silence is a deliberate provocation' },
      { selector: '#impatiently', id: 'annotation-13', text: 'The adverb closing the sentence underlines' },
    ]
    const parent = { selector: '#para6', id: 'annotation-11', text: 'The exchange sets Mr. Bennet\'s silence against' }

    const items = () => popover().find('[data-cy="popover-annotation-item"]')
    const sidebarCard = (id) => cy.get(selectors.sidebarContainer).find(`[data-annotation="${annotation(id)}"]`)

    // The selected card sits at the same height as its target
    const expectCardAlignedWithTarget = (id, selector) => {
      cy.get(selectors.textContainer).find(selector).then(($target) => {
        sidebarCard(id).should(($card) => {
          const targetY = $target[0].getBoundingClientRect().top
          const cardY = $card[0].getBoundingClientRect().top
          expect(cardY, `card y ${cardY} vs target y ${targetY}`).to.be.closeTo(targetY, 2)
        })
      })
    }

    const expectSelected = (selected, selector) => {
      sidebarCard(selected.id).should('have.attr', 'data-selected', 'true')
      cy.get(selectors.sidebarContainer).find('[data-selected]').should('have.length', 1)
      target(selector).should('have.class', 'bg-annotation-selected')
      expectCardAlignedWithTarget(selected.id, selector)
    }

    nested.forEach((child, i) => {
      const other = nested[1 - i]

      describe(`nested target ${child.selector}`, () => {
        it('Shows the nested style on every nested target when hovering it', () => {
          target(child.selector).trigger('mouseenter')

          // hovering a nested target hovers its parent annotation as well: the parent gets the hover
          // background and every target nested in it - the hovered one and the other one - the border
          target(parent.selector).should('have.class', 'bg-annotation-hover')
          target(child.selector).should('have.class', 'outline').and('have.class', 'bg-annotation-hover')
          target(other.selector).should('have.class', 'outline')

          // leaving it drops the border from both
          target(child.selector).trigger('mouseleave')
          target(child.selector).should('not.have.class', 'outline')
          target(other.selector).should('not.have.class', 'outline')
        })

        it('Shows the popover with its own and the parent annotation when clicking it', () => {
          target(child.selector).click()

          popover().should('be.visible')
          popover().find(selectors.sectionLabel).should('have.length', 1).and('have.text', 'Annotations')

          // only these two - not the annotation of the other nested target
          items().should('have.length', 2)
          items().filter(`[data-annotation="${annotation(child.id)}"]`).should('contain.text', child.text)
          items().filter(`[data-annotation="${annotation(parent.id)}"]`).should('contain.text', parent.text)
          items().filter(`[data-annotation="${annotation(other.id)}"]`).should('not.exist')

          cy.get(selectors.sidebarContainer).should('not.exist')
        })

        it('Selects its own annotation and target when clicking its item', () => {
          target(child.selector).click()
          items().filter(`[data-annotation="${annotation(child.id)}"]`).click()

          cy.get(selectors.sidebarContainer).should('be.visible')
          expectSelected(child, child.selector)
          target(parent.selector).should('not.have.class', 'bg-annotation-selected')
        })

        it('Selects the parent annotation and target when clicking the parent item', () => {
          target(child.selector).click()
          items().filter(`[data-annotation="${annotation(parent.id)}"]`).click()

          cy.get(selectors.sidebarContainer).should('be.visible')
          expectSelected(parent, parent.selector)
        })
      })
    })
  })

  describe('targets with sync targets', () => {
    // #para7 is the target of annotation-14 (Narrative Technique). Nested in it, #no-objection carries
    //   - a tooltip annotation: annotation-15 (Editorial Note, configured as tooltip type)
    //   - a sidebar annotation: annotation-16 (Historical Context)
    //   - a cross ref link inside it: #objection (annotation-crossref-text-nested-2, at #ishmael of Moby-Dick)
    //   - 3 synoptic targets (no-objection-sync in the collection's sync annotations), each in a manifest
    //     of its own: Moby-Dick, The Great Gatsby and The Road Not Taken
    beforeEach(() => {
      openPage1({ tooltipTypes: ['Editorial Note'], crossRefContentType: 'CrossRef' })
      target('#no-objection').should('exist')
      // the sync annotations are loaded after the text - only then a click finds the synoptic targets
      cy.get('[data-cy="sync-target-navigation"]').should('exist')
    })

    const witnesses = ['Moby-Dick', 'The Great Gatsby', 'The Road Not Taken']
    const section = (name) => popover().find(`[data-cy="popover-${name}-section"]`)

    const expectDirectAndParentAnnotations = () => {
      section('tooltip').find(selectors.tooltipItem).should('have.length', 1)
        .and('contain.text', 'Editorial note: the phrase is unchanged')
        .and('contain.text', 'Editorial Note')

      section('annotations').find('[data-cy="popover-annotation-item"]').should('have.length', 2)
      section('annotations').find(`[data-annotation="${annotation('annotation-16')}"]`)
        .should('contain.text', 'Mr. Bennet feigns indifference')
      section('annotations').find(`[data-annotation="${annotation('annotation-14')}"]`)
        .should('contain.text', "Mr. Bennet's dry consent")
    }

    const expectSynopsisItems = () => {
      section('synopsis').find('[data-cy="synoptical-witnesses-counter"]').should('have.text', '0/3')
      section('synopsis').find('[data-cy="witness-item"]').should('have.length', 3)
      witnesses.forEach((title) => {
        section('synopsis').contains('[data-cy="witness-label"]', title).should('exist')
      })
    }

    it('Shows its annotations, the parent annotation and the synopsis when clicking the nested target outside the link', () => {
      // the left edge of #no-objection is "I have no", before the link
      target('#no-objection').click('left')

      popover().should('be.visible')
      popover().find(selectors.sectionLabel).should('have.length', 3)
      popover().find(selectors.sectionLabel).eq(0).should('have.text', 'Tooltip')
      popover().find(selectors.sectionLabel).eq(1).should('have.text', 'More annotations')
      popover().find(selectors.sectionLabel).eq(2).should('have.text', 'Synopsis')

      // the cross ref belongs to the link, which was not clicked
      section('reference').should('not.exist')

      expectDirectAndParentAnnotations()
      expectSynopsisItems()
    })

    it('Shows the cross ref, the annotations of the nested and the parent target and the synopsis when clicking the link', () => {
      target('#objection').click()

      popover().should('be.visible')
      popover().find(selectors.sectionLabel).should('have.length', 4)
      popover().find(selectors.sectionLabel).eq(0).should('have.text', 'Tooltip')
      popover().find(selectors.sectionLabel).eq(1).should('have.text', 'Reference')
      popover().find(selectors.sectionLabel).eq(2).should('have.text', 'More annotations')
      popover().find(selectors.sectionLabel).eq(3).should('have.text', 'Synopsis')

      section('reference').within(() => {
        cy.contains('p', 'Moby-Dick').should('exist')
        cy.contains('button', 'Open in this Panel').should('exist')
        cy.contains('button', 'Open in new Panel').should('exist')
      })

      expectDirectAndParentAnnotations()
      expectSynopsisItems()
    })
  })
})
