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

    describe('Variants items selection', () => {
      it('select (unselect) a variant item', () => {
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

          // --- select sequentially another variant item ---
          .get(selectors.list)
          .children()
          .eq(1)
          .click()
          .should('have.class', 'active') // the variant item is selected 
          .get('div#MD12675N1l4l2l6l4l40')
          .find('span.witnesses')
          .find('span').contains('Ming. syr. 258') // the witness is added
          .parent()
          .children().should('have.length',2)
          .parent()
          .next()
          .invoke('attr', 'data-annotation-level')
          .should('eq', '1')    // highlighted text should stay light blue

          // ---- unselect the first variant item -----
          .get(selectors.list)
          .children()
          .eq(0)
          .click()
          .should('not.have.class', 'active')
          .get('div#MD12675N1l4l2l6l4l40')
          .find('span.witnesses')
          .children()
          .should('have.length', 1) .contains('Ming. syr. 258') // remove 'DFM-614' witness
          .parent()
          .next()
          .invoke('attr', 'data-annotation-level')
          .should('eq', '1')    // highlighted text should stay light blue (we still have one witness)
         
          // --- unselect the second variant item
          .get(selectors.list)
          .children()
          .eq(1)
          .click()
          .get('div#MD12675N1l4l2l6l4l40')
          .find('span.witnesses')
          .should('be.empty')   // remove the last remaining witness
          .next()
          .invoke('attr', 'data-annotation-level')
          .should('eq', '0')   // highlighted text becomes grey

      })
    })
  });