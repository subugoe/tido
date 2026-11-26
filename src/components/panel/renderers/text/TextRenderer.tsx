import {
  FC,
  memo,
  useEffect,
  useRef,
} from 'react'

import { usePanel } from '@/contexts/PanelContext.tsx'
import { useTextView } from '@/contexts/TextViewContext.tsx'
import GenericTextRenderer from '@/components/panel/renderers/text/GenericTextRenderer.tsx'

interface Props {
  onReady?: () => void
}

const TextRenderer: FC<Props> = memo(({ onReady }) => {
  const {
    openAnnotations,
    annotationsMode
  } = usePanel()

  const { text, activeContentUrl } = useTextView()

  const annotationsModeRef = useRef<'aligned' | 'list'>(null)

  function onSelect() {
    openAnnotations()
  }

  useEffect(() => {
    annotationsModeRef.current = annotationsMode
  }, [annotationsMode])


  return <div className="relative flex">
    <GenericTextRenderer
      htmlString={text}
      onReady={onReady}
      source={activeContentUrl}
      sourceType="text"
      onSelect={onSelect}
      paddingTop={3}
    />
  </div>
})

export default TextRenderer
