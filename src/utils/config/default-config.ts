import { TidoConfig } from '@/types'

const defaultConfig: TidoConfig = {
  allowNewCollections: true,
  container: '#app',
  lang: 'en',
  panels: [],
  rootCollections: [],
  showAddNewPanelButton: true,
  showGlobalTree: true,
  showPanelPlaceholder: true,
  showThemeToggle: true,
  theme: {
    primaryColor: '#3456aa'
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
  defaultAnnotationsMode: 'aligned',
  annotations: {}
}

export {
  defaultConfig
}
