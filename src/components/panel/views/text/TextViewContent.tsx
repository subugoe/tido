import { FC, useEffect, useRef } from 'react'
import TextRenderer from '@/components/panel/renderers/text/TextRenderer.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'
import Loading from '@/components/ui/loading.tsx'
import TextViewHeader from '@/components/panel/views/text/TextViewHeader.tsx'
import TextViewWarning from '@/components/panel/views/text/TextViewWarning.tsx'
import { useTextView } from '@/contexts/TextViewContext.tsx'
import MissingContentTypes from '@/components/panel/views/text/MissingContentTypes.tsx'

const TextViewContent: FC = () => {
  const { panelState, getScroller } = usePanel()
  const { activeContentUrl, loadingText, setLoadingText, missingContentTypes } = useTextView()
  const scrollContainer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const url = activeContentUrl
    if (!scrollContainer.current || !url) return
    const scroller = getScroller()
    scroller.setText(url, scrollContainer.current)
    scroller.startText(url)
    return () => scroller.stopText(url)
  }, [scrollContainer.current, activeContentUrl])

  useEffect(() => {
    if (!scrollContainer.current) return
    scrollContainer.current.scrollTop = 0
  }, [panelState.item])

  function onReady() {
    setLoadingText(false)
  }

  return <>
    <TextViewHeader />
    { missingContentTypes.length > 0 && <MissingContentTypes /> }
    {/* the text scrolls below the header */}
    <div data-text-container ref={scrollContainer} hidden={missingContentTypes.length > 0} tabIndex={-1}
      className="flex-1 min-h-0 w-full overflow-auto px-3 focus:outline-none">
      <TextRenderer onReady={onReady} />
    </div>
    <div data-text-warning className="absolute w-full bottom-0 z-10 flex flex-col items-center justify-center">
      <TextViewWarning />
    </div>
    { loadingText && <div className="absolute z-10 bg-background left-0 top-0 w-full h-full">
      <Loading />
    </div> }
  </>
}

export default TextViewContent
