describe('Config', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Should display notification when there is any parsing error', () => {
    cy.get('#tido-config').invoke('prop', 'innerHTML', '').then(() => {
      const errorMessage = 'JSON Parsing error, please check the config and reload the application';

      cy.get('.config-error-container').then(($span) => {
        const errorMessage = $span.text();
      });

      cy.get('.config-error-container').as('errorEntrypointMessage');

      cy.get('@errorEntrypointMessage').should('contain', errorMessage);
    });
  });

  it('Should display notification when there is no entrypoint', () => {
    cy.get('#tido-config').invoke('text').then((text) => {
      const parsed = JSON.parse(text);
      delete parsed.entrypoint;

      cy.get('#tido-config').invoke('prop', 'innerHTML', JSON.stringify(parsed)).then(() => {
        const errorMessage
          = 'No Entrypoint is available in the config. Please add one to load viewer';

        cy.get('.config-error-container').then(($span) => {
          const errorMessage = $span.text();
        });

        cy.get('.config-error-container').as('errorEntrypointMessage');

        cy.get('@errorEntrypointMessage').should('contain', errorMessage);
      });
    });
  });
});
