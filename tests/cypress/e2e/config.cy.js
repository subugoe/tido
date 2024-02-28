import { ahiqarApiBaseUrl } from '../support/globals';

describe('Config', () => {
  beforeEach(() => {
  });

  it('Should show empty state', () => {
    cy.visit('/zero-config.html')
      .contains('No entrypoint URL found. Please check your configuration.');
  });

  /*
  it('Should load default Tido with collection bookmark', () => {
    //cy.visit(`/zero-config.html?collection=${ahiqarApiBaseUrl}/textapi/ahiqar/arabic-karshuni/collection.json`)
    cy.visit(`http://localhost:8181/ahiqar/textapi/ahiqar/arabic-karshuni/collection.json`)
      .get('#text-content')
      .should('be.visible')
      .get('.panels-target > .item')
      .should('have.length', 5);
  });

  it('Should load default Tido with manifest bookmark', () => {
    cy.visit(`/zero-config.html?manifest=${ahiqarApiBaseUrl}/textapi/ahiqar/arabic-karshuni/3r177/manifest.json`)
      .get('#text-content')
      .should('be.visible')
      .get('.panels-target > .item')
      .should('have.length', 5);
  });

  it('Should load default Tido with item bookmark', () => {
    cy.visit(`/zero-config.html?item=${ahiqarApiBaseUrl}/textapi/ahiqar/arabic-karshuni/3r177/2a/latest/item.json`)
      .get('#text-content')
      .should('be.visible')
      .get('.panels-target > .item')
      .should('have.length', 5);
  });

  */
});
