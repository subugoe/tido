import { ahiqarApiBaseUrl } from '../support/globals';

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
    })  //. .should('not.include', 's');
    //cy.url().should('not.include', 'p');
  });

  it('Should bookmark tree/metadata panel', () => {
    cy.get('.panels-target > .item:nth-child(1) .q-tabs__content .q-tab')
      .eq(1)
      .click();
    cy.url().then((value) => decodeURIComponent(value)).should('include', 'p0.1-1.0-2.0-3.0');
  });

  it('Should change text panel value in query', () => {
    cy
      .get('.panels-target > .item:nth-child(3) .q-tabs__content .q-tab')
      .eq(1)
      .click()
      .should('have.class', 'q-tab--active')
      .get('#text-content')
      .should('be.visible')
      .url()
      .then((value) => decodeURIComponent(value)) 
      .should('include', 'p0.0-1.0-2.1-3.0');
  });

  it('Should change annotation panel value in query', () => {
    cy
      .get('.panels-target > .item:nth-child(4) .q-tabs__content .q-tab')
      .eq(1)
      .click()
      .get('.panels-target > .item:nth-child(4) .q-panel:nth-child(2)')
      .should('be.visible')
      .url()
      .then((value) => decodeURIComponent(value)) 
      .should('include', 'p0.0-1.0-2.0-3.1');
  });

  it('Should change panel value in query', () => {
    cy.get('.panels-toggle .row div:first-child .q-checkbox').click().wait(400)
      .url()
      .then((value) => decodeURIComponent(value))
      .should('include', 's1-2-3');
    cy.get('.panels-toggle .row div:nth-child(4) .q-checkbox').click().wait(400)
      .url()
      .then((value) => decodeURIComponent(value))  
      .should('include', 's1-2');
  });

  it('Should change panel value in query after reset', () => {
    cy.get('.panels-toggle .row div:first-child .q-checkbox').click().wait(400)
      .url()
      .then((value) => decodeURIComponent(value))
      .should('include', 's1-2-3');
    cy.get('.panels-toggle .row div:nth-child(4) .q-checkbox').click().wait(400)
      .url()
      .then((value) => decodeURIComponent(value))
      .should('include', 's1-2');

    // Reset
    cy.get('.panels-toggle .row div:first-child .q-checkbox').click();
    cy.get('.panels-toggle .row div:nth-child(4) .q-checkbox').click();
    cy.log('Url', cy.url())
    cy.wait(400).url().then((url) => {
      const splitUrl = url.split('tido')[1];
      expect(splitUrl).to.not.include('s')
    })  //. .should('not.include', 's');
  });

  it('Should bookmark first tab active when manifest changed', () => {
    cy
      .get('.panels-target > .item:nth-child(4) .q-list')
      .should('be.visible')
      .get('.panels-target > .item:nth-child(4) .q-tabs__content .q-tab')
      .eq(1)
      .click()
      .wait(400)// wait for tab switch transition
      .should('have.class', 'q-tab--active');

    cy.wait(5000).get(
      '.q-tree--standard.item-content > .q-tree__node > .q-tree__node-collapsible > .q-tree__children > .q-tree__node:nth-child(1) > .q-tree__node-header',
      { timeout: 10000 }
    ).click();

    cy.get(
      '.panels-target .q-tree--standard.item-content > .q-tree__node > .q-tree__node-collapsible > .q-tree__children > .q-tree__node:nth-child(2) > .q-tree__node-header',
    ).click();

    cy.get(
      '.panels-target .q-tree--standard.item-content > .q-tree__node > .q-tree__node-collapsible > .q-tree__children > .q-tree__node:nth-child(2) > .q-tree__node-collapsible > .q-tree__children .q-tree__node:first-child .q-tree__node-header',
    ).click();

    cy.url().then((value) => decodeURIComponent(value)).should('not.include', '3.1');
  });
});

describe('Bookmarking - URL first', () => {
  it('Should load tabs from URL', () => {
    cy
      //.visit(`/ahiqar-arabic-karshuni-local.html?item=${ahiqarApiBaseUrl}/textapi/ahiqar/arabic-karshuni/3r176/182b/latest/item.json&panels=0_1,1_0,2_1,3_1`)
      .visit(`http://localhost:2222/ahiqar-arabic-karshuni-local.html?tido=m20_i0_p0.1-1.0-2.1-3.1_s0-1-2-3`)
      .then(() => {
        cy
          // Tree & Metadata panel
          .get('.panels-target > .item:nth-child(1) .q-tabs__content .q-tab')
          .eq(1)
          .should('have.class', 'q-tab--active')

          // Text panel
          .get('.panels-target > .item:nth-child(3) .q-tabs__content .q-tab')
          .eq(1)
          .should('have.class', 'q-tab--active')

          // Annotation panel
          .get('.panels-target > .item:nth-child(4) .q-tabs__content .q-tab')
          .eq(1)
          .should('have.class', 'q-tab--active');
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
