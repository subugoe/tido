describe('Metadata', () => {
  beforeEach(() => {
    cy.visit('/examples/ahiqar-arabic-karshuni-local.html')
      .get('#text-content')
      .should('be.visible')
      .get('.root.panels-target > .item:nth-child(1) .q-tabs__content .q-tab')
      .eq(1)
      .click()
      .get('.metadata-container')
      .should('be.visible');
  });

  it('Should display collection info', () => {
    cy
      .get('.metadata-container')
      .find('.q-list:first-child .q-item:nth-child(1)')
      .contains('Collection');
    cy
      .get('.metadata-container')
      .find('.q-list:first-child .q-item:nth-child(2)')
      .should('contain', 'Title')
      .and('contain', 'Textual witnesses in Arabic and Karshuni');

    cy
      .get('.metadata-container')
      .find('.q-list:first-child .q-item:nth-child(3)')
      .should('contain', 'Description')
      .and('contain', 'Arabic/Karshuni collection for the Ahiqar project. Funded by DFG, 2018–2021, University of Göttingen');
  });

  it('Should display manifest info', () => {
    cy
      .get('.metadata-container')
      .find('.q-list:nth-child(2) .q-item:nth-child(1)')
      .contains('Manuscript 1 / 24');
    cy
      .get('.metadata-container')
      .find('.q-list:nth-child(2) .q-item:nth-child(2)')
      .should('contain', 'Label')
      .and('contain', 'Cod. Arab. 236 Copenhagen');

    cy
      .get('.metadata-container')
      .find('.q-list:nth-child(2) .q-item:nth-child(3)')
      .contains('License');

    cy
      .get('.metadata-container')
      .find('.q-list:nth-child(2) .q-item:nth-child(3)')
      .find('a[href="https://creativecommons.org/licenses/by-sa/4.0/legalcode"]')
      .contains('CC-BY-SA-4.0');

    cy
      .get('.metadata-container')
      .find('.q-list:nth-child(2) .q-item:nth-child(4)')
      .should('contain', 'Editor')
      .and('contain', 'Dr. Aly Elrefaei');

    cy
      .get('.metadata-container')
      .find('.q-list:nth-child(2) .q-item:nth-child(5)')
      .should('contain', 'Date of creation')
      .and('contain', '1670');

    cy
      .get('.metadata-container')
      .find('.q-list:nth-child(2) .q-item:nth-child(6)')
      .should('contain', 'Place of origin')
      .and('contain', 'Aleppo, Syria');

    cy
      .get('.metadata-container')
      .find('.q-list:nth-child(2) .q-item:nth-child(7)')
      .should('contain', 'Current location')
      .and('contain', 'Royal Danish Library, Denemark');

    cy
      .get('.metadata-container')
      .find('.q-list:nth-child(2) .q-item:nth-child(8)')
      .contains('TEI document');

    cy
      .get('.metadata-container')
      .find('.q-list:nth-child(2) .q-item:nth-child(8)')
      .find('a[href="https://ahiqar.uni-goettingen.de/rest/textgrid/data/3r1bv.xml"]')
      .contains('via REST');
  });

  it('Should display item info', () => {
    cy
      .get('.metadata-container')
      .find('.q-list:nth-child(3) .q-item:nth-child(1)')
      .contains('Sheet 1 / 81');

    cy
      .get('.metadata-container')
      .find('.q-list:nth-child(3) .q-item:nth-child(2)')
      .should('contain', 'Label')
      .and('contain', '2a');

    cy
      .get('.metadata-container')
      .find('.q-list:nth-child(3) .q-item:nth-child(3)')
      .should('contain', 'Language')
      .and('contain', 'ara,eng');

    cy
      .get('.metadata-container')
      .find('.q-list:nth-child(3) .q-item:nth-child(4)')
      .should('contain', 'Image License')
      .and('contain', 'Copyright');

    cy
      .get('.metadata-container')
      .find('.q-list:nth-child(3) .q-item:nth-child(5)')
      .should('contain', 'Image Notes')
      .and('contain', 'Copyright Royal Danish Library. No reuse allowed.');
  });
});
