import { commonSelectors } from '../support/globals';

const selectors = {
  ...commonSelectors
};

describe('Tree', () => {
  beforeEach(() => {
    cy
      .visit('/ahiqar-arabic-karshuni-local.html')
      .get(selectors.panel3)
      .find('.panel-body')
      .find('#text-content')
      .should('be.visible')
      .wait(1000);
  });

  it('Should display collection node', () => {
    cy
      .get(selectors.panel1)
      .find(selectors.tree)
      .children(selectors.treeNodes)
      .first()
      .contains('Textual witnesses in Arabic and Karshuni');
  });

  it('Should display manifests in collection', () => {
    cy
      .get(selectors.panel1)
      .find(selectors.tree)
      .children(selectors.treeNodes)
      .first()
      .children(selectors.treeNodesContainer)
      .children(selectors.treeNodes)
      .should('have.length', 30);
  });

  it('Should display items in first manifest', () => {
    cy
      .get(selectors.panel1)
      .find(selectors.tree)
      .children(selectors.treeNodes)
      .first()
      .children(selectors.treeNodesContainer)
      .children(selectors.treeNodes)
      .first()
      .should('contain', 'Cod. Arab. 236 Copenhagen')
      .children(selectors.treeNodesContainer)
      .children(selectors.treeNodes)
      .should('have.length', 81);
  });

  it('Should open first item in first manifest', () => {
    cy
      .get(selectors.panel1)
      .find(selectors.tree)
      .children(selectors.treeNodes)
      .first()
      .children(selectors.treeNodesContainer)
      .children(selectors.treeNodes)
      .first()
      .should('contain', 'Cod. Arab. 236 Copenhagen')
      .children(selectors.treeNodesContainer)
      .children(selectors.treeNodes)
      .first()
      .should('have.attr', 'aria-checked', 'true')
      .should('contain', '2a');
  });

  it('Should switch to other item', () => {
    cy
      .get(selectors.panel1)
      .find(selectors.tree)
      .children(selectors.treeNodes)
      .first()
      .children(selectors.treeNodesContainer)
      .children(selectors.treeNodes)
      .first()
      .should('contain', 'Cod. Arab. 236 Copenhagen')
      .children(selectors.treeNodesContainer)
      .children(selectors.treeNodes)
      .eq(1)
      .click()
      .should('have.attr', 'aria-checked', 'true')
      .url()
      .should('contain', 'tido=m0_i1');
  });

  it('Should switch to other manifest', () => {
    cy
      .get(selectors.panel1)
      .find(selectors.tree)
      .children(selectors.treeNodes)
      .first()
      .children(selectors.treeNodesContainer)
      .children(selectors.treeNodes)
      .eq(20)
      .click()
      .children(selectors.treeNodesContainer)
      .children(selectors.treeNodes)
      .first()
      .click()
      .should('have.attr', 'aria-checked', 'true')
      .url()
      .should('contain', 'tido=m20_i0');
  });
});
