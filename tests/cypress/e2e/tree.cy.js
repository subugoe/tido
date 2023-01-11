describe('Tree', () => {
  beforeEach(() => {
    cy
      .visit('/ahiqar-arabic-karshuni-local.html')
      .get('.panels-target > .item:nth-child(3)').find('.panel-body')
      .find('#text-content')
      .should('be.visible');
  });

  it('Should display collection node', () => {
    cy
      .get('.panels-target > .item:nth-child(1)')
      .find('.q-tree > .q-tree__node')
      .contains('Textual witnesses in Arabic and Karshuni');
  });

  it('Should display manifests in collection', () => {
    cy
      .get('.panels-target > .item:nth-child(1)')
      .find('.q-tree > .q-tree__node > .q-tree__node-collapsible > .q-tree__children')
      .children()
      .should('have.length', 24);
  });

  it('Should display items in first manifest', () => {
    cy
      .wait(1000)
      .get('.panels-target > .item:nth-child(1)')
      .find('.q-tree > .q-tree__node > .q-tree__node-collapsible > .q-tree__children')
      .children()
      .first()
      .should('contain', 'Cod. Arab. 236 Copenhagen')
      .find('> .q-tree__node-collapsible > .q-tree__children')
      .children()
      .should('have.length', 81);
  });

  it('Should open first item in first manifest', () => {
    cy
      .wait(1000)
      .get('.panels-target > .item:nth-child(1)')
      .find('.q-tree > .q-tree__node > .q-tree__node-collapsible > .q-tree__children')
      .children()
      .first()
      .should('contain', 'Cod. Arab. 236 Copenhagen')
      .find('> .q-tree__node-collapsible > .q-tree__children')
      .children()
      .first()
      .find('.q-tree__node-header')
      .should('have.class', 'q-tree__node--selected')
      .should('contain', 'Sheet 1');
  });

  it('Should switch to other item', () => {
    cy
      .wait(1000)
      .get('.panels-target > .item:nth-child(1)')
      .find('.q-tree > .q-tree__node > .q-tree__node-collapsible > .q-tree__children')
      .children()
      .first()
      .should('contain', 'Cod. Arab. 236 Copenhagen')
      .find('> .q-tree__node-collapsible > .q-tree__children')
      .children()
      .eq(2)
      .click()
      .find('.q-tree__node-header')
      .should('have.class', 'q-tree__node--selected')
      .url()
      .should('contain', '3r177-3a');
  });

  it('Should switch to other manifest', () => {
    cy
      .wait(1000)
      .get('.panels-target > .item:nth-child(1)')
      .find('.q-tree > .q-tree__node > .q-tree__node-collapsible > .q-tree__children')
      .children()
      .eq(16)
      .click()
      .find('> .q-tree__node-collapsible > .q-tree__children')
      .children()
      .first()
      .click()
      .find('.q-tree__node-header')
      .should('have.class', 'q-tree__node--selected')
      .url()
      .should('contain', '3r176-182b');
  });
});
