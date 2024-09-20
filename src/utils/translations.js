
export function areNavButtonsLabelsInConfig(config) {

    const lang = config['lang']
    const translations = config.translations[lang]
    // the first element is 'Contents and Metadata', while the other 4 should be for the header nav buttons text  
    if (Object.keys(translations).length < 5) return false
    const customNavButtonsText = Object.keys(translations).slice(1,5) // the nav buttons text if given should be from 1-5 th keys
    const navButtonsTextArray = ['next_page', 'previous_page', 'next_document', 'previous_document']

    return JSON.stringify(customNavButtonsText) === JSON.stringify(navButtonsTextArray)
  }

