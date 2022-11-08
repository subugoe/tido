export default function ConfigState() {
  return {
    config: {
      collection: '',
      manifest: '',
      item: '',
      panels: [

      ],
      colors: {
        primary: '',
        secondary: '',
        accent: '',
      },
      annotations: {

      },
      header: {
        show: true,
        navigation: true,
        panelsToggle: true,
        languageSwitch: true,
      },
      labels: {
        item: 'Sheet',
        manifest: 'Manuscript',
      },
      lang: 'en-US',
      languageSwitch: false,
      meta: {
        collection: {
          all: true,
        },
        manifest: {
          all: true,
        },
        item: {
          all: true,
        },
      },
      notificationColors: {
        info: 'blue-9',
        warning: 'red-9',
      },
      rtl: false,
      themes: false,
    },
    activeViews: [],
    isValid: false,
  };
}
