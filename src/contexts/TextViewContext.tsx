import { createContext, useContext, useEffect, useState } from 'react'
import { apiRequest } from '@/utils/api.ts'
import { sanitize } from '@/utils/text-sanitize.ts'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { useText } from '@/contexts/TextContext.tsx'
import { useErrorBoundary } from 'react-error-boundary'

type State = {
  textWarning: string
  setTextWarning: (warning: string) => void
  contentTypes: string[]
  activeContentType: string
  activeContentUrl: string
  setActiveContentType: (contentType: string) => void
  label: string
  text: string
  matchedAnnotationsMap: MatchedAnnotationsMap
  setMatchedAnnotationsMap: (map: MatchedAnnotationsMap) => void
}

const TextViewContext = createContext<State>(null)

export const TextViewProvider = ({
  contentTypes,
  label,
  children
}) => {
  const { panelState, loading: loadingPanel, usePanelTranslation, matchedAnnotationsMaps, updateMatchedAnnotationsMap } = usePanel()
  const { setLoadingText } = useText()
  const { showBoundary } = useErrorBoundary()
  const { t } = usePanelTranslation()

  const [textWarning, setTextWarning] = useState('')
  const [activeContentType, setActiveContentType] = useState(null)
  const [matchedAnnotationsMap, setMatchedAnnotationsMap] = useState<MatchedAnnotationsMap>(null)
  const [text, setText] = useState<string>('')

  const [activeContentUrl, setActiveContentUrl] = useState(null)

  function getContentUrlByType(type: string | undefined) {
    if (!type) return undefined
    return panelState?.item?.content.find(c => c.type.includes(type))?.url
  }

  // Once a new local map is set, update the higher up map
  useEffect(() => {
    if (!activeContentUrl || !matchedAnnotationsMap) return
    updateMatchedAnnotationsMap(activeContentUrl, matchedAnnotationsMap)

    return () => {
      // On destroy, remove the map from the higher up map
      updateMatchedAnnotationsMap(activeContentUrl, null)
    }
  }, [matchedAnnotationsMap, activeContentUrl])

  // Once the higher up map is updated, update the local map
  useEffect(() => {
    setMatchedAnnotationsMap(matchedAnnotationsMaps[activeContentUrl])
  }, [matchedAnnotationsMaps, setMatchedAnnotationsMap, activeContentUrl])

  useEffect(() => {
    async function updateText(contentUrl: string) {
      setTextWarning('')
      try {
        const response = await apiRequest<string>(contentUrl)
        const { output, removed } = sanitize(response)
        setText(output)

        // Normally the loading is set to false when a text has finished rendering in TextRenderer.
        // When trying to load the same text again it won't rerender, so the loading is always true.
        // This is a fix for that.
        if (text === output) setLoadingText(false)

        const hasRemoved = removed.length > 0
        setTextWarning(hasRemoved ? t('text_not_displayed_correctly') : '')
        if (hasRemoved) console.error('Removed HTML elements during text sanitization: ', removed)
      } catch (e) {
        showBoundary(e)
        console.error(e)
      }
    }

    if (loadingPanel || !panelState || !activeContentType) {
      setLoadingText(true)
      return
    }

    const contentUrl = getContentUrlByType(activeContentType)

    if (contentUrl) {
      setActiveContentUrl(contentUrl)
      updateText(contentUrl)
    }
    else showBoundary(t('no_content_found'))

  }, [loadingPanel, activeContentType])

  useEffect(() => {
    if (contentTypes.length === 0) {
      showBoundary(t('no_content_found'))
      return
    }
    setActiveContentType(contentTypes[0])
  }, [contentTypes])

  return (
    <TextViewContext.Provider value={{
      textWarning,
      setTextWarning,
      contentTypes,
      activeContentType,
      activeContentUrl,
      setActiveContentType,
      label,
      text,
      matchedAnnotationsMap,
      setMatchedAnnotationsMap
    }}>
      {children}
    </TextViewContext.Provider>
  )
}

export const useTextView = () => {
  const context = useContext(TextViewContext)

  if (context === undefined)
    throw new Error('useText must be used within a TextViewProvider')

  return context
}
