
import { commonSelectors, ahiqarSelectors, gflSelectors } from '../support/globals';

const selectors = {
    ...commonSelectors,
    ...ahiqarSelectors,
  }

describe('Translations', () => {
    describe('Header Nav buttons text configurable', () => {

        it('should show the nav buttons text in german', () => {
          // most of the tests are written with arabic karshuni in english
          // to test whether the nav buttons are configurable I use a copy of arabic karshuni which is a new file but in german
          cy.visit('/ahiqar-arabic-karshuni-local-de.html?tido=m0_i0')
            .get(selectors.nextButton)
            .contains('Nächste Seite')
      
            .get(selectors.prevButton)
            .contains('Vorherige Manuskript')
            
          cy.visit('/ahiqar-arabic-karshuni-local-de.html?tido=m0_i1')
            .get(selectors.nextButton)
            .contains('Nächste Seite')
        
            .get(selectors.prevButton)
            .contains('Vorherige Seite')

          cy.visit('/ahiqar-arabic-karshuni-local-de.html?tido=tido=m0_i80')
            .get(selectors.nextButton)
            .contains('Nächste Manuskript')
        
            .get(selectors.prevButton)
            .contains('Vorherige Seite')
        })
      
        it('should show the nav buttons text in english', () => {
          cy.visit('/ahiqar-arabic-karshuni-local.html?tido=m0_i0')
             .get(selectors.nextButton)
             .contains('Next Item')
            .get(selectors.prevButton)
            .contains('Previous Manuscript')
        })
      })
})