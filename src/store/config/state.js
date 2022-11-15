export default function ConfigState() {
  return {
    config: {
      collection: '',
      manifest: '',
      item: '',
      panels: [
        {
          label: 'contents',
          toggle: true,
          show: true,
          views: [
            {
              id: 'tree',
              label: 'contents',
              connector: {
                id: 1,
                options: {
                  labels: {
                    item: 'Sheet',
                    manifest: 'Manuscript',
                  },
                },
              },
            },
          ],
        },
        {
          label: 'metadata',
          show: true,
          toggle: true,
          views: [
            {
              id: 'metadata',
              label: 'metadata',
              connector: {
                id: 2,
                options: {
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
              },
            },
          ],
        },
        {
          label: 'image',
          show: true,
          toggle: true,
          views: [
            {
              id: 'image',
              label: 'Image',
              connector: {
                id: 3,
              },
            }],
        },
        {
          label: 'text',
          show: true,
          toggle: true,
          views: [
            {
              id: 'text1',
              label: 'Transcription',
              default: true,
              connector: {
                id: 4,
                options: {
                  type: 'transcription',
                },
              },
            },
            {
              id: 'text2',
              label: 'Transliteration',
              connector: {
                id: 4,
                options: {
                  type: 'transliteration',
                },
              },
            },
          ],
        },
        {
          label: 'annotations',
          show: true,
          toggle: true,
          views: [
            {
              id: 'annotations1',
              label: 'annotations',
              connector: {
                id: 5,
                options: {
                  types: [],
                },
              },
            },
          ],
        },
      ],
      colors: {
        primary: '',
        secondary: '',
        accent: '',
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
    },
    activeViews: [],
    isValid: false,
  };
}
