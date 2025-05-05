import { TidoConfig } from '@/types'

const defaultConfig: TidoConfig = {
  allowNewCollections: true,
  container: '#app',
  defaultView: 'pip',
  lang: 'en',
  panels: [],
  rootCollections: [],
  showGlobalTree: true,
  showAddNewPanelButton: true,
  theme: {
    primaryColor: '#3456aa'
  },
  title: '',
  translations: {}
}

export {
  defaultConfig
}
