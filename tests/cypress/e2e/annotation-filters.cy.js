describe('Annotation filters derived from the rendered texts', () => {

  const apiUrl = Cypress.env('API_URL') || 'http://localhost:8181';
  const collection = `${apiUrl}/example/collections/example.json`;
  const manifest = `${apiUrl}/example/manifests/book2.json`;
  // Moby-Dick, third item (Chapter 3).
  const item = `${apiUrl}/example/items/book2-page3.json`;

  // One transcription view (which holds #para1) and one diplomatic view (which holds #spouter-inn),
  // so the derived filters accumulate the annotation types occurring across both rendered texts.
  const views = [
    { label: 'Text', view: 'text', activeContentType: 'transcription', contentTypes: ['transcription', 'diplomatic', 'normalized'] },
    { label: 'Text', view: 'text', activeContentType: 'diplomatic', contentTypes: ['transcription', 'diplomatic', 'normalized'] },
  ];

  const config = `panels[0].collection=${collection}&panels[0].manifest=${manifest}&panels[0].item=${item}`
    + views.map((view) => `&panelViews[]=${encodeURIComponent(JSON.stringify(view))}`).join('');

  const selectors = {
    sidebarToggle: '[data-cy="sidebar-toggle"]',
    sidebarContainer: '[data-sidebar-view]',
    contentType: '[data-cy="content-type"]',
    textContainer: '[data-text-container]',
    popover: '[data-slot="popover-content"]',
    checkbox: '[data-slot="checkbox"]',
    viewsMenuToggle: '[data-cy="panel-menu"]',
    viewsMenu: '[data-cy="panel-menu-dropdown"]',
    viewSwitch: '[data-cy="panel-view-toggle"]',
    prevItem: '[data-cy="prev-item-button"]',
    nextItem: '[data-cy="next-item-button"]',
  };

  const sidebar = () => cy.get(selectors.sidebarContainer);

  // Each derived type is a <label> with a checkbox and the type name as text; the type names are
  // unique so a plain contains is enough to single one out.
  const filterRow = (label) => cy.get(selectors.popover).contains('label', label);

  const openViewsMenu = () => {
    cy.get(selectors.viewsMenuToggle).click();
    cy.get(selectors.viewsMenu).should('be.visible');
  };

  // Toggle a view's visibility switch and assert the resulting state so the next step doesn't race.
  const setView = (index, visible) => {
    cy.get(`${selectors.viewsMenu} ${selectors.viewSwitch}`).eq(index).click();
    cy.get(`${selectors.viewsMenu} ${selectors.viewSwitch}`)
      .eq(index)
      .should('have.attr', 'data-state', visible ? 'checked' : 'unchecked');
  };

  // Dismiss the open Radix dropdown menu (clicking the trigger no longer closes it reliably once
  // an item has been interacted with, so Escape is used).
  const closeViewsMenu = () => {
    cy.get('body').type('{esc}');
    cy.get(selectors.viewsMenu).should('not.exist');
  };

  // Open the sidebar and the filters popover. Filters are derived asynchronously as each text renders,
  // so wait for the button to enable first.
  const openFilters = () => {
    cy.get(selectors.sidebarToggle).click();
    sidebar().contains('button', /filters/i).should('not.be.disabled').click();
    cy.get(selectors.popover).should('be.visible');
  };

  const expectFilters = (length, labels) => {
    cy.get(`${selectors.popover} ${selectors.checkbox}`).should('have.length', length);
    labels.forEach((label) => filterRow(label).should('exist'));
  };

  const target = (selector) => cy.get(selectors.textContainer).find(selector);

  // Pride and Prejudice, page 1, rendered as a single transcription view. Used by the tests below
  // because it holds targets carrying only annotations of one type.
  const book1Item = `${apiUrl}/example/items/book1-page1.json`;
  const transcriptionView = {
    label: 'Text',
    view: 'text',
    activeContentType: 'transcription',
    contentTypes: ['transcription', 'diplomatic', 'normalized'],
  };

  // Open that text with the given type set both as tooltip type and as disabled highlighting type,
  // i.e. the config shape
  //   "annotations": { "tooltipTypes": ["Character"], "disableHighlighting": ["Character"] }
  // Still no "annotations.filters", so the filter list stays the one discovered from the text (a
  // tooltip type never appears in it).
  const openBook1Page1 = (type) => {
    const params = new URLSearchParams();
    params.set('annotations.defaultMode', 'list');
    params.set('panels[0].collection', collection);
    params.set('panels[0].manifest', `${apiUrl}/example/manifests/book1.json`);
    params.set('panels[0].item', book1Item);
    params.append('panelViews[]', JSON.stringify(transcriptionView));
    params.append('annotations.tooltipTypes[]', type);
    params.append('annotations.disableHighlighting[]', type);

    cy.visit(`/e2e.html?${params.toString()}`);
    cy.get('[data-cy="item-label"]').contains('Page 1');
    target('#bennet').should('exist');
  };

  const deselectAll = () => {
    cy.get(`${selectors.popover} ${selectors.checkbox}[data-state="checked"]`).each(($checkbox) => {
      cy.wrap($checkbox).click({ force: true });
    });
    cy.get(`${selectors.popover} ${selectors.checkbox}[data-state="checked"]`).should('not.exist');
  };

  beforeEach(() => {
    cy.visit('/e2e.html?' + config);

    // Both texts of the third item are rendered: transcription first, diplomatic second.
    cy.get(selectors.textContainer).should('have.length', 2);
    cy.get(selectors.contentType).eq(0).should('contain.text', 'transcription');
    cy.get(selectors.contentType).eq(1).should('contain.text', 'diplomatic');
    cy.get(selectors.textContainer).eq(0).find('#para1').should('exist');
    cy.get(selectors.textContainer).eq(1).find('#spouter-inn').should('exist');
  });

  it('should include in annotation filters the types from all rendered texts when no filters provided in config', () => {
    cy.get(selectors.sidebarToggle).click();

    // Filters are derived asynchronously as each text renders, so wait for the button to enable.
    sidebar().contains('button', /filters/i).should('not.be.disabled').click();
    cy.get(selectors.popover).should('be.visible');

    // 8 types: transcription contributes Character, Artistic Object, Historical Context, Setting;
    // diplomatic contributes Place, Textual Variant, Editorial Note, Orthographic Feature (Descriptive
    // Detail is skipped because its target #dipl-gable is not present in the diplomatic text).
    cy.get(`${selectors.popover} ${selectors.checkbox}`).should('have.length', 8);

    ['Place', 'Textual Variant', 'Historical Context', 'Setting'].forEach((label) => {
      filterRow(label).should('exist');
    });

    // While their types are selected, the transcription's #para1 (Setting) and the diplomatic's
    // #spouter-inn (Place) carry annotation ids.
    cy.get(selectors.textContainer).eq(0).find('#para1').should('have.attr', 'data-annotation-ids');
    cy.get(selectors.textContainer).eq(1).find('#spouter-inn').should('have.attr', 'data-annotation-ids');

    // Deselecting "Setting" removes the annotation ids from the transcription's #para1.
    filterRow('Setting').find(selectors.checkbox).click({ force: true });
    cy.get(selectors.textContainer).eq(0).find('#para1').should('not.have.attr', 'data-annotation-ids');

    // Deselecting "Place" removes the annotation ids from the diplomatic's #spouter-inn.
    filterRow('Place').find(selectors.checkbox).click({ force: true });
    cy.get(selectors.textContainer).eq(1).find('#spouter-inn').should('not.have.attr', 'data-annotation-ids');
  });

  it('lists only the visible view\'s types after the first (transcription) view is hidden', () => {
    openViewsMenu();
    setView(0, false); // hide the transcription view, leaving the diplomatic one
    closeViewsMenu();

    openFilters();

    // Only the diplomatic text remains, so only its 4 types are derived.
    expectFilters(4, ['Place', 'Textual Variant', 'Editorial Note', 'Orthographic Feature']);
  });

  it('restores the hidden view\'s types once it is shown again', () => {
    openViewsMenu();
    setView(0, false); // hide the transcription view ...
    setView(0, true); //  ... and show it again
    closeViewsMenu();

    openFilters();

    // Both texts contribute again: the 4 diplomatic types plus the 4 transcription types.
    expectFilters(8, [
      'Place', 'Textual Variant', 'Editorial Note', 'Orthographic Feature',
      'Character', 'Artistic Object', 'Historical Context', 'Setting',
    ]);
  });

  it('derives the types of both texts of the second item', () => {
    cy.get(selectors.prevItem).click();

    // The second item (Chapter 2): wait for both texts to render before reading the filters.
    cy.get(selectors.textContainer).eq(0).find('#carpet-bag').should('exist');
    cy.get(selectors.textContainer).eq(1).find('#dipl-shirt').should('exist');

    openFilters();

    // 9 transcription types plus "Authorial Revision" from the diplomatic text.
    expectFilters(10, ['Lexicography', 'Authorial Revision']);
  });

  it('keeps a view hidden across navigation and derives only the remaining visible text', () => {
    // Move to the second item, hide the diplomatic view there ...
    cy.get(selectors.prevItem).click();
    cy.get(selectors.textContainer).eq(0).find('#carpet-bag').should('exist');

    openViewsMenu();
    setView(1, false); // hide the diplomatic view
    closeViewsMenu();

    // ... then move to the third item; the diplomatic view stays hidden.
    cy.get(selectors.nextItem).click();
    cy.get(selectors.textContainer).eq(0).find('#para1').should('exist');

    openFilters();

    // Only the transcription text is visible, so only its 4 types are derived.
    expectFilters(4, ['Character', 'Artistic Object', 'Historical Context', 'Setting']);
  });

  it('does not highlight a target whose only annotation is of the disabled type once all filters are deselected', () => {
    openBook1Page1('Character');
    openFilters();

    // #netherfield (Place) is highlighted while its type is selected - asserting it first proves the
    // highlight effect has run. #bennet is only targeted by a Character annotation, so it stays
    // unhighlighted even before any filter is touched.
    target('#netherfield').should('have.class', 'bg-accent');
    target('#bennet').should('exist').and('not.have.class', 'bg-accent');

    deselectAll();

    // With every discovered type deselected the Character annotation is the only one left visible on
    // #bennet (tooltip types ignore the filters), and its type is disabled - so no grey highlight.
    target('#bennet').should('not.have.class', 'bg-accent');

    // The annotation itself is still attached to the target, so clicking it can still open the tooltip.
    target('#bennet').should('have.attr', 'data-annotation-ids');

    // The targets of the deselected types lose their highlight as well.
    target('#netherfield').should('not.have.class', 'bg-accent');
    target('#truth').should('not.have.class', 'bg-accent');
  });

  it('keeps a target with several annotations of the disabled type unhighlighted after deselecting all filters', () => {
    openBook1Page1('Character');
    openFilters();
    deselectAll();

    // #mrs-long carries two Character annotations - every visible annotation on it is of the disabled
    // type, so the target stays unhighlighted.
    target('#mrs-long').should('exist').and('not.have.class', 'bg-accent');
  });

  it('leaves no target highlighted when all discovered types are deselected', () => {
    openBook1Page1('Historical Context');
    openFilters();

    // #neighbourhood is only targeted by a Historical Context annotation (plus a cross reference,
    // which never counts as filtered), so the disabled type suppresses its highlight from the start.
    target('#neighbourhood').should('not.have.class', 'bg-accent');

    deselectAll();

    // #man carries an enabled Economic Context annotation next to its disabled Historical Context one,
    // so it only stays unhighlighted while the filtered out annotations are ignored.
    ['#truth', '#man', '#neighbourhood', '#netherfield', '#para4', '#bennet'].forEach((selector) => {
      target(selector).should('not.have.class', 'bg-accent');
    });
  });
});


