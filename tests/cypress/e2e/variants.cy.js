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

    describe('Witnesses', () => {
      it('Deselecting the witness remove the variant items of that witness and the witnesses in the transcription', () => {
        cy
        // click at one target - useful to see how this target's witnesses list change when we unclick at one witness in drop down 
        .wait(500)
        .get('div#text-content div#MD12675N1l4l2l6l4l42')
        .children()
        .eq(1)
        .click()
        

        // click at the witness 'Cod. Arab. 236' of the drop down 
        .get('.panels-wrapper .panel:nth-child(4) .panel-body div#pv_id_6_2_content')
        .find('button').contains('4 Witnesses selected')
        .click()
        .next()
        .children()
        .find('label').contains('Cod. Arab. 236')
        .prev()
        .click()
        .wait(500)

        // after this part we check the effects of this click

        // 1. remove the witness from the witnesses list of the target+
        .get('div#text-content div#MD12675N1l4l2l6l4l42')
        .find('span.witnesses')
        .children()
        .should('have.length', 3)
        .should('not.contain', 'Cod. Arab. 236')


        // 2. remove the variant items of this witness from the variants list

        .get(selectors.list)
        .children()
        .eq(3)
        .invoke('attr', 'data-annotation-id')
        .should('eq', 'http://ahikar.uni-goettingen.de/ns/annotations/3r14z/annotation-variants-t_Brit_Mus_Add_7209_N1l5l3l5l5l29l4_w_2_1')  // means that first annotation item of this group is DFM 614, instead of Cod Arab
        .get(selectors.list)
        .children()
        .eq(6)         // expecting that two variant items with Cod Arab 236 were removed, then we aim to access the variant item with witness DFM 614 of the third target with index 6 instead of 8
        .invoke('attr', 'data-annotation-id')
        .should('eq', 'http://ahikar.uni-goettingen.de/ns/annotations/3r14z/annotation-variants-t_Brit_Mus_Add_7209_N1l5l3l5l5l29l4_w_3_1')

        // we make active again the witness 'Cod. Arab. 236' in the drop down
        // click at the witness 'Cod. Arab. 236' of the drop down 
        .get('.panels-wrapper .panel:nth-child(4) .panel-body div#pv_id_6_2_content')
        .find('button').contains('3 Witnesses selected')
        .next()
        .children()
        .find('label').contains('Cod. Arab. 236')
        .prev()
        .click()
        .wait(500)

        // effect: add the variant items of this witness in the variants list

        .get(selectors.list)
        .children()
        .eq(3)
        .invoke('attr', 'data-annotation-id')
        .should('eq', 'http://ahikar.uni-goettingen.de/ns/annotations/3r14z/annotation-variants-t_Brit_Mus_Add_7209_N1l5l3l5l5l29l4_w_2_0')  // means that first annotation item of this group is DFM 614, instead of Cod Arab
        .get(selectors.list)
        .children()
        .eq(7)         // expecting that two variant items with Cod Arab 236 were removed, then we aim to access the variant item with witness DFM 614 of the third target with index 6 instead of 8
        .invoke('attr', 'data-annotation-id')
        .should('eq', 'http://ahikar.uni-goettingen.de/ns/annotations/3r14z/annotation-variants-t_Brit_Mus_Add_7209_N1l5l3l5l5l29l4_w_3_0')
      })
    })
  });