export default function ConfigState() {
  return {
    config: {
      collection: '',
      manifest: '',
      item: '',
      panels: [],
      colors: {
        primary: '',
        secondary: '',
        accent: ''
      },
      annotations: {

      },
      "header_section": {
        "show": true,
        "navigation": true,
        "panelheadings": true,
        "titles": true,
        "toggle": true
      },
      "labels": {
        "item": "Sheet",
        "manifest": "Manuscript"
      },
      "lang": "en-US",
      "language-switch": false,
      "meta": {
        "collection": {
          "all": true
        },
        "manifest": {
          "all": true
        },
        "item": {
          "all": true
        }
      },
      "notificationColors": {
        "info": "blue-9",
        "warning": "red-9"
      },
      "rtl": false,
      "themes": false
    },
    configErrorMessage: null,
    configErrorTitle: null,
    initialized: false,
    isValid: false,
  };
}
