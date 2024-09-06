import selectors from './annotation.cy'


describe('VariantsAnnotation', () => {
    describe('VariantsList', () => {
      beforeEach(() => {
        cy
          .visit(`/ahiqar-arabic-karshuni-with-variants-local.html?tido=m20_i1_p0.0-1.0-2.0-3.2`)
          .get('#text-content')
          .should('be.visible')
          .get(selectors.list)
          .should('be.visible')
          .get(selectors.listItem)
          .should('be.visible');
      });

      it('Should display third annotation tab', () => {
        cy
          .get(selectors.tab)
          .eq(2)
          .should('have.attr', 'data-p-active', 'true');
  
      });
  
      it('Should show a list of variant items', () => {
        
      });
  
      
    });

    describe('Witnesses', () => {

    })

    describe('Single select mode', () => {
        
    })
  });