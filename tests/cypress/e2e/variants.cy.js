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
      });

    
    describe('Witnesses', () => {

    })

    describe('Single select mode', () => {
        
    })
  });
