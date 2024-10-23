export default {
  commonSelectors: {
    nextButton: '.next-button',
    prevButton: '.prev-button',
    panelsWrapper: '.panels-wrapper',
    panel1: '.panels-wrapper > .panel:nth-child(1)',
    panel2: '.panels-wrapper > .panel:nth-child(2)',
    panel3: '.panels-wrapper > .panel:nth-child(3)',
    panel4: '.panels-wrapper > .panel:nth-child(4)',
    tabs: '[role="tablist"] [data-pc-section="nav"] [data-pc-name="tabpanel"]',
    panelsToggleCheckboxes: '.panels-toggle [type="checkbox"]',
    annotationsList: '.annotations-list',
    tree: '[role="tree"]',
    treeNodesContainer: '[role="group"]',
    treeNodes: '[role="treeitem"]',
    metadataView: '.metadata-view'
  },
  ahiqarApiBaseUrl: 'http://localhost:8181/ahiqar',
  gflApiBaseUrl: 'http://localhost:8181/gfl',
  ahiqarSelectors: {
    list: '.panels-wrapper > .panel:nth-child(4) div[role="tablist"] .annotations-list',
    listItem: '.panels-wrapper > .panel:nth-child(4) [role="tablist"] .annotations-list .item',
    listOfSecondTab: '.panels-wrapper > .panel:nth-child(4) [role="tabpanel"]:nth-child(2) .annotations-list',
    tab: '.panels-wrapper > .panel:nth-child(4) [role="tablist"] [data-pc-section="nav"] [data-pc-name="tabpanel"]',
    textPanelTabs: '.panels-wrapper .panel:nth-child(3) .panel-body ul[data-pc-section="nav"]',
    text: '.panels-wrapper > .panel:nth-child(3) #text-content',
    annotationPanelActionCheckbox: '.panel-header .actions > div:first-child #panel-check-action',
  },
  gflSelectors: {
    listItem: '.panels-wrapper > .panel:nth-child(3) [role="tablist"] .annotations-list .item',
  }
};
