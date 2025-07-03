import { FC, useEffect, useRef, useState } from 'react'

import { usePanel } from '@/contexts/PanelContext.tsx'

import TextViewOne from '@/components/panel/views/TextViewOne.tsx'
import TextView from '@/components/panel/views/TextView.tsx'
import SplitView from '@/components/panel/views/SplitView.tsx'
import ImageView from '@/components/panel/views/ImageView.tsx'

import ErrorMessage from '@/components/panel/ErrorMessage.tsx'

import { apiRequest } from '@/utils/api.ts'
import { useTranslation } from 'react-i18next'
import Loading from '@/components/ui/loading.tsx'
import AnnotationsBody from '@/components/panel/annotations/AnnotationsBody.tsx'


const PanelBody: FC = () => {
  const { panelState, loading, error, resizer, initResizer, setError, setBodyMounted } = usePanel()
  const { t } = useTranslation()
  const activeContentTypeIndex = panelState.contentIndex
  const [text, setText] = useState<string>('')
  const [showSidebar, setShowSidebar] = useState(false)


  const scrollRef = useRef()
  function getContentUrlByType(type: string | undefined) {
    if (!type) return undefined
    return panelState?.item?.content.find(c => c.type.includes(type))?.url
  }

  useEffect(() => {
    if (!scrollRef.current) return
    console.log('set body mounted')
    setBodyMounted(true)
    return () => setBodyMounted(false)
  }, [scrollRef.current])

  useEffect(() => {
    if (!resizer) return
    resizer.setAnnotationsOpen(panelState.annotationsOpen)

    if (panelState.annotationsOpen) {
      const timeout = setTimeout(() => {
        setShowSidebar(true)
      }, 600)

      return () => clearTimeout(timeout)
    } else {
      setShowSidebar(false)
    }
  }, [panelState.annotationsOpen])

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

    return <div ref={scrollRef} data-scroll-container className="h-full overflow-y-auto relative">
      <div data-text-container>
        <TextView textHtml={text} />
      </div>
      { panelState.annotationsOpen && <div className="absolute top-0 right-0 min-h-full border-l border-border w-[400px]">
        {/*{ <AnnotationsBody /> }*/}
      </div> }
    </div>


    if (panelState.view === 'swap') return <TextViewOne textHtml={text} />
    else if (panelState.view === 'split') return <SplitView textHtml={text} />
    else if (panelState.view === 'text') return <TextView textHtml={text} />
    else if (panelState.view === 'image') return <ImageView />
  }

  return <div className="border-t border-border flex-1">{ renderContent() }</div>
}

export default PanelBody
