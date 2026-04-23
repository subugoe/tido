import { FC, useEffect, useRef } from 'react'
import TextRenderer from '@/components/panel/renderers/text/TextRenderer.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'
import Loading from '@/components/ui/loading.tsx'
import { useText } from '@/contexts/TextContext.tsx'
import TextOptions from '@/components/panel/views/text/TextOptions.tsx'
import TextViewWarning from '@/components/panel/views/text/TextViewWarning.tsx'
import { useTextView } from '@/contexts/TextViewContext.tsx'
import { useConfig } from '@/contexts/ConfigContext.tsx'

const TextViewContent: FC = () => {
  const { panelState, getScroller } = usePanel()
  const { loadingText, setLoadingText } = useText()
  const { text, activeContentUrl } = useTextView()
  const { showContentTypeToggle } = useConfig()
  const scrollContainer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const url = activeContentUrl.current
    if (!scrollContainer.current || !url) return
    const scroller = getScroller()
    scroller.setText(url, scrollContainer.current)
    scroller.startText(url)
    return () => scroller.stopText(url)
  }, [scrollContainer.current, activeContentUrl.current])

  useEffect(() => {
    if (!scrollContainer.current) return
    scrollContainer.current.scrollTop = 0
  }, [panelState.item])

  function onReady() {
    setLoadingText(false)
  }

  return <>
    {showContentTypeToggle && <div data-text-options className="absolute w-full top-0 z-10 flex flex-col items-center justify-center">
      <TextOptions />
    </div>}
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
