import { commonSelectors, ahiqarSelectors, gflSelectors } from '../support/globals';

const selectors = {
    ...commonSelectors,
    ...ahiqarSelectors,
  }

  Cypress.Commands.add('clickWitnessItem', (buttonName, witnessName) => {
    // click witness of the drop down having button named 'buttonName'
    cy.get('.panels-wrapper .panel:nth-child(4) .panel-body div#pv_id_6_2_content')
      .find('button').contains(buttonName)
      .click()
      .next()
      .children()
      .find('label').contains(witnessName)
      .prev()
      .click()
  })

  Cypress.Commands.add('clickTarget', () => {
    // click witness of the drop down having button named 'buttonName'
    cy
      .get('div#text-content div#MD12675N1l4l2l6l4l42')
      .children()
      .eq(1)
      .click()
  })

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
      it('Deselects a first witness from the dropdown', () => {
        cy
        // click at one target - useful to see how this target's witnesses list change when we unclick at one witness in drop down 
        .wait(500)
        .get('div#text-content div#MD12675N1l4l2l6l4l42')
        .children()
        .eq(1)
        .click()
        
        // click at the witness 'Cod. Arab. 236' of the drop down 
        .clickWitnessItem('4 Witnesses selected', 'Cod. Arab. 236')

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
        .should('eq', 'http://ahikar.uni-goettingen.de/ns/annotations/3r14z/annotation-variants-t_Brit_Mus_Add_7209_N1l5l3l5l5l29l4_w_2_1')  // means that first annotation item of this target is DFM 614, instead of Cod Arab
        .get(selectors.list)
        .children()
        .eq(6)         // expecting that two variant items with Cod Arab 236 were removed, the first variant item of the third target is now 'DFM 614'
        .invoke('attr', 'data-annotation-id')
        .should('eq', 'http://ahikar.uni-goettingen.de/ns/annotations/3r14z/annotation-variants-t_Brit_Mus_Add_7209_N1l5l3l5l5l29l4_w_3_1')
      })

      it('Reselect the first witness from the dropdown', () => {
        cy
          // unselect and then reselect the witness
          .clickWitnessItem('4 Witnesses selected', 'Cod. Arab. 236')    // unselect the witness 'Cod. Arab. 236' of the drop down
          .click()  // reselect the witness
          .wait(1000)

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

    describe('Highlighted Text selection', () => {
      it('should click at a highlighted text, show its witnesses and select all related variant items in variants tab', () => {
        cy
        // click at one target
        .clickTarget()

        // its witnesses should be shown
        .get('div#text-content div#MD12675N1l4l2l6l4l42')
        .find('span.witnesses')
        .children()
        .should('have.length', 4)
        .should('contain', 'Cod. Arab. 236')
        .should('contain', 'DFM 614')
        .should('contain', 'Ming. syr. 258')
        .should('contain', 'Sach. 339')

        // the corresponding variant items should be selected
        .get(selectors.list)
        .children()
        .eq(2)
        .should('not.have.class', 't-bg-gray-300')
        .next()
        .should('have.class', 't-bg-gray-300')
        .next()
        .should('have.class', 't-bg-gray-300')
        .next()
        .should('have.class', 't-bg-gray-300')
        .next()
        .should('have.class', 't-bg-gray-300')
        .next()
        .should('not.have.class', 't-bg-gray-300')
      })

      // 
      it('should deselect the highlighted text, remove its witnesses and deselect all related variant items in variants tab', () => {
        // unclick at one target
      cy
        .clickTarget() // select the target
        .click()  // deselect the target

        // remove its witnesses
         .get('div#text-content div#MD12675N1l4l2l6l4l42')
         .find('span.witnesses')
         .should('be.empty')

        // deselect the corresponding variant items
        .get(selectors.list)
        .children()
        .eq(3)
        .should('not.have.class', 't-bg-gray-300')
        .next()
        .should('not.have.class', 't-bg-gray-300')
        .next()
        .should('not.have.class', 't-bg-gray-300')
        .next()
        .should('not.have.class', 't-bg-gray-300')
      })
    })

  });