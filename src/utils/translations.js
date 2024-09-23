
export function areNavButtonsLabelsInConfig(config, navButtonsDefaultTextArray) {

    const lang = config['lang']
    const translations = config.translations[lang]

    for (let i = 0; i < navButtonsDefaultTextArray.length; i++) {
      if(!(navButtonsDefaultTextArray[i] in translations)) return false
    }
    
    return true
}

