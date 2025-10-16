import { FC, useEffect, useState } from 'react'
import TextRenderer from '@/components/panel/TextRenderer.tsx'
import { apiRequest } from '@/utils/api.ts'
import { usePanel } from '@/contexts/PanelContext.tsx'
import DOMPurify from 'dompurify'
import { useErrorBoundary } from 'react-error-boundary'
import Loading from '@/components/ui/loading.tsx'

const FORBID_TAGS = ['input', 'script', 'noscript', 'iframe', 'frame', 'frameset', 'noframes', 'applet', 'base', 'meta', 'form']

const TextView: FC = () => {
  const { panelState, usePanelTranslation, setTextWarning, loading: loadingPanel } = usePanel()
  const { t } = usePanelTranslation()
  const { showBoundary } = useErrorBoundary()
  const [text, setText] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const activeContentTypeIndex = panelState.contentIndex
  function getContentUrlByType(type: string | undefined) {
    if (!type) return undefined
    return panelState?.item?.content.find(c => c.type.includes(type))?.url
  }

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
      setLoading(true)
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
    setLoading(false)
  }

  return <>
    { loading && <div className="absolute z-10 bg-background left-0 top-0 w-full h-full">
      <Loading size={36} />
    </div> }
    <TextRenderer htmlString={text} onReady={onReady} />
  </>
}

export default TextView
