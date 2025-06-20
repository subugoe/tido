import { TidoConfig } from '@/types'

const defaultConfig: TidoConfig = {
  allowNewCollections: true,
  container: '#app',
  defaultView: 'swap',
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
  views: ['swap', 'split', 'text', 'image']
}

export {
  defaultConfig
}
