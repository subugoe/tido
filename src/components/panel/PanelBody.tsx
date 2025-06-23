import { FC, useEffect, useState } from 'react'

import { usePanel } from '@/contexts/PanelContext.tsx'

import TextViewOne from '@/components/panel/views/TextViewOne.tsx'
import TextView from '@/components/panel/views/TextView.tsx'
import SplitView from '@/components/panel/views/SplitView.tsx'
import ImageView from '@/components/panel/views/ImageView.tsx'

import ErrorMessage from '@/components/panel/ErrorMessage.tsx'

import { apiRequest } from '@/utils/api.ts'
import { useTranslation } from 'react-i18next'
import Loading from '@/components/ui/loading.tsx'


const PanelBody: FC = () => {
  const { panelState, loading, error, setError } = usePanel()
  const { t } = useTranslation()
  const activeContentTypeIndex = panelState.contentIndex
  const [text, setText] = useState<string>('')

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

  function renderContent() {
    if (error) return <ErrorMessage message={error ?? t('unknown_error')} title={t('error_occurred')} />
    if (loading) return <Loading size={40} />

    if (panelState.view === 'swap') return <TextViewOne textHtml={text} />
    else if (panelState.view === 'split') return <SplitView textHtml={text} />
    else if (panelState.view === 'text') return <TextView textHtml={text} />
    else if (panelState.view === 'image') return <ImageView />
  }

  return <div className="overflow-hidden border-t border-border flex-1">{ renderContent() }</div>
}

export default PanelBody
