import { FC, useEffect, useState } from 'react'

import { usePanelStore } from '@/store/PanelStore.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'

import TextViewOne from '@/components/panel/views/TextViewOne.tsx'
import TextView from '@/components/panel/views/TextView.tsx'
import SplitView from '@/components/panel/views/SplitView.tsx'
import ImageView from '@/components/panel/views/ImageView.tsx'

import ErrorComponent from '@/components/ErrorComponent.tsx'

import { Skeleton } from '@/components/ui/skeleton.tsx'
import EmptyMessage from '@/components/panel/EmptyMessage.tsx'
import { apiRequest } from '@/utils/api.ts'



const PanelBody: FC = () => {
  const { panelId, panelState, loading } = usePanel()

  const activeContentTypeIndex = usePanelStore(
    (state) => panelId && state.panels[panelId] ? state.panels[panelId].contentIndex : 0
  )
  const [text, setText] = useState<string>('')

  const [error, setError] = useState<string | null>(null)

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

    if (!panelState?.contentTypes.length) return
    const contentUrl = getContentUrlByType(panelState?.contentTypes[activeContentTypeIndex].toLowerCase())
    if (contentUrl) updateText(contentUrl)
  }, [panelState, activeContentTypeIndex])

  function renderContent() {
    if (error) return <ErrorComponent message={error} />
    if (loading) return <Skeleton className="t-w-full t-h-full" />
    if (!panelState || !panelState.item) return <EmptyMessage />

    if (panelState.viewIndex === 0) {
      return <TextViewOne textHtml={text} />
    } else if (panelState.viewIndex === 1) {
      return <TextView textHtml={text} />
    } else if (panelState.viewIndex === 2) {
      return <SplitView textHtml={text} />
    } else if (panelState.viewIndex === 3) {
      return <ImageView />
    }
  }

  return <div className="t-overflow-hidden t-border-t t-flex-1">{ renderContent() }</div>
}

export default PanelBody
