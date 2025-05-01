import { commonSelectors } from '../support/globals';

const selectors = {
  ...commonSelectors,
  tab: '[role="tablist"] [data-pc-section="nav"] [data-pc-name="tabpanel"]'
}

const props = [
  'showAddNewPanelButton=true',
  'showAddNewPanelButton=false',
  'colors[primary]=#123456',
  'colors[theme]=dark',
  'colors[theme]=dark&colors[primary]=#123456',
]

describe('App', () => {
  beforeEach(() => {
    cy.visit('/4w-local.html')
  });

  it('Should render app container', () => {
    cy.get('[data-cy="app"]').should('be.visible');
  });
});
