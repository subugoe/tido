describe('Variant annotation filters with multiple root selection', () => {

  const apiUrl = Cypress.env('API_URL') || 'http://localhost:8181';
  const manifest = `${apiUrl}/example/manifests/variants.json`;
  const item = `${apiUrl}/example/items/variants-page1.json`;

  // The annotation page lists the witnesses a, b and d (shown as chips "A", "B", "D") and holds four
  // Variant annotations plus one EditorialCorrection:
  //   annotation-1  #var-a       witnesses [a]
  //   annotation-2  #var-b       witnesses [b]
  //   annotation-3  #var-ad      witnesses [a, d]
  //   annotation-4  #var-bd      witnesses [b, d]
  //   annotation-5  #correction  EditorialCorrection
  const annotationId = (n) => `${apiUrl}/example/variants/page1/annotation-${n}`;

  // Same filter shape as examples/config/bdn.json: one root per witness plus one root for a plain type,
  // all independently selectable ("rootSelectionRule": "multiple").
  const filterItems = [
    { label: 'Auflage a', types: [{ Variant: 'a' }] },
    { label: 'Auflage b', types: [{ Variant: 'b' }] },
    { label: 'Auflage d', types: [{ Variant: 'd' }] },
    { label: 'Satzfehlerkorrektur', types: ['EditorialCorrection'] },
  ];

  const view = {
    label: 'Text',
    view: 'text',
    activeContentType: 'transcription',
    contentTypes: ['transcription'],
  };

  const selectors = {
    sidebarToggle: '[data-cy="sidebar-toggle"]',
    sidebarContainer: '[data-sidebar-view]',
    textContainer: '[data-text-container]',
    popover: '[data-slot="popover-content"]',
    checkbox: '[data-slot="checkbox"]',
    witnessChip: '[data-cy="witness-chip"]',
  };

  const sidebar = () => cy.get(selectors.sidebarContainer);
  const filterRow = (label) => cy.get(selectors.popover).contains('label', label);
  const toggleFilter = (label) => filterRow(label).find(selectors.checkbox).click({ force: true });
  const sidebarAnnotation = (n) => sidebar().find(`[data-annotation="${annotationId(n)}"]`);

  const openFilters = () => {
    cy.get(selectors.sidebarToggle).click();
    sidebar().contains('button', /filters/i).click();
    cy.get(selectors.popover).should('be.visible');
  };

  // The listed annotations are exactly the given ones.
  const expectAnnotations = (numbers) => {
    sidebar().find('[data-annotation]').should('have.length', numbers.length);
    numbers.forEach((n) => sidebarAnnotation(n).should('exist'));
  };

  // The card of the given Variant annotation shows exactly the given witness chips.
  const expectWitnesses = (n, labels) => {
    sidebarAnnotation(n).find(selectors.witnessChip).should('have.length', labels.length);
    labels.forEach((label, i) => {
      sidebarAnnotation(n).find(selectors.witnessChip).eq(i).should('have.text', label);
    });
  };

  beforeEach(() => {
    const params = new URLSearchParams();
    params.set('panels[0].manifest', manifest);
    params.set('panels[0].item', item);
    params.append('panelViews[]', JSON.stringify(view));
    params.set('annotations.filters.rootSelectionRule', 'multiple');
    filterItems.forEach((filterItem) => params.append('annotations.filters.items[]', JSON.stringify(filterItem)));

    cy.visit(`/e2e.html?${params.toString()}`);
    cy.get(selectors.textContainer).find('#var-ad').should('exist');

    openFilters();
    cy.get(`${selectors.popover} ${selectors.checkbox}`).should('have.length', 4);
  });

  it('lists the annotations of all witnesses initially', () => {
    cy.get(`${selectors.popover} ${selectors.checkbox}[data-state="checked"]`).should('have.length', 4);

    expectAnnotations([1, 2, 3, 4, 5]);
    expectWitnesses(1, ['A']);
    expectWitnesses(2, ['B']);
    expectWitnesses(3, ['A', 'D']);
    expectWitnesses(4, ['B', 'D']);
  });

  it('hides the variants of a deselected witness and keeps those shared with a selected one', () => {
    toggleFilter('Auflage a');

    // annotation-1 only belongs to witness a. annotation-3 is still listed because of witness d,
    // but no longer shows the chip of a.
    expectAnnotations([2, 3, 4, 5]);
    expectWitnesses(3, ['D']);
    expectWitnesses(4, ['B', 'D']);
  });

  it('keeps the variants of every still selected witness when several remain', () => {
    toggleFilter('Auflage d');

    // Witnesses a and b are both still selected, so the variants of both have to be merged:
    // none of the annotations disappear, only the chip of d does.
    expectAnnotations([1, 2, 3, 4, 5]);
    expectWitnesses(1, ['A']);
    expectWitnesses(2, ['B']);
    expectWitnesses(3, ['A']);
    expectWitnesses(4, ['B']);
  });

  it('lists only the variants of the last selected witness', () => {
    toggleFilter('Auflage a');
    toggleFilter('Auflage b');

    expectAnnotations([3, 4, 5]);
    expectWitnesses(3, ['D']);
    expectWitnesses(4, ['D']);
  });

  it('removes all variants once every witness is deselected', () => {
    toggleFilter('Auflage a');
    toggleFilter('Auflage b');
    toggleFilter('Auflage d');

    expectAnnotations([5]);
  });

  it('toggles a non-variant type independently of the witnesses', () => {
    toggleFilter('Satzfehlerkorrektur');

    expectAnnotations([1, 2, 3, 4]);
    expectWitnesses(3, ['A', 'D']);

    toggleFilter('Satzfehlerkorrektur');
    expectAnnotations([1, 2, 3, 4, 5]);
  });

  it('restores the variants and witness chips when a witness is selected again', () => {
    toggleFilter('Auflage a');
    expectAnnotations([2, 3, 4, 5]);
    expectWitnesses(3, ['D']);

    toggleFilter('Auflage a');
    expectAnnotations([1, 2, 3, 4, 5]);
    expectWitnesses(1, ['A']);
    expectWitnesses(3, ['A', 'D']);
  });
});
