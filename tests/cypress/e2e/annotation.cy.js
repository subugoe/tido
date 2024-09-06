import { commonSelectors } from '../support/globals';

const ahiqarSelectors = {
  list: '.panels-wrapper > .panel:nth-child(4) [role="tablist"] .annotations-list',
  listItem: '.panels-wrapper > .panel:nth-child(4) [role="tablist"] .annotations-list .item',
  listOfSecondTab: '.panels-wrapper > .panel:nth-child(4) [role="tabpanel"]:nth-child(2) .annotations-list',
  tab: '.panels-wrapper > .panel:nth-child(4) [role="tablist"] [data-pc-section="nav"] [data-pc-name="tabpanel"]',
  text: '.panels-wrapper > .panel:nth-child(3) #text-content',
  annotationPanelActionCheckbox: '.panel-header .actions > div:first-child #panel-check-action',
}

const gflSelectors = {
  listItem: '.panels-wrapper > .panel:nth-child(3) [role="tablist"] .annotations-list .item',
}

const selectors = {
  ...commonSelectors,
  ...ahiqarSelectors,
}

describe('Annotation', () => {
  describe('Multiple Tabs', () => {
    beforeEach(() => {
      cy
        .visit(`/ahiqar-arabic-karshuni-local.html?tido=m7_i0_p0.0-1.0-2.0-3.0`)
        .get('#text-content')
        .should('be.visible')
        .get(selectors.list)
        .should('be.visible')
        .get(selectors.listItem)
        .should('be.visible');
    });

    it('Should display first annotation tab', () => {
      cy
        .get(selectors.tab)
        .first()
        .should('have.attr', 'data-p-active', 'true');

      cy
        .get(selectors.listItem)
        .first()
        .contains('حيقار');
    });

    it('Should switch to second annotation tab', () => {
      cy
        .get(selectors.list)
        .should('be.visible')
        .get(selectors.tab)
        .eq(1)
        .click()
        .wait(400) // wait for tab switch transition
        .should('have.attr', 'data-p-active', 'true')
        .get(selectors.listItem)
        .eq(0)
        .contains('Successful courtier');
    });

    it('Should stay on first tab when switch item', () => {
      cy
        .get(selectors.nextButton)
        .click()
        .get(selectors.text)
        .contains('ذلك')
        .get(selectors.list)
        .should('be.visible')
        .get(selectors.tab)
        .first()
        .should('have.attr', 'data-p-active', 'true')
    .get(selectors.listItem)
        .first()
        .contains('نادان');
    });

    it('Should stay on second tab when switch item', () => {
      cy
        .get(selectors.tab)
        .eq(1)
        .click()
        .wait(400) // wait for tab switch transition
        .get(selectors.list)
        .should('be.visible')
        .get(selectors.nextButton)
        .click()
        .get(selectors.listItem)
        .first()
        .contains('Successful courtier');
    });

    it('Should switch to first tab when switch manifest', () => {
      cy
        .get(selectors.tab)
        .eq(1)
        .click()
        .get(selectors.listOfSecondTab)
        .should('be.visible')
        .get(selectors.prevButton)
        .click()
        .get(selectors.text)
        .contains('وورمت')
        .get(selectors.tab)
        .first()
        .should('have.attr', 'data-p-active', 'true');
    });

    it('Should select all from panel action', () => {
      cy
        .get(selectors.panel4)
        .find(selectors.annotationPanelActionCheckbox)
        .click()
        .get(selectors.listItem)
        .should('have.class', 'active')
        .get(selectors.panel4)
        .find(selectors.annotationPanelActionCheckbox)
        .parent()
        .should('have.attr', 'aria-checked', 'true')
        .get(selectors.panel3)
        .find('#text-content [data-annotation-ids][data-annotation-level="1"]')
        .should('have.length', 16);
    });

    it('Should unselect all from panel action', () => {
      cy
        .get(selectors.panel4)
        .find(selectors.annotationPanelActionCheckbox)
        .click()
        .get(selectors.listItem)
        .should('have.class', 'active')
        .get(selectors.panel4)
        .find(selectors.annotationPanelActionCheckbox)
        .parent()
        .should('have.attr', 'aria-checked', 'true')
        .click()
        .get(selectors.listItem)
        .should('not.have.class', 'active')
        .get(selectors.panel4)
        .find(selectors.annotationPanelActionCheckbox)
        .parent()
        .should('have.attr', 'aria-checked', 'false')
        .get(selectors.panel3)
        .find('#text-content [data-annotation-ids][data-annotation-level="1"]')
        .should('have.length', 0);
    });

    it('Should select one annotation', () => {
      cy
        .get(selectors.listItem)
        .first()
        .click()
        .should('have.class', 'active')
        .get(selectors.panel4)
        .find(selectors.annotationPanelActionCheckbox)
        .parent()
        .should('have.attr', 'aria-checked', 'mixed')
        .get(selectors.panel3)
        .find('#text-content [data-annotation-ids][data-annotation-level="1"]')
        .should('have.length', 1);
    });

    it('Should unselect one annotation', () => {
      cy
        .get(selectors.listItem)
        .first()
        .click()
        .should('have.class', 'active')
        .get(selectors.panel4)
        .find(selectors.annotationPanelActionCheckbox)
        .parent()
        .should('have.attr', 'aria-checked', 'mixed')
        .get(selectors.listItem)
        .first()
        .click()
        .get(selectors.panel4)
        .find(selectors.annotationPanelActionCheckbox)
        .parent()
        .should('have.attr', 'aria-checked', 'false')
        .get(selectors.panel3)
        .find('#text-content [data-annotation-ids][data-annotation-level="1"]')
        .should('have.length', 0);
    });

    it('Should scroll in text to highlighted annotation', { scrollBehavior: false }, () => {

      // We scroll down the text panel first and select the first annotation
      // because there is a problem with initial scrolling of text panel.
      // Somehow it works when scroll programmatically like described above.
      cy
        .get('.panels-wrapper > .panel:nth-child(3) .content-view')
        .scrollTo('bottom')
        .get(selectors.listItem)
        .first()
        .click().then(($annot) => {
          const delimiter = 'annotation-';
          const dataAnnotationId = $annot.attr('data-annotation-id');
          const annotTranscriptId = '#'.concat(dataAnnotationId.split(delimiter)[1]);
          cy.log('Annot transcript ID', annotTranscriptId);
          cy.get(annotTranscriptId)
          .invoke('attr', 'data-annotation-level').should('equal', '1');
        });
    });
  });

  describe('Text Annotation', () => {
    beforeEach(() => {
      cy.visit(`/gfl-local.html?tido=i0`)
      cy
        .get(selectors.panel2)
        .should('be.visible')
        .contains('Edierter Text')
        .click();

      cy
        .get(selectors.panel3)
        .should('be.visible')
        .get(gflSelectors.listItem)
        .first()
        .as('annotationItem')
        .should('be.visible');
    });

    it('should not be selectable when clicked', () => {
      cy
        .get('@annotationItem')
        .should('have.length', 1) // retry until we have only one subject
        .click()
        .should('not.have.class', 'active');
    });

    it('should not have an icon', () => {
      cy
        .get('@annotationItem')
        .should('have.length', 1) // retry until we have only one subject
        .within(() => {
          cy
            .get('i')
            .should('not.exist');
        });
    });
  });
});
