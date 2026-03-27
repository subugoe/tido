import { TidoConfig } from '@/types'

const defaultConfig: TidoConfig = {
  allowNewCollections: true,
  container: '#app',
  lang: 'en',
  panels: [],
  rootCollections: [],
  showAddNewPanelButton: true,
  showContentTypeToggle: true,
  showGlobalTree: true,
  showPanelPlaceholder: true,
  showThemeToggle: true,
  theme: {
    primaryColor: '#3456aa',
    theme: 'system'
  },
  title: '',
  translations: {},
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