describe('Annotation filters configured in config', () => {

  const apiUrl = Cypress.env('API_URL') || 'http://localhost:8181';
  const collection = `${apiUrl}/example/collections/example.json`;
  const manifest = `${apiUrl}/example/manifests/book2.json`;
  // Moby-Dick, third item (Chapter 3).
  const item = `${apiUrl}/example/items/book2-page3.json`;

  const views = [
    { label: 'Text', view: 'text', activeContentType: 'transcription', contentTypes: ['transcription', 'diplomatic', 'normalized'] },
    { label: 'Text', view: 'text', activeContentType: 'diplomatic', contentTypes: ['transcription', 'diplomatic', 'normalized'] },
  ];

  // Two configured filter items: Place (a diplomatic type) and Character (a transcription type).
  // Labels are provided so the filter rows show human-readable text.
  const filterItems = [
    { types: ['Place'], label: 'Place' },
    { types: ['Character'], label: 'Character' },
  ];

  const filtersParam = filterItems
    .map(item => `&annotations.filters.items[]=${encodeURIComponent(JSON.stringify(item))}`)
    .join('');

  const config = `panels[0].collection=${collection}&panels[0].manifest=${manifest}&panels[0].item=${item}`
    + filtersParam
    + views.map((view) => `&panelViews[]=${encodeURIComponent(JSON.stringify(view))}`).join('');

  const selectors = {
    sidebarToggle: '[data-cy="sidebar-toggle"]',
    sidebarContainer: '[data-sidebar-view]',
    contentType: '[data-cy="content-type"]',
    textContainer: '[data-text-container]',
    popover: '[data-slot="popover-content"]',
    checkbox: '[data-slot="checkbox"]',
    viewsMenuToggle: '[data-cy="panel-menu"]',
    viewsMenu: '[data-cy="panel-menu-dropdown"]',
    viewSwitch: '[data-cy="panel-view-toggle"]',
    prevItem: '[data-cy="prev-item-button"]',
    nextItem: '[data-cy="next-item-button"]',
  };

  const sidebar = () => cy.get(selectors.sidebarContainer);
  const filterRow = (label) => cy.get(selectors.popover).contains('label', label);

  const openFilters = () => {
    cy.get(selectors.sidebarToggle).click();
    sidebar().contains('button', /filters/i).click();
    cy.get(selectors.popover).should('be.visible');
  };

  const openViewsMenu = () => {
    cy.get(selectors.viewsMenuToggle).click();
    cy.get(selectors.viewsMenu).should('be.visible');
  };

  const setView = (index, visible) => {
    cy.get(`${selectors.viewsMenu} ${selectors.viewSwitch}`).eq(index).click();
    cy.get(`${selectors.viewsMenu} ${selectors.viewSwitch}`)
      .eq(index)
      .should('have.attr', 'data-state', visible ? 'checked' : 'unchecked');
  };

  const closeViewsMenu = () => {
    cy.get('body').type('{esc}');
    cy.get(selectors.viewsMenu).should('not.exist');
  };

  beforeEach(() => {
    cy.visit('/e2e.html?' + config);

    cy.get(selectors.textContainer).should('have.length', 2);
    cy.get(selectors.textContainer).eq(0).find('#para1').should('exist');
    cy.get(selectors.textContainer).eq(1).find('#spouter-inn').should('exist');
  });

  it('shows exactly the configured filters instead of auto-derived ones', () => {
    openFilters();

    // Only the 2 configured filters are shown, not the 8 auto-derived types.
    cy.get(`${selectors.popover} ${selectors.checkbox}`).should('have.length', 2);
    filterRow('Place').should('exist');
    filterRow('Character').should('exist');
  });

  it('deselecting a configured filter removes the corresponding annotation highlights', () => {
    openFilters();

    // Both types are selected by default — Place targets #spouter-inn, Character targets #queequeg.
    cy.get(selectors.textContainer).eq(1).find('#spouter-inn').should('have.attr', 'data-annotation-ids');
    cy.get(selectors.textContainer).eq(0).find('#queequeg').should('have.attr', 'data-annotation-ids');

    // Deselect Place — diplomatic annotation highlight disappears.
    filterRow('Place').find(selectors.checkbox).click({ force: true });
    cy.get(selectors.textContainer).eq(1).find('#spouter-inn').should('not.have.attr', 'data-annotation-ids');

    // Deselect Character — transcription annotation highlight disappears.
    filterRow('Character').find(selectors.checkbox).click({ force: true });
    cy.get(selectors.textContainer).eq(0).find('#queequeg').should('not.have.attr', 'data-annotation-ids');
  });

  it('re-selecting a configured filter restores the annotation highlight', () => {
    openFilters();

    // Deselect Place and re-select it.
    filterRow('Place').find(selectors.checkbox).click({ force: true });
    cy.get(selectors.textContainer).eq(1).find('#spouter-inn').should('not.have.attr', 'data-annotation-ids');

    filterRow('Place').find(selectors.checkbox).click({ force: true });
    cy.get(selectors.textContainer).eq(1).find('#spouter-inn').should('have.attr', 'data-annotation-ids');
  });

  it('keeps configured filters unchanged when a view is hidden', () => {
    openViewsMenu();
    setView(0, false); // hide the transcription view
    closeViewsMenu();

    openFilters();

    // The filter list is still the same 2 configured items — not reduced to diplomatic-only types.
    cy.get(`${selectors.popover} ${selectors.checkbox}`).should('have.length', 2);
    filterRow('Place').should('exist');
    filterRow('Character').should('exist');
  });

  it('persists configured filters across item navigation', () => {
    openFilters();
    cy.get(`${selectors.popover} ${selectors.checkbox}`).should('have.length', 2);

    // Navigate to the previous item (Chapter 2). Sidebar stays open.
    cy.get(selectors.prevItem).click();
    cy.get(selectors.textContainer).eq(0).find('#carpet-bag').should('exist');
    cy.get(selectors.textContainer).eq(1).find('#dipl-shirt').should('exist');

    sidebar().contains('button', /filters/i).click();
    cy.get(selectors.popover).should('be.visible');

    // The filter list is still the same 2 configured items, regardless of what types Chapter 2 has.
    cy.get(`${selectors.popover} ${selectors.checkbox}`).should('have.length', 2);
    filterRow('Place').should('exist');
    filterRow('Character').should('exist');

    // Navigate back to Chapter 3. Sidebar stays open.
    cy.get(selectors.nextItem).click();
    cy.get(selectors.textContainer).eq(0).find('#para1').should('exist');

    sidebar().contains('button', /filters/i).click();
    cy.get(selectors.popover).should('be.visible');
    cy.get(`${selectors.popover} ${selectors.checkbox}`).should('have.length', 2);
  });

  it('shows configured filter for a type that has no annotation in the current item', () => {
    // Configure a type that does not exist in book2-page3 at all.
    const extraFilter = { types: ['NonexistentType'], label: 'Nonexistent' };
    const extraConfig = `panels[0].collection=${collection}&panels[0].manifest=${manifest}&panels[0].item=${item}`
      + `&annotations.filters.items[]=${encodeURIComponent(JSON.stringify(filterItems[0]))}`
      + `&annotations.filters.items[]=${encodeURIComponent(JSON.stringify(extraFilter))}`
      + views.map((view) => `&panelViews[]=${encodeURIComponent(JSON.stringify(view))}`).join('');

    cy.visit('/e2e.html?' + extraConfig);
    cy.get(selectors.textContainer).should('have.length', 2);

    openFilters();

    // Both configured filters appear — even though NonexistentType has no matching annotations.
    cy.get(`${selectors.popover} ${selectors.checkbox}`).should('have.length', 2);
    filterRow('Place').should('exist');
    filterRow('Nonexistent').should('exist');
  });

  it('deselecting all configured filters removes all annotation highlights', () => {
    openFilters();

    cy.get(selectors.textContainer).eq(1).find('#spouter-inn').should('have.attr', 'data-annotation-ids');

    // Deselect all configured filters.
    cy.get(`${selectors.popover} ${selectors.checkbox}[data-state="checked"]`).each(($checkbox) => {
      cy.wrap($checkbox).click({ force: true });
    });

    // All annotation highlights are gone.
    cy.get(selectors.textContainer).eq(1).find('#spouter-inn').should('not.have.attr', 'data-annotation-ids');
    cy.get(selectors.textContainer).eq(0).find('#queequeg').should('not.have.attr', 'data-annotation-ids');
  });
});


