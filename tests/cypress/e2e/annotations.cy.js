describe('Annotations', () => {
  beforeEach(() => {
    cy.visit('/ahiqar-local.html')
    cy.get('#panels-wrapper').should('be.visible')
      .find('.panel')
      .find('[data-cy="sidebar-toggle"]')
      .click()
      .wait(1000)
  });

    it('Should check the initial number of annotations and a few values', () => {
      cy.get('#panels-wrapper').should('be.visible')
        .find('.panel')
        .find('[data-sidebar-container="true"]')
        .find('[data-annotation]')
        .should('have.length', 7)

        .eq(0).contains('ܚܝܩܪ')
        .parents('[data-sidebar-container="true"]')
        .find('[data-annotation]')
        .eq(2).contains('ܣܪܚܐܕܘܡ')

    })
  }
)
