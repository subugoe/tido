import { ahiqarApiBaseUrl, commonSelectors } from '../support/globals';

const selectors = {
  ...commonSelectors,
};

describe('Bookmarking', () => {
  beforeEach(() => {
    cy.visit(`/ahiqar-arabic-karshuni-local.html?item=${ahiqarApiBaseUrl}/textapi/ahiqar/arabic-karshuni/3r176/182b/latest/item.json`)
      .get('#text-content')
      .contains('ܐܠܚܟܝܡ');
  });

  it('Should not have panels bookmark initially', () => {
    cy.url().should('not.include', 'panels=');
  });

  it('Should bookmark tree/metadata panel', () => {
    cy
      .get(selectors.panel1)
      .find(selectors.tabs)
      .eq(1)
      .click();

    cy.url().then((value) => decodeURIComponent(value)).should('include', 'panels=0_1,1_0,2_0,3_0');
  });

  it('Should change text panel value in query', () => {
    cy
      .get(selectors.panel3)
      .find(selectors.tabs)
      .eq(1)
      .click()
      .should('have.attr', 'data-p-active', 'true')
      .get('#text-content')
      .should('be.visible')
      .url()
      .then((value) => decodeURIComponent(value))
      .should('include', 'panels=0_0,1_0,2_1,3_0');
  });

  it('Should change annotation panel value in query', () => {
    cy
      .get(selectors.panel4)
      .find(selectors.tabs)
      .eq(1)
      .click()
      .get(selectors.panel4)
      .find('[role="tabpanel"]')
      .should('be.visible')
      .url()
      .then((value) => decodeURIComponent(value))
      .should('include', 'panels=0_0,1_0,2_0,3_1');
  });

  it('Should change panel value in query', () => {
    cy
      .get(selectors.panelsToggleCheckboxes)
      .first()
      .click()
      .wait(400)
      .url()
      .then((value) => decodeURIComponent(value))
      .should('include', 'show=1,2,3');

    cy
      .get(selectors.panelsToggleCheckboxes)
      .eq(3)
      .click()
      .wait(400)
      .url()
      .then((value) => decodeURIComponent(value))
      .should('include', 'show=1,2');
  });

  it('Should change panel value in query after reset', () => {
    cy.get(selectors.panelsToggleCheckboxes)
      .first()
      .click()
      .wait(400)
      .url()
      .then((value) => decodeURIComponent(value))
      .should('include', 'show=1,2,3');
    cy
      .get(selectors.panelsToggleCheckboxes)
      .eq(3)
      .click()
      .wait(400)
      .url()
      .then((value) => decodeURIComponent(value))
      .should('include', 'show=1,2');

    // Reset
    cy
      .get(selectors.panelsToggleCheckboxes)
      .eq(0)
      .click();

    cy
      .get(selectors.panelsToggleCheckboxes)
      .eq(3)
      .click();

    cy.wait(400).url().should('not.include', 'show');
  });

  it('Should bookmark first tab active when manifest changed', () => {

    // Click on second tab in annotation panel
    cy
      .get(selectors.panel4)
      .find(selectors.annotationsList)
      .should('be.visible')
      .get(selectors.panel4)
      .find(selectors.tabs)
      .eq(1)
      .click()
      .wait(400)// wait for tab switch transition
      .should('have.attr', 'data-p-active', 'true');

    // Expand the 7th manifest in tree
    cy
      .get(selectors.tree)
      .children(selectors.treeNodes)
      .first()
      .children('[role="group"]')
      .children(selectors.treeNodes)
      .eq(6)
      .find('button:not(.t-hidden)',
      { timeout: 10000 }
    ).click();

    // Select first item of that manifest
    cy
      .get(selectors.tree)
      .children(selectors.treeNodes)
      .first()
      .children('[role="group"]')
      .children(selectors.treeNodes)
      .eq(6)
      .children('[role="group"]')
      .children(selectors.treeNodes)
      .first()
      .click()
      .wait(400)
      .url()
      .then((value) => decodeURIComponent(value)).should('not.include', '3_1');
  });
});

describe('Bookmarking - URL first', () => {
  it('Should load tabs from URL', () => {
    cy
      .visit(`/ahiqar-arabic-karshuni-local.html?item=${ahiqarApiBaseUrl}/textapi/ahiqar/arabic-karshuni/3r176/182b/latest/item.json&panels=0_1,1_0,2_1,3_1`)
      .then(() => {
        cy
          // Tree & Metadata panel
          .get(selectors.panel1)
          .find(selectors.tabs)
          .eq(1)
          .should('have.attr', 'data-p-active', 'true')

          // Text panel
          .get(selectors.panel3)
          .find(selectors.tabs)
          .eq(1)
          .should('have.attr', 'data-p-active', 'true')

          // Annotation panel
          .get(selectors.panel4)
          .find(selectors.tabs)
          .eq(1)
          .should('have.attr', 'data-p-active', 'true')
      });
  });
});
