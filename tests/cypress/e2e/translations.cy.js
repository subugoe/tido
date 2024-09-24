
import { commonSelectors, ahiqarSelectors, gflSelectors } from '../support/globals';

const selectors = {
    ...commonSelectors,
    ...ahiqarSelectors,
  }

describe('Translations', () => {
    describe('Header Nav buttons text configurable', () => {

        it('should show the nav buttons text in german', () => {
           /// GFL Projekt

          cy.visit('/gfl-local.html?tido=i0')
            .get(selectors.nextButton)
            .contains('Nächste Seite')
      
            .get(selectors.prevButton)
            .contains('Vorheriges Dokument')
          
          cy.visit('/gfl-local.html?tido=i1')
            .get(selectors.nextButton)
            .contains('Nächstes Dokument')
        
            .get(selectors.prevButton)
            .contains('Vorherige Seite')
         })
      })
    
        it('should show the nav buttons text in english', () => {
          cy.visit('/ahiqar-arabic-karshuni-local.html?tido=m0_i0')
             .get(selectors.nextButton)
             .contains('Next Sheet')
            .get(selectors.prevButton)
            .contains('Previous Manuscript')
        })
  })