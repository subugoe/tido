import { createContext, RefObject, useCallback, useContext, useEffect, useMemo, useRef, useState, ReactNode } from 'react'
import { apiRequest } from '@/utils/api.ts'
import { sanitize } from '@/utils/text-sanitize.ts'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { useErrorBoundary } from 'react-error-boundary'
import { logError } from '@/utils/custom-error.ts'

type State = {
  // translation keys of the problems found for this text, each one listed once
  textWarnings: string[]
  addTextWarning: (key: string) => void
  removeTextWarning: (key: string) => void
  clearTextWarnings: () => void
  contentTypes: string[]
  activeContentType: string
  activeContentUrl: RefObject<string>
  setActiveContentType: (contentType: string) => void
  label: string
  text: string
  loadingText: boolean
  setLoadingText: (value: boolean) => void
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
  const { panelState, loading: loadingPanel, usePanelTranslation, updatePanel, annotationsError } = usePanel()
  const { contentTypes, activeContentType, label } = panelState.panelViews[viewIndex] ?? {}
  const { showBoundary } = useErrorBoundary()
  const { t } = usePanelTranslation()

  const [textWarnings, setTextWarnings] = useState<string[]>([])

  // Stable, so effects and listeners that hold on to them do not have to be rebound. Adding a
  // warning that is already listed keeps the state as is - the same problem found again (e.g. on
  // every hover) neither re-renders nor brings back a warning the visitor has not dismissed.
  const addTextWarning = useCallback((key: string) => {
    setTextWarnings(current => current.includes(key) ? current : [...current, key])
  }, [])

  const removeTextWarning = useCallback((key: string) => {
    setTextWarnings(current => current.includes(key) ? current.filter(k => k !== key) : current)
  }, [])

  const clearTextWarnings = useCallback(() => setTextWarnings([]), [])
  // const [matchedAnnotationsMap, setMatchedAnnotationsMap] = useState<MatchedAnnotationsMap>(null)
  const [text, setText] = useState<string>('')
  const [loadingText, setLoadingText] = useState(false)

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
      clearTextWarnings()
      try {
        const response = await apiRequest<string>(url)
        if (stale) return
        const { output, removed } = sanitize(response)
        setText(output)

        // Normally the loading is set to false when a text has finished rendering in TextRenderer.
        // When trying to load the same text again it won't rerender, so the loading is always true.
        // This is a fix for that.
        if (text === output) setLoadingText(false)

        if (removed.length > 0) {
          addTextWarning('text_not_displayed_correctly')
          console.error('Removed HTML elements during text sanitization: ', removed)
        }
      } catch (e) {
        if (stale) return
        showBoundary(e)
        logError(e, t)
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

  // The text is shown without annotations when they could not be loaded - the sidebar shows the
  // error itself, this tells a visitor who has it closed. Listed again with every new text, as
  // loading one clears the warnings of the previous.
  useEffect(() => {
    if (annotationsError) addTextWarning('annotations_loading_error')
  }, [annotationsError, text, addTextWarning])

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
      textWarnings,
      addTextWarning,
      removeTextWarning,
      clearTextWarnings,
      contentTypes,
      activeContentType,
      activeContentUrl,
      setActiveContentType,
      label,
      text,
      loadingText,
      setLoadingText,
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
