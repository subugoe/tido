import { commonSelectors, ahiqarSelectors, gflSelectors } from '../support/globals';

const selectors = {
    ...commonSelectors,
    ...ahiqarSelectors,
  }

describe('VariantsAnnotation', () => {

    beforeEach(() => {
      cy
      .visit(`/ahiqar-arabic-karshuni-with-variants-local.html?tido=m20_i1_p0.0-1.0-2.0-3.2`)
    })

    describe('VariantsList', () => {

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
    
    describe('Variants items selection', () => {
      it('select a variant item', () => {
        // should select a variant item and add its witness after the highlighted text + the highlighted text should become light blue
        cy
          .get(selectors.list)
          .children()
          .eq(0)
          .click()
          .should('have.class', 'active') // the variant item is selected 
          .get('div#MD12675N1l4l2l6l4l40')
          .find('span.witnesses')
          .find('span').contains('DFM 614') // the witness is added
          .parent()
          .next()
          .invoke('attr', 'data-annotation-level')
          .should('eq', '1')    // highlighted text should become light blue 
      })
    })


      describe('Witnesses', () => {
        it('Should show the correct number of initially selected witnesses in drop down', () => {
          cy 
            .get('.panels-wrapper')
            .children()
            .eq(3)
            .find('div#pv_id_6_2_content')
            .find('.t-relative')
            .find('button').contains('4 Witnesses selected')
        });
      })
    

    describe('Single select mode', () => {
        
    })
  });
