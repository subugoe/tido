import { FC, useEffect, useRef, useState } from 'react'
import TextRenderer from '@/components/panel/TextRenderer.tsx'
import { apiRequest } from '@/utils/api.ts'
import { usePanel } from '@/contexts/PanelContext.tsx'
import DOMPurify from 'dompurify'
import { useErrorBoundary } from 'react-error-boundary'
import Loading from '@/components/ui/loading.tsx'
import { useText } from '@/contexts/TextContext.tsx'
import TextOptions from '@/components/panel/TextOptions.tsx'
import TextViewWarning from '@/components/panel/views/TextViewWarning.tsx'


const FORBID_TAGS = ['input', 'script', 'noscript', 'iframe', 'frame', 'frameset', 'noframes', 'applet', 'base', 'meta', 'form']

const TextViewContent: FC = () => {
  const { panelState, showTextOptions, usePanelTranslation, setTextWarning, loading: loadingPanel, getSidebarScroller } = usePanel()
  const { loadingText, setLoadingText } = useText()
  const { t } = usePanelTranslation()
  const { showBoundary } = useErrorBoundary()
  const [text, setText] = useState<string>('')
  const scrollContainer = useRef<HTMLDivElement>(null)

  const activeContentTypeIndex = panelState.contentIndex
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
        const cleanHtml = DOMPurify.sanitize(response, { FORBID_TAGS })
        setText(cleanHtml)
        const hasRemoved = DOMPurify.removed.length > 0
        setTextWarning(hasRemoved ? t('text_not_displayed_correctly') : '')
        if (hasRemoved) console.error('Removed HTML elements during text sanitization: ', DOMPurify.removed)
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

    const contentUrl = getContentUrlByType(panelState?.contentTypes[activeContentTypeIndex])

    if (contentUrl) updateText(contentUrl)
    else showBoundary(t('no_content_found'))

  }, [loadingPanel, panelState?.contentTypes, activeContentTypeIndex])

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
