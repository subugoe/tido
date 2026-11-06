describe('Annotations on a content type switch', () => {

  const apiUrl = Cypress.env('API_URL') || 'http://localhost:8181';
  const collection = `${apiUrl}/example/collections/example.json`;
  const manifest = `${apiUrl}/example/manifests/book2.json`;
  const item = (page) => `${apiUrl}/example/items/book2-page${page}.json`;
  const annotationId = (name, page = 'page3') => `${apiUrl}/example/book2/${page}/rev1/${name}`;

  const selectors = {
    sidebarToggle: '[data-cy="sidebar-toggle"]',
    sidebarContainer: '[data-sidebar-view]',
    sidebarBadge: '[data-cy="sidebar-toggle"] [data-slot="badge"]',
    textContainer: '[data-text-container]',
    contentType: '[data-cy="content-type"]',
    contentTypesDropdown: '[data-cy="content-types-dropdown"]',
    nextItemButton: '[data-cy="next-item-button"]',
  };

  // The classes and attributes a target gets from TextAnnotationsLayer (see utils/constants.ts)
  const HIGHLIGHT_CLASS = 'bg-accent';
  const SELECTED_CLASS = 'bg-annotation-selected';
  const ANNOTATION_IDS_ATTRIBUTE = 'data-annotation-ids';
  const SELECTED_ATTRIBUTE = 'data-annotation-selected';

  // Chapter 3 (book2-page3): the three texts share most element ids, but each content type annotates
  // other ones. #para1 and #queequeg are targets in the transcription only (#queequeg also in the
  // normalized text), #spouter-inn and #dipl-alt in the diplomatic text only.
  const chapter3 = {
    transcription: {
      targets: ['#para1', '#queequeg', '#oil-painting', '#harpooneer'],
      annotations: ['annotation-2', 'annotation-3', 'annotation-4', 'annotation-5'],
    },
    diplomatic: {
      targets: ['#spouter-inn', '#dipl-alt', '#oil-painting', '#harpooneer'],
      // annotation-diplomatic-1 targets #dipl-gable, which the text does not contain - it is listed all the same
      annotations: ['annotation-1', 'annotation-diplomatic-1', 'annotation-diplomatic-2', 'annotation-diplomatic-3', 'annotation-diplomatic-4'],
    },
  };

  const textView = (activeContentType) => ({
    label: 'Text', view: 'text', activeContentType, contentTypes: ['transcription', 'diplomatic', 'normalized']
  });

  const openChapter = (page, activeContentType) => {
    const params = new URLSearchParams();
    params.set('annotations.defaultMode', 'list');
    params.set('panels[0].collection', collection);
    params.set('panels[0].manifest', manifest);
    params.set('panels[0].item', item(page));
    params.append('panelViews[]', JSON.stringify(textView(activeContentType)));

    cy.visit(`/e2e.html?${params.toString()}`);
    cy.get('[data-cy="item-label"]').contains(`Page ${page}`);
    cy.get(selectors.textContainer).should('have.length', 1);
  };

  const switchContentType = (contentType) => {
    cy.get(selectors.contentType).first().click();
    cy.get(selectors.contentTypesDropdown).contains(contentType).click();
    cy.get(selectors.contentTypesDropdown).should('not.exist');
    cy.get(selectors.contentType).first().should('contain.text', contentType);
  };

  const target = (selector) => cy.get(selectors.textContainer).first().find(selector);

  const expectHighlighted = (selectors) => selectors.forEach((selector) =>
    target(selector).should('have.class', HIGHLIGHT_CLASS).and('have.attr', ANNOTATION_IDS_ATTRIBUTE));

  // A target of another content type must carry none of the annotation styles in this text. Checked
  // in one callback, as a chained 'not.have.attr' changes the subject for the next assertion.
  const expectNotStyled = (selectors) => selectors.forEach((selector) =>
    target(selector).should(($el) => {
      expect($el, selector).to.exist;
      expect($el, selector).not.to.have.class(HIGHLIGHT_CLASS);
      expect($el, selector).not.to.have.class(SELECTED_CLASS);
      expect($el, selector).not.to.have.attr(ANNOTATION_IDS_ATTRIBUTE);
      expect($el, selector).not.to.have.attr(SELECTED_ATTRIBUTE);
    }));

  const expectListedAnnotations = (names, page = 'page3') => {
    cy.get(selectors.sidebarContainer).find('[data-annotation]').should(($cards) => {
      const listed = [...$cards].map((card) => card.getAttribute('data-annotation'));
      expect(listed).to.have.members(names.map((name) => annotationId(name, page)));
    });
    cy.get(selectors.sidebarBadge).should('have.text', String(names.length));
  };

  it('Highlights only the targets of the new content type after a switch', () => {
    openChapter(3, 'transcription');
    expectHighlighted(chapter3.transcription.targets);
    expectNotStyled(['#spouter-inn']);

    switchContentType('diplomatic');

    // The positive check first, so the negative ones run once the diplomatic text has been styled.
    expectHighlighted(chapter3.diplomatic.targets);
    // #para1 and #queequeg exist in the diplomatic text too, but are only targets in the transcription
    expectNotStyled(['#para1', '#queequeg']);
  });

  it('Highlights and lists the targets of a content type again when switching back to it', () => {
    openChapter(3, 'transcription');
    cy.get(selectors.sidebarToggle).click();
    cy.get(selectors.sidebarContainer).should('be.visible');
    expectListedAnnotations(chapter3.transcription.annotations);

    switchContentType('diplomatic');
    expectHighlighted(chapter3.diplomatic.targets);
    expectListedAnnotations(chapter3.diplomatic.annotations);

    // The map of the transcription was kept on the switch - going back to it shows its targets and
    // annotations again, without any of the diplomatic text.
    switchContentType('transcription');
    expectHighlighted(chapter3.transcription.targets);
    expectNotStyled(['#spouter-inn']);
    expectListedAnnotations(chapter3.transcription.annotations);
  });

  it('Removes the selection style of a target that is not a target of the new content type', () => {
    openChapter(3, 'transcription');

    // #para1 is the target of annotation-5, which only belongs to the transcription
    target('#para1').click();
    cy.get(selectors.sidebarContainer).should('be.visible');
    cy.get(selectors.sidebarContainer)
      .find(`[data-annotation="${annotationId('annotation-5')}"]`)
      .should('have.attr', 'data-selected', 'true');
    target('#para1').should('have.class', SELECTED_CLASS).and('have.attr', SELECTED_ATTRIBUTE, 'true');

    switchContentType('diplomatic');
    expectHighlighted(chapter3.diplomatic.targets);
    expectNotStyled(['#para1']);
    cy.get(selectors.textContainer).first().find(`.${SELECTED_CLASS}`).should('not.exist');
    cy.get(selectors.textContainer).first().find(`[${SELECTED_ATTRIBUTE}]`).should('not.exist');
  });

  it('Creates new maps on item navigation after switching content types', () => {
    openChapter(2, 'transcription');
    cy.get(selectors.sidebarToggle).click();
    cy.get(selectors.sidebarContainer).should('be.visible');

    // Switch away and back, so the panel holds maps of two content types of Chapter 2.
    switchContentType('normalized');
    expectListedAnnotations(['annotation-normalized-1'], 'page2');
    switchContentType('diplomatic');
    expectListedAnnotations(['annotation-diplomatic-1'], 'page2');

    // The view keeps its content type on the new item. Only Chapter 3's diplomatic map is shown - none
    // of the Chapter 2 maps and none of the other content types of Chapter 3.
    cy.get(selectors.nextItemButton).click();
    cy.get('[data-cy="item-label"]').contains('Page 3');
    cy.get(selectors.contentType).first().should('contain.text', 'diplomatic');

    expectHighlighted(chapter3.diplomatic.targets);
    expectNotStyled(['#para1', '#queequeg']);
    expectListedAnnotations(chapter3.diplomatic.annotations);
  });
});
