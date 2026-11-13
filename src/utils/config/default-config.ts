import { TidoConfig } from '@/types'

const defaultConfig: TidoConfig = {
  allowNewCollections: true,
  container: '#app',
  lang: 'en',
  panels: [],
  rootCollections: [],
  showAddNewPanelButton: true,
  showCollectionTitle: true,
  showContentTypeToggle: true,
  showGlobalTree: true,
  showPanelPlaceholder: true,
  showShareButton: true,
  showThemeToggle: true,
  showCrossRefLabels: true,
  showSynopsisNavigation: true,
  theme: {
    primaryColor: '#4929ab',
    mode: 'system'
  },
  title: '',
  translations: {},
  tree: {
    showItemLevel: true,
    showRootNode: true
  },
  hideEmptyViews: ['image', 'text'],
  panelViews: [
    {
      label: 'Image',
      view: 'image'
    }, {
      label: 'Text',
      view: 'text'
    }
  ],
  annotations: {
    defaultMode: 'aligned'
  }
}

export {
  defaultConfig
}
