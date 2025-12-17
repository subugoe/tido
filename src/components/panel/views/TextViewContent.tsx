import { FC, useEffect, useRef, useState } from 'react'
import TextRenderer from '@/components/panel/TextRenderer.tsx'
import { apiRequest } from '@/utils/api.ts'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { useErrorBoundary } from 'react-error-boundary'
import Loading from '@/components/ui/loading.tsx'
import { useText } from '@/contexts/TextContext.tsx'
import TextOptions from '@/components/panel/TextOptions.tsx'
import TextViewWarning from '@/components/panel/views/TextViewWarning.tsx'
import { sanitize } from '@/utils/text-sanitize.ts'

const TextViewContent: FC = () => {
  const { panelState, showTextOptions, usePanelTranslation, setTextWarning, loading: loadingPanel, getSidebarScroller } = usePanel()
  const { loadingText, setLoadingText } = useText()
  const { t } = usePanelTranslation()
  const { showBoundary } = useErrorBoundary()
  const [text, setText] = useState<string>('')
  const scrollContainer = useRef<HTMLDivElement>(null)

  const activeContentType = panelState.activeContentType
  function getContentUrlByType(type: string | undefined) {
    if (!type) return undefined
    return panelState?.item?.content.find(c => c.type.includes(type))?.url
  }

  useEffect(() => {
    if (!scrollContainer.current) return
    getSidebarScroller().setText(scrollContainer.current)
  }, [scrollContainer])

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

    if (loadingPanel || !panelState) {
      setLoadingText(true)
      return
    }

    if (!panelState?.contentTypes.length) {
      showBoundary(t('no_content_found'))
      return
    }

    const contentUrl = getContentUrlByType(activeContentType)

    if (contentUrl) updateText(contentUrl)
    else showBoundary(t('no_content_found'))

  }, [loadingPanel, panelState?.contentTypes, activeContentType])

  useEffect(() => {
    if (!scrollContainer.current) return
    scrollContainer.current.scrollTop = 0
  }, [panelState.item])

  function onReady() {
    setLoadingText(false)
  }

  return <>
    <div data-text-options className="absolute w-full top-0 z-10 flex flex-col items-center justify-center">
      {showTextOptions && <TextOptions />}
    </div>
    <div data-text-container ref={scrollContainer} className="h-full w-full overflow-auto px-3">
      <TextRenderer htmlString={text} onReady={onReady} />
    </div>
    <div data-text-warning className="absolute w-full bottom-0 z-10 flex flex-col items-center justify-center">
      <TextViewWarning />
    </div>
    { loadingText && <div className="absolute z-10 bg-background left-0 top-0 w-full h-full">
      <Loading size={36} />
    </div> }
  </>
}

export default TextViewContent
