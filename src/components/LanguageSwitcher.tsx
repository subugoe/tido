import { useTranslation } from 'react-i18next'

const LanguageSwitcher = () => {
  const { i18n } = useTranslation() // Access the i18next instance to change language

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language) // Change the language dynamically
  }

  return (
    <div className="t-flex t-flex-row t-ml-6 t-mt-10 t-space-x-2">
      <button onClick={() => handleLanguageChange('sq')}>Albanian</button>
      <button onClick={() => handleLanguageChange('de')}>Deutsch</button>
      <button onClick={() => handleLanguageChange('en')}>English</button>
      <button onClick={() => handleLanguageChange('es')}>Español</button>
      <button onClick={() => handleLanguageChange('hi')}>Indian</button>
      <button onClick={() => handleLanguageChange('ru')}>Russian</button>
      <button onClick={() => handleLanguageChange('tr')}>Turkish</button>
    </div>
  )
}

export default LanguageSwitcher
