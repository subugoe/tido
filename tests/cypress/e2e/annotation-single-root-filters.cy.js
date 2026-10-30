describe('Annotation filters with single root selection', () => {

  const apiUrl = Cypress.env('API_URL') || 'http://localhost:8181';

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
    tab: '[data-slot="tabs-trigger"]',
    itemLabel: '[data-cy="item-label"]',
    nextItem: '[data-cy="next-item-button"]',
  };

  const sidebar = () => cy.get(selectors.sidebarContainer);

  // The filter shape of examples/config/mha.json and examples/config/bdn.json: the roots are tabs, of
  // which only one is active. No "selectedIndex", so the first root is the active one.
  const open = (manifest, item, filterItems) => {
    const params = new URLSearchParams();
    params.set('annotations.defaultMode', 'list');
    params.set('panels[0].manifest', manifest);
    params.set('panels[0].item', item);
    params.append('panelViews[]', JSON.stringify(view));
    params.set('annotations.filters.rootSelectionRule', 'single');
    filterItems.forEach((filterItem) => params.append('annotations.filters.items[]', JSON.stringify(filterItem)));

    cy.visit(`/e2e.html?${params.toString()}`);
  };

  const expectAnnotationsCount = (count) => {
    sidebar().find('[data-annotation]').should('have.length', count);
  };

  describe('with a witness root and a plain type root', () => {
    const annotationId = (n) => `${apiUrl}/example/variants/page1/annotation-${n}`;

    // The annotation page holds four Variant annotations (1-4) plus one EditorialCorrection (5).
    const filterItems = [
      {
        label: 'Textkritik',
        items: [
          { label: 'Auflage a', types: [{ Variant: 'a' }] },
          { label: 'Auflage b', types: [{ Variant: 'b' }] },
          { label: 'Auflage d', types: [{ Variant: 'd' }] },
        ],
      },
      {
        label: 'Erläuterungen',
        items: [{ label: 'Satzfehlerkorrektur', types: ['EditorialCorrection'] }],
      },
    ];

    const expectAnnotations = (numbers) => {
      expectAnnotationsCount(numbers.length);
      numbers.forEach((n) => sidebar().find(`[data-annotation="${annotationId(n)}"]`).should('exist'));
    };

    beforeEach(() => {
      open(`${apiUrl}/example/manifests/variants.json`, `${apiUrl}/example/items/variants-page1.json`, filterItems);
      cy.get(selectors.textContainer).find('#var-ad').should('exist');
      cy.get(selectors.sidebarToggle).click();
    });

    it('lists only the annotations of the active root on initial load', () => {
      expectAnnotations([1, 2, 3, 4]);
    });

    it('switches the listed annotations with the active root', () => {
      expectAnnotations([1, 2, 3, 4]);

      sidebar().contains('button', /filters/i).click();
      cy.get(selectors.popover).contains(selectors.tab, 'Erläuterungen').click();
      expectAnnotations([5]);

      cy.get(selectors.popover).contains(selectors.tab, 'Textkritik').click();
      expectAnnotations([1, 2, 3, 4]);
    });
  });

  describe('across item navigation', () => {
    const filterItems = [
      { label: 'Characters', types: ['Character'] },
      { label: 'Places', types: ['Place'] },
    ];

    it('applies the active root to the item navigated to', () => {
      open(`${apiUrl}/example/manifests/book1.json`, `${apiUrl}/example/items/book1-page1.json`, filterItems);
      cy.get(selectors.itemLabel).contains('Page 1');
      cy.get(selectors.sidebarToggle).click();
      expectAnnotationsCount(3);

      cy.get(selectors.nextItem).click();
      cy.get(selectors.itemLabel).contains('Page 2');
      expectAnnotationsCount(2);
    });
  });
});
