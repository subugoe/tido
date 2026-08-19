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
    viewsSelect: '[data-cy="panel-mode-select"]',
    viewsMenu: '[data-cy="panel-mode-menu"]',
    viewSwitch: '[data-slot="switch"]',
    prevItem: '[data-cy="prev-item-button"]',
    nextItem: '[data-cy="next-item-button"]',
  };

  const sidebar = () => cy.get(selectors.sidebarContainer);

  // Each derived type is a <label> with a checkbox and the type name as text; the type names are
  // unique so a plain contains is enough to single one out.
  const filterRow = (label) => cy.get(selectors.popover).contains('label', label);

  const openViewsMenu = () => {
    cy.get(selectors.viewsSelect).click();
    cy.get(selectors.viewsMenu).should('be.visible');
  };

  // Toggle a view's visibility switch and assert the resulting state so the next step doesn't race.
  const setView = (index, visible) => {
    cy.get(`${selectors.viewsMenu} ${selectors.viewSwitch}`).eq(index).click();
    cy.get(`${selectors.viewsMenu} ${selectors.viewSwitch}`)
      .eq(index)
      .should('have.attr', 'data-state', visible ? 'checked' : 'unchecked');
  };

  const closeViewsMenu = () => {
    cy.get(selectors.viewsSelect).click();
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
    viewsSelect: '[data-cy="panel-mode-select"]',
    viewsMenu: '[data-cy="panel-mode-menu"]',
    viewSwitch: '[data-slot="switch"]',
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
    cy.get(selectors.viewsSelect).click();
    cy.get(selectors.viewsMenu).should('be.visible');
  };

  const setView = (index, visible) => {
    cy.get(`${selectors.viewsMenu} ${selectors.viewSwitch}`).eq(index).click();
    cy.get(`${selectors.viewsMenu} ${selectors.viewSwitch}`)
      .eq(index)
      .should('have.attr', 'data-state', visible ? 'checked' : 'unchecked');
  };

  const closeViewsMenu = () => {
    cy.get(selectors.viewsSelect).click();
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
