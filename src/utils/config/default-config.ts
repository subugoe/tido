import { TidoConfig } from '@/types'

const defaultConfig: TidoConfig = {
  allowNewCollections: true,
  container: '#app',
  defaultView: 'pip',
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
  translations: {}
}

export {
  defaultConfig
}
