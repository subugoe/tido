import { commonSelectors } from '../support/globals';

const selectors = {
  ...commonSelectors,
  tab: '[role="tablist"] [data-pc-section="nav"] [data-pc-name="tabpanel"]'
}

describe('App', () => {
  beforeEach(() => {
    cy.visit('/4w-local.html')
  });

  it('Should render app container', () => {
    cy.get('[data-cy="app"]').should('be.visible');
  });
});
