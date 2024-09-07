import { commonSelectors, ahiqarSelectors, gflSelectors } from '../support/globals';

const selectors = {
    ...commonSelectors,
    ...ahiqarSelectors,
  }

describe('VariantsAnnotation', () => {
    describe('VariantsList', () => {

        beforeEach(() => {
            cy
            .visit(`/ahiqar-arabic-karshuni-with-variants-local.html?tido=m20_i1_p0.0-1.0-2.0-3.2`)
        })

        it('Should display third annotation tab', () => {
            cy  
                .get(selectors.tab)
                .children()
                .eq(2)
                .parent()
                .should('have.attr', 'data-p-active', 'true');
        
            });
    
        it('Should show a list of variant items', () => {
          cy 
            .get(selectors.list)
            .should('be.visible')
            .children()
            .should("have.length", 11)
        });

        it('Show select all variant items', () => {
          cy
            .get('.panels-wrapper')
            .children()
            .eq(3)
            .find('.panel-header')
            .find('.actions')
            .children()
            .eq(2)
            .find('#panel-check-action')
            .click() // text should be 11 
            .wait(3000)
            .get('span').contains('11 Variants selected')
            /*
            .get(selectors.list)
            .should('be.visible')
            .get(selectors.list)
            .children().each(($li, index, $lis) => {
              cy.log('annotation index', index)
              if (index === 0) cy.log('html element', $lis[index])
              const isActive = $lis[index].classList.contains('active')
              //expect(isActive).to.equal(true);
            })
            */
        })


      });

    
    describe('Witnesses', () => {

    })

    describe('Single select mode', () => {
        
    })
  });
