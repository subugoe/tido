import {
  FC,
  memo,
  useEffect,
  useRef,
} from 'react'

import { usePanel } from '@/contexts/PanelContext.tsx'
import { useTextView } from '@/contexts/TextViewContext.tsx'
import { useConfig } from '@/contexts/ConfigContext.tsx'
import GenericTextRenderer from '@/components/GenericTextRenderer.tsx'

interface Props {
  htmlString: string
  onReady?: () => void
}

const TextRenderer: FC<Props> = memo(({ htmlString, onReady }) => {
  const { showContentTypeToggle } = useConfig()
  const {
    panelState,
    updatePanel,
    annotationsMode,
    updateMatchedAnnotationsMap
  } = usePanel()

  const { activeContentUrl, visible } = useTextView()

  const matchedMapRef = useRef<MatchedAnnotationsMap>({})
  const annotationsModeRef = useRef<'aligned' | 'list'>(null)

  // We switch the map when visible state changes to
  useEffect(() => updateMatchedAnnotationsMap(activeContentUrl.current, visible ? matchedMapRef.current : {}), [visible])

  function onMatchedMapUpdate(map: MatchedAnnotationsMap) {
    console.log('on')
    matchedMapRef.current = map
    updateMatchedAnnotationsMap(activeContentUrl.current, visible ? map : {})
  }

  function onSelect() {
    if (!panelState.showSidebar) {
      updatePanel({ showSidebar: true })
    }
  }

  useEffect(() => {
    annotationsModeRef.current = annotationsMode
  }, [annotationsMode])


  return <div className="relative flex">
    <div data-text-wrapper className={showContentTypeToggle ? 'pt-16' : 'pt-2'}>
      <GenericTextRenderer
        htmlString={htmlString}
        onReady={onReady}
        source={activeContentUrl.current}
        onSelect={onSelect}
        onUpdateMatchedAnnotationsMap={onMatchedMapUpdate}
      />
    </div>
  </div>
})

export default TextRenderer
