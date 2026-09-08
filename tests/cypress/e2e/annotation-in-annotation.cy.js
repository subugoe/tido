// Annotations whose target references another annotation instead of a text content file.
//
// Such a target is told apart by its format: `application/ld+json` means the source is an
// annotation, its JsonPathSelector points at the field holding the markup (`$.body.value`) and the
// css selector that applies within that markup sits in `refinedBy`. A target of any other format
// (`text/html`, or none on older data) references a content file and carries its css selector
// directly. Both forms have to resolve to the same thing in the end: a highlighted element.
//
// The data under test is Classic Literature > The Great Gatsby > Page 2, where three annotations
// are chained onto annotation-1 of the transcription:
//
//   #valley (transcription)  <- annotation-1        (format text/html, CssSelector)
//     #ash-valley-decay      <- annotation-L2-1     (format application/ld+json, refinedBy)
//       #wasteland-tradition <- annotation-L3-1     (format application/ld+json, refinedBy)
//         #eliot-reception   <- annotation-L4-1     (format application/ld+json, refinedBy)

describe('Annotation in annotation', () => {

  const apiUrl = Cypress.env('API_URL') || 'http://localhost:8181';
  const collection = `${apiUrl}/example/collections/example.json`;

  // The chain hangs off an annotation of the transcription, which is not the text this item shows
  // by default (its first content type is the diplomatic one), so the view asks for it explicitly.
  const transcriptionView = { label: 'Text', view: 'text', activeContentType: 'transcription' };

  // List mode keeps the cards in normal flow, so a nested card sits inside its parent card in the
  // DOM and nothing has to be positioned before the assertions can run.
  const listConfig = `annotations.defaultMode=list`
    + `&panels[0].collection=${collection}`
    + `&panelViews[]=${encodeURIComponent(JSON.stringify(transcriptionView))}`;

  const idFor = (annotation) => `${apiUrl}/example/book3/page2/rev1/${annotation}`;
  const cardFor = (annotation) => `[data-annotation="${idFor(annotation)}"]`;

  // The chain of the mock data, from the annotation on the text down to the deepest one. Every entry
  // is the card of an annotation, the element inside its body that the next annotation targets, and
  // that next annotation.
  const chain = [
    { annotation: 'annotation-1', target: '#ash-valley-decay', child: 'annotation-L2-1' },
    { annotation: 'annotation-L2-1', target: '#wasteland-tradition', child: 'annotation-L3-1' },
    { annotation: 'annotation-L3-1', target: '#eliot-reception', child: 'annotation-L4-1' },
  ];

  const selectors = {
    sidebarToggle: '[data-cy="sidebar-toggle"]',
    sidebarContainer: '[data-sidebar-view]',
    sidebarLoading: '[data-cy="sidebar-loading"]',
    textContainer: '[data-text-container]',
    // The footer of a card, holding its "n nested annotation(s)" label and toggling the nested cards.
    footer: '.footer-stripe',
    nestedList: '.nested-annotations',
    annotationIds: 'data-annotation-ids',
    // Set on a target while the annotation it belongs to is the selected one.
    targetSelected: 'data-annotation-selected'
  };

  const sidebar = () => cy.get(selectors.sidebarContainer);

  // Opens the item at itemIndex of the manifest at manifestIndex of the example collection, reading
  // both URLs from the API so the spec names what it opens by position instead of by URL.
  const openItem = (manifestIndex, itemIndex, config = listConfig) => {
    cy.request(collection).its('body.manifests').then((manifests) => {
      const manifest = manifests[manifestIndex];

      cy.request(manifest).its('body.items').then((items) => {
        cy.visit(`/e2e.html?${config}&panels[0].manifest=${manifest}&panels[0].item=${items[itemIndex]}`);
      });
    });
  };

  // The Great Gatsby (the third manifest) Page 2 (its second item) showing the transcription, with
  // the sidebar open and done loading its cards.
  const openPage2 = () => {
    openItem(2, 1);
    cy.get('[data-cy="item-label"]').contains('Page 2');
    cy.get(selectors.textContainer).should('exist');
    cy.get(selectors.textContainer).find('#valley').should('exist');

    cy.get(selectors.sidebarToggle).click();
    sidebar().should('be.visible');
    cy.get(selectors.sidebarLoading).should('not.exist');
  };

  // Expands the nested annotations of the card of the given annotation by clicking its own footer -
  // the first one in the card, since the footers of already expanded descendants follow it.
  const expandNested = (annotation) => {
    sidebar().find(cardFor(annotation)).find(selectors.footer).first().click();
  };

  // Clicks the card of the given annotation itself: in its top left padding, which belongs to the
  // card and holds neither a target of a nested annotation nor one of the cards nested in it.
  const clickCard = (annotation) => {
    sidebar().find(cardFor(annotation)).click(5, 5);
  };

  beforeEach(() => {
    openPage2();
  });

  it('Should list the annotation of the text but not the annotations nested in it', () => {
    sidebar().find(cardFor('annotation-1')).should('exist');

    // The nested ones target an annotation, not the text, so they are no cards of their own until
    // their parent is expanded.
    chain.forEach(({ child }) => {
      sidebar().find(cardFor(child)).should('not.exist');
    });
  });

  it('Should resolve a text/html target to the element it selects in the text', () => {
    // The plain CssSelector form: annotation-1 highlights #valley in the transcription.
    cy.get(selectors.textContainer)
      .find('#valley')
      .should('have.attr', selectors.annotationIds)
      .and('contain', idFor('annotation-1'));
  });

  it('Should announce the annotation nested in the annotation of the text', () => {
    sidebar()
      .find(cardFor('annotation-1'))
      .find(selectors.footer)
      .first()
      .should('contain.text', '1 nested annotation');
  });

  it('Should show the nested annotation inside the card of its parent when expanded', () => {
    expandNested('annotation-1');

    sidebar()
      .find(cardFor('annotation-1'))
      .find(selectors.nestedList)
      .find(cardFor('annotation-L2-1'))
      .should('exist');
  });

  it('Should hide the nested annotation again when collapsed', () => {
    expandNested('annotation-1');
    sidebar().find(cardFor('annotation-L2-1')).should('exist');

    expandNested('annotation-1');
    sidebar().find(cardFor('annotation-L2-1')).should('not.exist');
  });

  it('Should resolve an application/ld+json target to the element it selects in the body of the referenced annotation', () => {
    // The JsonPathSelector/refinedBy form: the css selector sits in refinedBy and applies to the
    // markup of the referenced annotation's body, where it has to end up highlighted just like a
    // target in a text does.
    expandNested('annotation-1');

    sidebar()
      .find(cardFor('annotation-1'))
      .find('#ash-valley-decay')
      .should('have.attr', selectors.annotationIds)
      .and('contain', idFor('annotation-L2-1'));
  });

  it('Should nest the annotations of the chain into each other down to the deepest one', () => {
    chain.forEach(({ annotation, target, child }) => {
      expandNested(annotation);

      // the child is rendered within the card of its parent
      sidebar().find(cardFor(annotation)).find(cardFor(child)).should('exist');

      // and its target is the element of the parent's body that it selects via refinedBy
      sidebar()
        .find(cardFor(annotation))
        .find(target)
        .first()
        .should('have.attr', selectors.annotationIds)
        .and('contain', idFor(child));
    });

    // the whole chain is open at once: the deepest annotation sits inside every annotation above it
    sidebar()
      .find(cardFor('annotation-1'))
      .find(cardFor('annotation-L2-1'))
      .find(cardFor('annotation-L3-1'))
      .find(cardFor('annotation-L4-1'))
      .should('exist');
  });

  it('Should expand the nested annotations when clicking their target in the body of the parent', () => {
    sidebar().find(cardFor('annotation-L2-1')).should('not.exist');

    sidebar().find(cardFor('annotation-1')).find('#ash-valley-decay').click();

    sidebar()
      .find(cardFor('annotation-1'))
      .find(cardFor('annotation-L2-1'))
      .should('exist');
  });

  it('Should select the nested annotation when clicking its card', () => {
    expandNested('annotation-1');

    clickCard('annotation-L2-1');
    sidebar().find(cardFor('annotation-L2-1')).should('have.attr', 'data-selected');
  });

  it('Should select the target in the parent annotation when selecting the nested annotation', () => {
    expandNested('annotation-1');

    clickCard('annotation-L2-1');
    sidebar().find(cardFor('annotation-L2-1')).should('have.attr', 'data-selected');

    // Selecting a card marks the target of that annotation, which for a nested annotation lives in
    // the body of its parent - reached through the refinedBy selector of its application/ld+json target.
    sidebar()
      .find(cardFor('annotation-1'))
      .find('#ash-valley-decay')
      .should('have.attr', selectors.targetSelected, 'true');
  });

  it('Should select the child annotation when clicking a target inside a nested annotation', () => {
    expandNested('annotation-1');

    // "post-war wasteland tradition" in the body of annotation-L2-1 is the target of annotation-L3-1,
    // the only annotation on it - so the click selects it right away instead of opening the popover.
    sidebar().find(cardFor('annotation-L2-1')).find('#wasteland-tradition').click();

    sidebar()
      .find(cardFor('annotation-L2-1'))
      .find('[data-annotation$="annotation-L3-1"]')
      .should('exist')
      .and('have.attr', 'data-selected');

    // and the clicked target is marked as the selected one
    sidebar()
      .find(cardFor('annotation-L2-1'))
      .find('#wasteland-tradition')
      .should('have.attr', selectors.targetSelected, 'true');
  });

  it('Should deselect the child annotation when clicking its target again', () => {
    expandNested('annotation-1');

    const target = () => sidebar().find(cardFor('annotation-L2-1')).find('#wasteland-tradition');

    target().click();
    sidebar().find(cardFor('annotation-L3-1')).should('have.attr', 'data-selected');

    // clicking the target of the already selected annotation drops the selection again
    target().click();

    sidebar().find(cardFor('annotation-L3-1')).should('not.have.attr', 'data-selected');
    target().should('not.have.attr', selectors.targetSelected);
  });

  it('Should deselect the target in the parent annotation when deselecting the child annotation', () => {
    expandNested('annotation-1');

    sidebar().find(cardFor('annotation-L2-1')).find('#wasteland-tradition').click();
    sidebar().find(cardFor('annotation-L3-1')).should('have.attr', 'data-selected');

    // deselecting the card has to clear the mark on its target in the body of the parent annotation
    clickCard('annotation-L3-1');

    sidebar().find(cardFor('annotation-L3-1')).should('not.have.attr', 'data-selected');
    sidebar()
      .find(cardFor('annotation-L2-1'))
      .find('#wasteland-tradition')
      .should('not.have.attr', selectors.targetSelected);
  });
});
