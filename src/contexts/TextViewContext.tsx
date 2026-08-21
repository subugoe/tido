import { createContext, RefObject, useContext, useEffect, useMemo, useRef, useState, ReactNode } from 'react'
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

  // The content url of the active item for the active content type. Depending on this value (instead
  // of only on the panel loading state) makes the text reload whenever the item actually changes -
  // the loading flag alone can miss a transition when two navigations overlap.
  const contentUrl = useMemo(
    () => panelState?.item?.contents.find(c => c.contentType.includes(activeContentType))?.id,
    [panelState?.item, activeContentType]
  )

  useEffect(() => {
    // Ignore responses of outdated requests: when the content url changes while a fetch is still in
    // flight, its late response must not overwrite the text of the newer one.
    let stale = false

    async function updateText(url: string) {
      setTextWarning('')
      try {
        const response = await apiRequest<string>(url)
        if (stale) return
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
        if (stale) return
        showBoundary(e)
        console.error(e)
      }
    }

    if (loadingPanel || !panelState || !activeContentType) {
      setLoadingText(true)
      return () => { stale = true }
    }

    if (!contentUrl) {
      showBoundary(t('no_content_found'))
      return () => { stale = true }
    }

    activeContentUrl.current = contentUrl
    updateText(contentUrl)

    return () => { stale = true }

  }, [loadingPanel, activeContentType, contentUrl])

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