describe('Preservation of the selected annotation types across item navigation (no filters in config)', () => {

  const apiUrl = Cypress.env('API_URL') || 'http://localhost:8181';
  const collection = `${apiUrl}/example/collections/example.json`;
  const manifest = `${apiUrl}/example/manifests/book2.json`;
  // Moby-Dick, third and last item (Chapter 3). Its predecessors are Chapter 2 and Chapter 1.
  const item = `${apiUrl}/example/items/book2-page3.json`;

  const views = [
    { label: 'Text', view: 'text', activeContentType: 'transcription', contentTypes: ['transcription', 'diplomatic', 'normalized'] },
    { label: 'Text', view: 'text', activeContentType: 'diplomatic', contentTypes: ['transcription', 'diplomatic', 'normalized'] },
  ];

  // No "annotations.filters" in the config, so the filter list is derived from the rendered texts and
  // its selection state is the one the panel aggregated while the user navigated.
  const config = `panels[0].collection=${collection}&panels[0].manifest=${manifest}&panels[0].item=${item}`
    + views.map((view) => `&panelViews[]=${encodeURIComponent(JSON.stringify(view))}`).join('');

  const selectors = {
    sidebarToggle: '[data-cy="sidebar-toggle"]',
    sidebarContainer: '[data-sidebar-view]',
    textContainer: '[data-text-container]',
    popover: '[data-slot="popover-content"]',
    checkbox: '[data-slot="checkbox"]',
    viewsMenuToggle: '[data-cy="panel-menu"]',
    viewsMenu: '[data-cy="panel-menu-dropdown"]',
    viewSwitch: '[data-cy="panel-view-toggle"]',
    prevItem: '[data-cy="prev-item-button"]',
    nextItem: '[data-cy="next-item-button"]',
  };

  const sidebar = () => cy.get(selectors.sidebarContainer);
  const filterRow = (label) => cy.get(selectors.popover).contains('label', label);
  const target = (viewIndex, selector) => cy.get(selectors.textContainer).eq(viewIndex).find(selector);

  // Escape first so an open popover or dropdown doesn't swallow the next click; harmless when nothing
  // is open. The filters are derived asynchronously as the texts render, so wait for the enabled button.
  const openFilters = () => {
    cy.get('body').type('{esc}');
    cy.get(selectors.popover).should('not.exist');
    sidebar().contains('button', /filters/i).should('not.be.disabled').click();
    cy.get(selectors.popover).should('be.visible');
  };

  const toggle = (label) => filterRow(label).find(selectors.checkbox).click({ force: true });

  const expectSelected = (label, selected) => {
    filterRow(label).find(selectors.checkbox)
      .should('have.attr', 'data-state', selected ? 'checked' : 'unchecked');
  };

  // Navigate and wait for a target of the new item, so the assertions don't read the previous item's DOM.
  const goToItem = (direction, waitSelector, viewIndex = 0) => {
    cy.get('body').type('{esc}');
    cy.get(direction === 'prev' ? selectors.prevItem : selectors.nextItem).click();
    target(viewIndex, waitSelector).should('exist');
  };

  const goToChapter2 = () => goToItem('prev', '#carpet-bag');
  const goToChapter1 = () => goToItem('prev', '#usher');
  const goToChapter3 = () => goToItem('next', '#para1');

  const openViewsMenu = () => {
    cy.get('body').type('{esc}');
    cy.get(selectors.viewsMenuToggle).click();
    cy.get(selectors.viewsMenu).should('be.visible');
  };

  const setView = (index, visible) => {
    cy.get(`${selectors.viewsMenu} ${selectors.viewSwitch}`).eq(index).click();
    cy.get(`${selectors.viewsMenu} ${selectors.viewSwitch}`)
      .eq(index)
      .should('have.attr', 'data-state', visible ? 'checked' : 'unchecked');
  };

  const closeViewsMenu = () => {
    cy.get('body').type('{esc}');
    cy.get(selectors.viewsMenu).should('not.exist');
  };

  beforeEach(() => {
    cy.visit('/e2e.html?' + config);

    // Chapter 3 with both texts rendered: transcription first, diplomatic second.
    cy.get(selectors.textContainer).should('have.length', 2);
    target(0, '#para1').should('exist');
    target(1, '#spouter-inn').should('exist');

    cy.get(selectors.sidebarToggle).click();
    sidebar().should('be.visible');
  });

  it('keeps a type deselected when the next item contains it as well', () => {
    openFilters();

    // "Place" is a diplomatic type in Chapter 3 (#spouter-inn) and a transcription type in Chapter 2.
    toggle('Place');
    target(1, '#spouter-inn').should('not.have.attr', 'data-annotation-ids');

    goToChapter2();
    openFilters();

    // The deselection survives the item change, in the filter list ...
    expectSelected('Place', false);
    // ... and in the text: no Place target of Chapter 2 is annotated any more.
    target(0, '#cape-horn').should('not.have.attr', 'data-annotation-ids');
    target(0, '#nantucket').should('not.have.attr', 'data-annotation-ids');

    // Types that were never touched stay selected.
    expectSelected('Lexicography', true);
    target(0, '#carpet-bag').should('have.attr', 'data-annotation-ids');
  });

  it('keeps the deselected types when navigating away and back to the same item', () => {
    openFilters();

    toggle('Place');    // diplomatic, targets #spouter-inn
    toggle('Setting');  // transcription, targets #para1

    goToChapter2();
    goToChapter3();
    openFilters();

    expectSelected('Place', false);
    expectSelected('Setting', false);
    expectSelected('Character', true);

    target(1, '#spouter-inn').should('not.have.attr', 'data-annotation-ids');
    target(0, '#para1').should('not.have.attr', 'data-annotation-ids');
    target(0, '#queequeg').should('have.attr', 'data-annotation-ids');
  });

  it('keeps the state of a type that the item in between does not contain at all', () => {
    openFilters();

    // "Historical Context" occurs in Chapter 3 (#harpooneer) and Chapter 1 (#spleen), but not in Chapter 2.
    toggle('Historical Context');
    target(0, '#harpooneer').should('not.have.attr', 'data-annotation-ids');

    goToChapter2();
    openFilters();

    // Wait for a type of the second (diplomatic) text before asserting an absence, so the check doesn't
    // run while the list still holds the transcription's types only.
    filterRow('Authorial Revision').should('exist');
    cy.get(selectors.popover).contains('label', 'Historical Context').should('not.exist');

    goToChapter1();
    openFilters();

    // Chapter 1 contains the type again - and it is still deselected.
    expectSelected('Historical Context', false);
    target(0, '#spleen').should('not.have.attr', 'data-annotation-ids');
  });

  it('selects the types that the new item introduces for the first time', () => {
    openFilters();

    // Deselect all 8 types of Chapter 3.
    cy.get(`${selectors.popover} ${selectors.checkbox}[data-state="checked"]`).each(($checkbox) => {
      cy.wrap($checkbox).click({ force: true });
    });
    cy.get(`${selectors.popover} ${selectors.checkbox}[data-state="checked"]`).should('not.exist');

    goToChapter2();
    openFilters();

    // Of the 10 types of Chapter 2 only "Place" was known (and deselected) before; the 9 types seen here
    // for the first time start out selected.
    cy.get(`${selectors.popover} ${selectors.checkbox}`).should('have.length', 10);
    cy.get(`${selectors.popover} ${selectors.checkbox}[data-state="unchecked"]`).should('have.length', 1);
    expectSelected('Place', false);

    target(0, '#cape-horn').should('not.have.attr', 'data-annotation-ids');
    target(0, '#carpet-bag').should('have.attr', 'data-annotation-ids');
  });

  it('applies a re-selection made on another item when navigating back', () => {
    openFilters();

    toggle('Place');
    target(1, '#spouter-inn').should('not.have.attr', 'data-annotation-ids');

    // Re-select the type on the previous item ...
    goToChapter2();
    openFilters();
    expectSelected('Place', false);
    toggle('Place');
    target(0, '#cape-horn').should('have.attr', 'data-annotation-ids');

    // ... and it is selected again on the item it was deselected on.
    goToChapter3();
    openFilters();
    expectSelected('Place', true);
    target(1, '#spouter-inn').should('have.attr', 'data-annotation-ids');
  });

  it('preserves a deselection that was made on another item than the initial one', () => {
    // "Lexicography" only exists in Chapter 2 and Chapter 1, so it is discovered during navigation.
    goToChapter2();
    openFilters();

    toggle('Lexicography');
    target(0, '#carpet-bag').should('not.have.attr', 'data-annotation-ids');

    // Leave to an item without that type and come back.
    goToChapter3();
    goToChapter2();
    openFilters();

    expectSelected('Lexicography', false);
    target(0, '#carpet-bag').should('not.have.attr', 'data-annotation-ids');
  });

  it('keeps the deselection of a type whose view is hidden and shown again', () => {
    openFilters();

    toggle('Place'); // contributed by the diplomatic text only

    openViewsMenu();
    setView(1, false); // hiding the diplomatic view drops "Place" from the derived list ...
    closeViewsMenu();

    openFilters();
    filterRow('Setting').should('exist');
    cy.get(selectors.popover).contains('label', 'Place').should('not.exist');

    openViewsMenu();
    setView(1, true); // ... and showing it again brings the type back, still deselected.
    closeViewsMenu();

    openFilters();
    expectSelected('Place', false);
    target(1, '#spouter-inn').should('not.have.attr', 'data-annotation-ids');
  });

  it('applies the preserved deselection to the annotations listed in the sidebar', () => {
    openFilters();

    toggle('Place');

    goToChapter2();
    openFilters();

    // Chapter 2 holds 29 annotations across both texts, 8 of them of type "Place" - which the sidebar
    // leaves out as long as the preserved deselection applies.
    sidebar().find('[data-annotation]').should('have.length', 21);

    toggle('Place');

    sidebar().find('[data-annotation]').should('have.length', 29);
  });
});
