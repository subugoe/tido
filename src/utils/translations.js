
import i18n from '@/i18n'

// variables are named according to the general concept of ie (item = sheet, item);  (manifest = document, manuscript)
const navButtonsDefaultTextArray = ['next_item', 'previous_item', 'next_manifest', 'previous_manifest']

export function areNavButtonsLabelsInConfig(config) {
    const lang = config['lang'] ?? 'en'
    const translations = config.translations?[lang]: {}

    for (let i = 0; i < navButtonsDefaultTextArray.length; i++) {
      if(!(navButtonsDefaultTextArray[i] in translations)) return false
    }

    return true
}


export function getNavButtonsLabels(config) {
    const lang = config['lang'] ?? 'en'

    if (areNavButtonsLabelsInConfig(config)) {
      const translations = config.translations[lang]
      return [translations['next_item'], translations['previous_item'], translations['next_manifest'], translations['previous_manifest']]
    }
    else {
      // the following way of accessing translations (i.e next_item) is on square brackets, because we use 18n on a js file and not a vue component
      const t = i18n[lang]
      return [t['next_item'], t['previous_item'], t['next_manifest'], t['previous_manifest']]
    }
}
