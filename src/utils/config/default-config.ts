import { TidoConfig } from '@/types'

const defaultConfig: TidoConfig = {
  allowNewCollections: true,
  container: '#app',
  defaultPanelMode: 'swap',
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
  useCrossRef: true,
  panelModes: ['swap', 'split', 'text', 'image'],
  annotationsMode: 'align'
}

export {
  defaultConfig
}
