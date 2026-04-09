import { createContext, RefObject, useContext, useEffect, useRef, useState, ReactNode } from 'react'
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
  activeContentUrl: RefObject<string>
  setActiveContentType: (contentType: string) => void
  label: string
  text: string
  visible: boolean
}

const TextViewContext = createContext<State>(null)

export const TextViewProvider = ({
  viewIndex,
  visible,
  children
}: {
  viewIndex: number
  visible: boolean
  children: ReactNode
}) => {
  const { panelState, loading: loadingPanel, usePanelTranslation, updatePanel } = usePanel()
  const { contentTypes, activeContentType, label } = panelState.panelViews[viewIndex] ?? {}
  const { setLoadingText } = useText()
  const { showBoundary } = useErrorBoundary()
  const { t } = usePanelTranslation()

  const [textWarning, setTextWarning] = useState('')
  // const [matchedAnnotationsMap, setMatchedAnnotationsMap] = useState<MatchedAnnotationsMap>(null)
  const [text, setText] = useState<string>('')

  const activeContentUrl = useRef(null)
  function getContentUrlByType(type: string | undefined) {
    if (!type) return undefined
    return panelState?.item?.content.find(c => c.type.includes(type))?.url
  }

  // Once a new local map is set, update the higher up map
  // useEffect(() => {
  //   if (!activeContentUrl.current || !matchedAnnotationsMap) return
  //   const url = activeContentUrl.current
  //   updateMatchedAnnotationsMap(url, matchedAnnotationsMap)
  //
  //   return () => {
  //     // On destroy, remove the map from the higher up map
  //     updateMatchedAnnotationsMap(url, null)
  //   }
  // }, [activeContentUrl])

  // Once the higher up map is updated, update the local map
  // useEffect(() => {
  //   if (!Object.hasOwn(matchedAnnotationsMaps, activeContentUrl.current)) return
  //   setMatchedAnnotationsMap(matchedAnnotationsMaps[activeContentUrl.current])
  // }, [matchedAnnotationsMaps, setMatchedAnnotationsMap])

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
      activeContentUrl.current = contentUrl
      updateText(contentUrl)
    }
    else showBoundary(t('no_content_found'))

  }, [loadingPanel, activeContentType])

  useEffect(() => {
    if (contentTypes.length === 0) {
      showBoundary(t('no_content_found'))
      return
    }
    if (!activeContentType || !contentTypes.includes(activeContentType)) {
      setActiveContentType(contentTypes[0])
    }
  }, [contentTypes])

  function setActiveContentType(type: string | null) {
    updatePanel({
      panelViews: panelState.panelViews.map((v, i) => {
        if (i === viewIndex) v.activeContentType = type
        return v
      })
    })
  }

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
      visible
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
