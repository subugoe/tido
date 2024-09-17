import { commonSelectors } from "../support/globals";

const selectors = {
  ...commonSelectors,
  sectionTitle: 'h3',
  title: 'h4',
  collection: '.collection-metadata',
  manifest: '.manifest-metadata',
  item: '.item-metadata'
}

describe('Metadata', () => {
  beforeEach(() => {
    cy.visit('/ahiqar-arabic-karshuni-local.html')
      .get('#text-content')
      .should('be.visible')
      .get(selectors.panel1)
      .find(selectors.tabs)
      .eq(1)
      .click()
      .get(selectors.metadataView)
      .should('be.visible');
  });

  it('Should display collection info', () => {
    cy
      .get(selectors.metadataView)
      .find(selectors.collection)
      .find(selectors.sectionTitle)
      .first()
      .contains('Collection');
    cy
      .get(selectors.metadataView)
      .find(selectors.collection)
      .find(selectors.title)
      .first()
      .should('contain', 'Title')
      .next()
      .should('contain', 'Textual witnesses in Arabic and Karshuni');

    cy
      .get(selectors.metadataView)
      .find(selectors.collection)
      .children()
      .eq(2)
      .find('h4', 'Collector')
      .next()
      .should('contain', 'Prof. Dr. theol. Kratz, Reinhard Gregor,Dr. Elrefai, Aly')

    cy
      .get(selectors.metadataView)
      .find(selectors.collection)
      .find(selectors.title)
      .eq(2)
      .should('contain', 'Description')
      .next()
      .should('contain', 'Arabic/Karshuni collection for the Ahiqar project. Funded by DFG, 2018–2021, University of Göttingen');
  });

  it('Should display manifest info', () => {
    cy
      .get(selectors.metadataView)
      .find(selectors.manifest)
      .find(selectors.sectionTitle)
      .contains('Manuscript 1 / 30');
    cy
      .get(selectors.metadataView)
      .find(selectors.manifest)
      .find(selectors.title)
      .eq(0)
      .should('contain', 'Label')
      .next()
      .and('contain', 'Cod. Arab. 236 Copenhagen');

    cy
      .get(selectors.metadataView)
      .find(selectors.manifest)
      .find(selectors.title)
      .eq(1)
      .contains('License')
      .next()
      .contains('CC-BY-SA-4.0');

    cy
      .get(selectors.metadataView)
      .find(selectors.manifest)
      .find(selectors.title)
      .eq(2)
      .should('contain', 'Date of creation')
      .next()
      .should('contain', '1670');

    cy
      .get(selectors.metadataView)
      .find(selectors.manifest)
      .find(selectors.title)
      .eq(3)
      .should('contain', 'Place of origin')
      .next()
      .and('contain', 'Aleppo, Syria');

    cy
      .get(selectors.metadataView)
      .find(selectors.manifest)
      .find(selectors.title)
      .eq(4)
      .should('contain', 'Current location')
      .next()
      .should('contain', 'Royal Danish Library, Denemark');

    cy
      .get(selectors.metadataView)
      .find(selectors.manifest)
      .find(selectors.title)
      .eq(5)
      .should('contain', 'TEI document')
      .next()
      .should('contain', 'via REST');

    cy
      .get(selectors.metadataView)
      .find(selectors.manifest)
      .find(selectors.title)
      .eq(6)
      .should('contain', 'Editor')
      .next()
      .should('contain', 'Dr. Aly Elrefaei');
  });

  it('Should display item info', () => {
    cy
      .get(selectors.metadataView)
      .find(selectors.item)
      .find(selectors.sectionTitle)
      .contains('Sheet 1 / 81');

    cy
      .get(selectors.metadataView)
      .find(selectors.item)
      .find(selectors.title)
      .eq(0)
      .should('contain', 'Label')
      .next()
      .should('contain', '2a');

    cy
      .get(selectors.metadataView)
      .find(selectors.item)
      .find(selectors.title)
      .eq(1)
      .should('contain', 'Language')
      .next()
      .should('contain', 'ara,eng');

    cy
      .get(selectors.metadataView)
      .find(selectors.item)
      .find(selectors.title)
      .eq(2)
      .should('contain', 'Image License')
      .next()
      .should('contain', 'Copyright');

    cy
      .get(selectors.metadataView)
      .find(selectors.item)
      .find(selectors.title)
      .eq(3)
      .should('contain', 'Image Notes')
      .next()
      .should('contain', 'Copyright Royal Danish Library. No reuse allowed.');
  });
});
