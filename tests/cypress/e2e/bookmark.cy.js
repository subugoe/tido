import { ahiqarApiBaseUrl, commonSelectors } from '../support/globals';

const selectors = {
  ...commonSelectors,
};

describe('Bookmarking', () => {


  beforeEach(() => {
    cy.visit(`http://localhost:2222/ahiqar-arabic-karshuni-local.html?tido=m20_i0`)
        .get('#text-content')
        .contains('ܐܠܚܟܝܡ');

  });

  it('Should not have panels bookmark initially', () => {
    cy.wait(400).url().then((url) => {
      const splitUrl = url.split('tido')[1];
      expect(splitUrl).to.not.include('p')
    })
  });

  it('Should bookmark tree/metadata panel', () => {
    cy
      .get(selectors.panel1)
      .find(selectors.tabs)
      .eq(1)
      .click();
    cy.url().then((value) => decodeURIComponent(value)).should('include', 'p0.1-1.0-2.0-3.0');
  });

  it('Should change text panel value in query', () => {
    cy
      .get(selectors.panel3)
      .find(selectors.tabs)
      .eq(1)
      .click()
      .should('have.attr', 'data-p-active', 'true')
      .get('#text-content')
      .should('be.visible')
      .url()
      .then((value) => decodeURIComponent(value))
      .should('include', 'p0.0-1.0-2.1-3.0');
  });

  it('Should change annotation panel value in query', () => {
    cy
      .get(selectors.panel4)
      .find(selectors.tabs)
      .eq(1)
      .click()
      .get(selectors.panel4)
      .find('[role="tabpanel"]')
      .should('be.visible')
      .url()
      .then((value) => decodeURIComponent(value))
      .should('include', 'p0.0-1.0-2.0-3.1');
  });

  it('Should change panel value in query', () => {
    cy
      .get(selectors.panelsToggleCheckboxes)
      .first()
      .click()
      .wait(400)
      .url()
      .then((value) => decodeURIComponent(value))
      .should('include', 's1-2-3');

    cy
      .get(selectors.panelsToggleCheckboxes)
      .eq(3)
      .click()
      .wait(400)
      .url()
      .then((value) => decodeURIComponent(value))
      .should('include', 's1-2');
  });

  it('Should change panel value in query after reset', () => {
    cy.get(selectors.panelsToggleCheckboxes)
      .first()
      .click()
      .wait(400)
      .url()
      .then((value) => decodeURIComponent(value))
      .should('include', 's1-2-3');
    cy.get('.panels-toggle .row div:nth-child(4) .q-checkbox').click().wait(400)
      .url()
      .then((value) => decodeURIComponent(value))
      .should('include', 's1-2');

    // Reset
    cy
      .get(selectors.panelsToggleCheckboxes)
      .eq(0)
      .click();

    cy
      .get(selectors.panelsToggleCheckboxes)
      .eq(3)
      .click();

    cy.wait(400).url().then((url) => {
      const splitUrl = url.split('tido')[1];
      expect(splitUrl).to.not.include('s')
    })
  });

  it('Should bookmark first tab active when manifest changed', () => {

    // Click on second tab in annotation panel
    cy
      .get(selectors.panel4)
      .find(selectors.annotationsList)
      .should('be.visible')
      .get(selectors.panel4)
      .find(selectors.tabs)
      .eq(1)
      .click()
      .wait(400)// wait for tab switch transition
      .should('have.attr', 'data-p-active', 'true');

    // Expand the 7th manifest in tree
    cy
      .get(selectors.tree)
      .children(selectors.treeNodes)
      .first()
      .children('[role="group"]')
      .children(selectors.treeNodes)
      .eq(6)
      .find('button:not(.t-hidden)',
      { timeout: 10000 }
    ).click();

    // Select first item of that manifest
    cy
      .get(selectors.tree)
      .children(selectors.treeNodes)
      .first()
      .children('[role="group"]')
      .children(selectors.treeNodes)
      .eq(6)
      .children('[role="group"]')
      .children(selectors.treeNodes)
      .first()
      .click()
      .wait(400)
      .url()
      .then((value) => decodeURIComponent(value)).should('not.include', '3.1');
  });
});

describe('Bookmarking - URL first', () => {
  it('Should load tabs from URL', () => {
    cy
      .visit(`http://localhost:2222/ahiqar-arabic-karshuni-local.html?tido=m20_i0_p0.1-1.0-2.1-3.1_s0-1-2-3`)
      .then(() => {
        cy
          // Tree & Metadata panel
          .get(selectors.panel1)
          .find(selectors.tabs)
          .eq(1)
          .should('have.attr', 'data-p-active', 'true')

          // Text panel
          .get(selectors.panel3)
          .find(selectors.tabs)
          .eq(1)
          .should('have.attr', 'data-p-active', 'true')

          // Annotation panel
          .get(selectors.panel4)
          .find(selectors.tabs)
          .eq(1)
          .should('have.attr', 'data-p-active', 'true')
      });
  });
});


describe('Bookmarking - default opening without tido key' , () => {
  it('Should load the first item of first manifest in Ahiqar', () => {
    cy
     .visit('http://localhost:2222/ahiqar-arabic-karshuni-local.html')
     .then(() => {
     cy.wait(200)
     .url()
     .should('include', 'tido=m0_i0');
     });

  })

  it('Should load the first item in gfl', () => {
    cy
     .visit(`http://localhost:2222/gfl-local.html`)
     .then(() => {
      cy.wait(200)
      .url()
      .should('include', 'tido=i0');
      });
  })
});

describe('Bookmarking - change manifest and/or item indices when switching to a new manifest/item', () => {
  it('Should change the manifest and item indices when switching to a new item in a new manifest', () => {
    cy.visit(`http://localhost:2222/ahiqar-arabic-karshuni-local.html?tido=m0_i0`)
    cy
      .wait(1000)
      .get('.panels-target > .item:nth-child(1)')
      .find('.q-tree > .q-tree__node > .q-tree__node-collapsible > .q-tree__children')
      .children()
      .eq(20)
      .click()
      .wait(1000)
      .find('> .q-tree__node-collapsible > .q-tree__children')
      .children()
      .eq(1)
      .click()
      .find('.q-tree__node-header')
      .should('have.class', 'q-tree__node--selected')
      .url()
      .should('contain', 'tido=m20_i1');

  })

  it('Should change the item index when switching to a new item inside GLF manifest', () => {
    cy.visit('http://localhost:2222/gfl-local.html')
    cy
      .wait(1000)
      .get('.panels-target > .item:nth-child(4)')
      .find('.item-content > .panel-body') //.q-tree__node > .q-tree__node-collapsible > .q-tree__children')
      .find('.q-tabs > .q-tabs__content').children().eq(1).click().wait(1000)
      .get('.panels-target > .item:nth-child(4)')
      .find('.q-tree__node-collapsible > .q-tree__children')
      .children()
      .eq(1)
      .click()
      .find('.q-tree__node-header')
      .wait(1000)
      .should('have.class', 'q-tree__node--selected')
      .wait(1000)
      .url()
      .should('contain', 'tido=i1')

  })

});
