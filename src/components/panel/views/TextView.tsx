import { FC, useEffect, useState } from 'react'
import TextRenderer from '@/components/panel/TextRenderer.tsx'
import { apiRequest } from '@/utils/api.ts'
import { usePanel } from '@/contexts/PanelContext.tsx'
import DOMPurify from 'dompurify'
import { useErrorBoundary } from 'react-error-boundary'

const FORBID_TAGS = ['input', 'script', 'noscript', 'iframe', 'frame', 'frameset', 'noframes', 'applet', 'base', 'meta', 'form']

const TextView: FC = () => {
  const { panelState, loading, usePanelTranslation, setTextWarning } = usePanel()
  const { t } = usePanelTranslation()
  const { showBoundary } = useErrorBoundary()
  const [text, setText] = useState<string>('')

  const activeContentTypeIndex = panelState.contentIndex
  function getContentUrlByType(type: string | undefined) {
    if (!type) return undefined
    return panelState?.item?.content.find(c => c.type.includes(type))?.url
  }

  useEffect(() => {
    async function updateText(contentUrl: string) {
      try {
        const response = await apiRequest<string>(contentUrl)
        const cleanHtml = DOMPurify.sanitize(response, { FORBID_TAGS })
        const hasRemoved = DOMPurify.removed.length > 0
        setTextWarning(hasRemoved ? t('text_not_displayed_correctly') : '')
        if (hasRemoved) console.error('Removed HTML elements during text sanitization: ', DOMPurify.removed)
        setText(cleanHtml)
      } catch (e) {
        showBoundary(e)
        console.error(e)
      }
    }

    if (loading || !panelState) return
    if (!panelState?.contentTypes.length) {
      showBoundary(t('no_content_found'))
      return
    }

    const contentUrl = getContentUrlByType(panelState?.contentTypes[activeContentTypeIndex])

    if (contentUrl) updateText(contentUrl)
    else showBoundary(t('no_content_found'))

  }, [loading, panelState, activeContentTypeIndex])

  return <TextRenderer htmlString={text} />
}

export default TextView
