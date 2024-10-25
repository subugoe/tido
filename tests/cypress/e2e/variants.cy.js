import { commonSelectors, ahiqarSelectors } from '../support/globals';

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
    cy
      .get('div#text-content div#MD12675N1l4l2l6l4l42')
      .children()
      .eq(1)
      .click()
  })

  Cypress.Commands.add('checkTextInWitnessItemDescription', (witness, description) => {
    cy
      .contains('h3', witness)
      .next()
      .contains('p',description).parent()
  })

  Cypress.Commands.add('clickSingleSelectButton', () => {

    cy
      .get('.panels-wrapper .panel:nth-child(4)')
      .find('.panel-header')
      .find('.actions')
      .children().eq(2)
      .find('input[type="checkbox"]')
      .click()
  })

  Cypress.Commands.add('checkNoAnnotationsAvailable', () => {
    cy
      .get('.panels-wrapper .panel:nth-child(4) .panel-body')
      .find('div[id="pv_id_6_2_content"]')
      .children().eq(0)
      .children().eq(1)   // annotation content
      .children().eq(0).should('not.have.class', 'annotations-list')
      .find('span').contains('No Annotations available')
  })

  describe('VariantsAnnotation', () => {

    beforeEach(() => {
      cy
      .visit(`/ahiqar-arabic-karshuni-local.html?tido=m20_i1_p0.0-1.0-2.0-3.2`)
      .get('#text-content')
      .should('be.visible')
      .get(selectors.list)
      .should('be.visible')
    })

    describe('Variants items selection', () => {

      it('Should display third annotation tab', () => {
        cy
            .get(selectors.tab)
            .children()
            .eq(2)
            .parent()
            .should('have.attr', 'data-p-active', 'true')
            .should('contain','Variants')
        });

      it('Should show a list of variant items', () => {
        cy
          .get(selectors.list)
          .should('be.visible')
          .children()
          .should("have.length", 11)
      });

      it('Should switch from an item with no variants to another one with variants and show the list correctly', () => {
        cy
          .visit('/ahiqar-arabic-karshuni-local.html?tido=m20_i0_p0.0-1.0-2.0-3.2')
          .reload()
          .get('.header')                                // go to next item
          .find('button')
          .contains('Next Sheet')
          .click()
        cy.get(selectors.list)
          .children()
          .should('have.length', 11)
      })

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

      it('should show the correct annotations and their (selected) state when switching annotations tabs', () => {
        // select the first two variant items
        cy
          .get(selectors.list)
          .children()
          .eq(0)
          .click()
          .next()
          .click()

          // switch to Editorial tab: check whether the annotations in Editorial tab are shown correctly
          .visit(`/ahiqar-arabic-karshuni-local.html?tido=m20_i1_p0.0-1.0-2.0-3.0`)
          .wait(500)
          .get(selectors.list)
          .children()
          .should('have.length', 6)
          .eq(0).should('not.contain', 'omisit').and('not.have.class','active')
          .should('contain', 'ܢܐܕܢ')  
          
          // switch back to Variants tab: check whether the tab's belonging list of annotations are shown as unselected
          .visit(`/ahiqar-arabic-karshuni-local.html?tido=m20_i1_p0.0-1.0-2.0-3.2`)
          .wait(500)
          .get(selectors.list)
          .children()
          .should('have.length', 11)
          .eq(0).should('contain', 'omisit').and('not.have.class', 'active')
          .next().should('contain', 'اللبان').and('not.have.class', 'active')
      })

      it('should show correct annotations when switching the tabs in Text Panel', () => {
        cy.get(selectors.list)
          .children()
          .eq(0)
          .click()
         
          // click the second tab in Text Panel
         .get(selectors.textPanelTabs)
         .children()
         .eq(1)
         .click()      
         .checkNoAnnotationsAvailable()
         
         // click the first tab in Text Panel
         .get(selectors.textPanelTabs)
         .children()
         .eq(0)
         .click()  
         .get(selectors.list)
         .children()
         .should('have.length', 11)
         .eq(0)
         .should('not.have.class', 'active')
      })

      it('should show(hide) the witnesses filter depending on the existence of annotations for the current opened tab', () => {
        // filteredAnnotations = []

        // switch to the Transliteration tab in Text Panel which has no targets highlighted
        cy.get(selectors.textPanelTabs)
         .children()
         .eq(1)
         .click()

         .get(selectors.panel4)
         .find('div[data-pc-section="panelcontainer"]')
         .find('#pv_id_6_2_content')
         .find('#variants-top-bar')
         .should('have.attr','style', 'display: none;')

         // switch back to Transcription
         cy.get(selectors.textPanelTabs)
         .children()
         .eq(0)
         .click()

         .get(selectors.panel4)
         .find('div[data-pc-section="panelcontainer"]')
         .find('#pv_id_6_2_content')
         .find('#variants-top-bar')
         .should('not.have.attr','style', 'display: none;')
         .should('contain', '4 Witnesses selected')
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

      /*
      Commented out this test, since we hide the witnesses details dialog box
      it('Should show a dialog box containing a list of a witnesses and a description of them', () => {
        // the witnesses are the unique set of the ones which appear in the variants list
        cy
          .get('.panels-wrapper .panel:nth-child(4) .panel-body div#pv_id_6_2_content')
          .find('button')
          .contains('Witnesses Details')
          .click()
          .get('div[role="dialog"]')
          .find('div[data-pc-section="content"]')
          .children()
          .eq(0)
          .children()
          .should('have.length',4)
          .eq(0)
          .checkTextInWitnessItemDescription('Cod. Arab. 236', 'test')
            // witness description will update once description is there
          .checkTextInWitnessItemDescription('DFM 614', 'test')
          .checkTextInWitnessItemDescription('Ming. syr. 258', 'test')
          .checkTextInWitnessItemDescription('Sach. 339', 'test')
      })
      */
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
        .should('not.have.class', 'active')
        .next()
        .should('have.class', 'active')
        .next()
        .should('have.class', 'active')
        .next()
        .should('have.class', 'active')
        .next()
        .should('have.class', 'active')
        .next()
        .should('not.have.class', 'active')
      })

      it('should not select a target for a different annotation tab', () => {
        cy
          .get('#MD12675N1l4l2l6l4l58l2')
          .click()
          .should('have.attr', 'data-annotation-level', '-1')
          .get(selectors.list)
          .children()
          .should('not.have.class', 'active')
      })
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
        .should('not.have.class', 'active')
        .next()
        .should('not.have.class', 'active')
        .next()
        .should('not.have.class', 'active')
        .next()
        .should('not.have.class', 'active')
      })

      it('should consider the witnesses drop down selection when clicking the target', () => {
        // when clicking the target should show correct witnesses chips in text Panel and select the variant items according to witnesses drop down selection 
        cy.get(selectors.list)
          .clickWitnessItem('4 Witnesses selected', 'Cod. Arab. 236')
          .parent().parent()
          .contains('DFM 614').click()

        // we need to unclick the witnesses drop down, to be able to click the target
        cy.get(selectors.panel4)
          .contains('2 Witnesses selected')
          .click({force: true})
        
        // we click at a target
        cy.clickTarget()

        // in the witnesses there should be only 2 chips
        cy.get(selectors.panel3)
          .find('#text-content')
          .find('.witnesses')
          .children()
          .should('have.length', 2)
          .eq(0)
          .should('contain', 'Ming. syr. 258')
          .next()
          .should('contain', 'Sach. 339')

        // should show 'correct number of variants selected'

        cy.get(selectors.panel4)
          .find('#variants-top-bar')
          .find('span')
          .contains('2 Variants selected')

        // only the variant items controled by the witnesses filter and referring to the target should be selected - 3rd and 4th variant item
        cy.get(selectors.list)
        .children()
        .should('have.length', 6)
        .eq(0).should('contain','Ming. syr. 258').and('not.have.class','active')
        .next().should('contain','Sach. 339').and('not.have.class','active')    // eq(1)
        .next().should('contain','Ming. syr. 258').and('have.class','active')    // eq(2)
        .next().should('contain','Sach. 339').and('have.class','active')
        .next().should('contain','Ming. syr. 258').and('not.have.class','active')
        .next().should('contain','Sach. 339').and('not.have.class','active')
      })


    })

    describe('Single select mode', () => {

        it('should hide the variant items when single select mode is on', () => {
          cy.wait(500).then(() => {
            // we wait till the text panel and annotations panel are fully loaded
            cy
            .clickSingleSelectButton().then(() => {
              cy.checkNoAnnotationsAvailable()
            })
          })
        })

        it('should show variant items of the target as selected when clicking the target in single select mode', () => {

          cy.wait(500).then(() => {
            cy
            .clickSingleSelectButton().then(() => {
              cy.clickTarget()
              cy.get('.panels-wrapper .panel:nth-child(4) .panel-body div#pv_id_6_2_content')
                .find('.annotations-list')
                .children().should('have.length', 4)
                .each(($li) => {
                  expect($li).to.have.class('active')
               })
             })
           })
         })

         it('should hide the selected variant items after unclicking the target in single select mode', () => {
          cy.wait(500).then(() => {
            cy.clickSingleSelectButton()
            cy.clickTarget()
            // below we unclick the target
            cy
              .get('div#text-content div#MD12675N1l4l2l6l4l42')
              .children()
              .eq(2)                        // target becomes the third child element, since 'witnesses' span was added in the text
              .click()
            // we expect the selected annotations to be hidden from the tab
            cy.checkNoAnnotationsAvailable()
          })
          })

          it('should show again all the variant item when we switch off the single select mode', () => {
            cy.wait(500).then(() => {
              cy
              .clickSingleSelectButton()     // set the single select mode
              cy
              .clickSingleSelectButton()     // switch off the single select mode
              cy
              .get(selectors.list)
              .should('be.visible')
              .children()
              .should("have.length", 11)      // we have 11 variant items as in the normal mode - no single select mode
            })
          })
      })
  });
