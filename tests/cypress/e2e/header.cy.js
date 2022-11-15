import { apiBaseUrl } from '../support/globals';

describe('Header initial', () => {
  beforeEach(() => {
    cy
      .visit('/ahiqar-arabic-karshuni-local.html')
      .get('.root.panels-target > .item:nth-child(3)').find('.panel-body')
      .find('#text-content')
      .should('be.visible');
  });

  it('Should have disabled prev manifest button', () => {
    cy
      .get('button.previous-item')
      .should('be.visible')
      .should('be.disabled')
      .contains('Previous Manuscript');
  });

  it('Should toggle panels', () => {
    cy.get('.root.panels-target').children('.item').should('have.length', 4);

    // Clicking on first item
    cy
      .get('.panels-toggle .row div:first-child .q-checkbox')
      .click()
      .get('.root.panels-target')
      .children('.item')
      .first()
      .should('not.be.visible');

    // Reseting item
    cy
      .get('.panels-toggle .row div:first-child .q-checkbox')
      .click()
      .get('.root.panels-target')
      .children('.item')
      .first()
      .should('be.visible');
  });

  it('Should open Info dialog box', () => {
    cy.get('button[title="Project Info"]').click();
    cy.get('.q-dialog').should('be.visible');
  });
});

describe('Header - Item and Manifest changing', () => {
  beforeEach(() => {
    cy
      .visit(`/ahiqar-arabic-karshuni-local.html?item=${apiBaseUrl}/3r7vd/3r7vd-130/latest/item.json`)
      .get('.root.panels-target > .item:nth-child(3)').find('.panel-body')
      .find('#text-content')
      .should('be.visible');
  });

  it('Should switch to previous manifest', () => {
    cy
      .get('button.previous-item')
      .should('not.be.disabled')
      .contains('Previous Manuscript');

    cy
      .get('button.previous-item')
      .click()
      .wait(200)
      .url()
      .then((value) => decodeURIComponent(value))
      .should('include', '/3r7tp/3r7tp-251/latest/item.json');
  });

  it('Should switch to next sheet', () => {
    cy
      .get('button.next-item')
      .should('not.be.disabled')
      .contains('Next Sheet');

    cy
      .get('button.next-item')
      .click()
      .wait(200)
      .url()
      .then((value) => decodeURIComponent(value))
      .should('include', '/3r7vd/3r7vd-131a/latest/item.json');
  });
});
