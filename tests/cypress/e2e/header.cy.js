import { ahiqarApiBaseUrl } from '../support/globals';

describe('Header initial', () => {
  beforeEach(() => {
    
      // Orlin: commented this temporarily .visit('/ahiqar-arabic-karshuni-local.html')
      cy.visit('http://localhost:2222/ahiqar-arabic-karshuni-local.html?tido={"m":0,"i":0}')
      .get('.panels-target > .item:nth-child(3)').find('.panel-body')
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
    cy.get('.panels-target').children('.item').should('have.length', 4);

    // Clicking on first item
    cy
      .get('.panels-toggle .row div:first-child .q-checkbox')
      .click()
      .get('.panels-target')
      .children('.item')
      .first()
      .should('not.be.visible');

    // Reseting item
    cy
      .get('.panels-toggle .row div:first-child .q-checkbox')
      .click()
      .get('.panels-target')
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
      // Orlin: commented this temporarily . .visit(`/ahiqar-arabic-karshuni-local.html?item=${ahiqarApiBaseUrl}/textapi/ahiqar/arabic-karshuni/3r7vd/130/latest/item.json`)
      .visit('http://localhost:2222/ahiqar-arabic-karshuni-local.html?tido={"m":7,"i":0,"p":"0_0,1_0,2_0,3_0"}')
      .get('.panels-target > .item:nth-child(3)').find('.panel-body')
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
      .should('include', 'tido={"m":6,"i":57,"p":"0_0,1_0,2_0,3_0"}');
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
      .should('include', 'tido={"m":7,"i":1,"p":"0_0,1_0,2_0,3_0"}');
  });
});
