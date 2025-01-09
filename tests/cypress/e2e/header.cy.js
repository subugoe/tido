import { commonSelectors } from '../support/globals';

const selectors = {
  ...commonSelectors,
  dialog: '[role="dialog"]'
}

describe('Header initial', () => {
  beforeEach(() => {
      cy.visit('/ahiqar-arabic-karshuni-local.html?tido=m0_i0')
        .get(selectors.panel3)
        .find('.panel-body')
      .find('#text-content')
      .should('be.visible');
  });

  it('Should have disabled prev manifest button', () => {
    cy
      .get(selectors.prevButton)
      .should('be.visible')
      .should('be.disabled')
      .contains('Previous Manuscript');
  });

  it('Should toggle panels', () => {
    cy
      .get(selectors.panelsWrapper)
      .find('.panel')
      .should('have.length', 4);

    // Clicking on first item
    cy
      .get(selectors.panelsToggleCheckboxes)
      .first()
      .click()
      .get(selectors.panelsWrapper)
      .find('.panel')
      .first()
      .should('not.be.visible');

    // Reseting item
    cy
      .get(selectors.panelsToggleCheckboxes)
      .first()
      .click()
      .get(selectors.panelsWrapper)
      .find('.panel')
      .first()
      .should('be.visible');
  });

  it('Should open Info dialog box', () => {
    cy
      .get('button[title="Project Info"]')
      .click();
    cy
      .get(selectors.dialog)
      .should('be.visible');
  });
});

describe('Header - Item and Manifest changing', () => {
  beforeEach(() => {
    cy
      .visit('/ahiqar-arabic-karshuni-local.html?tido=m7_i0')
      .get(selectors.panel3)
      .find('.panel-body')
      .find('#text-content')
      .should('be.visible');
  });

  it('Should switch to previous manifest', () => {
    cy
      .get(selectors.prevButton)
      .should('not.be.disabled')
      .contains('Previous Manuscript');

    cy
      .get(selectors.prevButton)
      .click()
      .wait(200)
      .url()
      .then((value) => decodeURIComponent(value))
      .should('include', 'tido=m6_i57');
  });

  it('Should switch to next sheet', () => {
    cy
      .get(selectors.nextButton)
      .should('not.be.disabled')
      .contains('Next Sheet');

    cy
      .get(selectors.nextButton)
      .click()
      .wait(200)
      .url()
      .then((value) => decodeURIComponent(value))
      .should('include', 'tido=m7_i1');
  });
});

