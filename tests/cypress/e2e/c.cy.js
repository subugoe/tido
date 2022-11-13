describe('c', () => {
  it('should visit', () => {
    cy.visit('/').get('#text-content').should('be.visible');
  });
});
