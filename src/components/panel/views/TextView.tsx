import { FC, useEffect, useState } from 'react'
import TextRenderer from '@/components/panel/TextRenderer.tsx'
import { apiRequest } from '@/utils/api.ts'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { useTranslation } from 'react-i18next'
import ContentTypesToggle from '@/components/panel/ContentTypesToggle.tsx'

const TextView: FC = () => {
  const { panelState, loading, error, setError } = usePanel()
  const { t } = useTranslation()
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
        setText(response)
      } catch (e) {
        setError((e as ErrorResponse).message)
        console.error(e)
      }
    }

    if (error || loading || !panelState) return
    if (!panelState?.contentTypes.length) {
      setError(t('no_content_found'))
      return
    }

    const contentUrl = getContentUrlByType(panelState?.contentTypes[activeContentTypeIndex])

    if (contentUrl) updateText(contentUrl)
    else setError(t('no_content_found'))

  }, [loading, panelState, activeContentTypeIndex])

  return <TextRenderer htmlString={text} />
}

export default TextView
