import { FC, memo, useEffect, useMemo, useRef, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { usePanel } from '@/contexts/PanelContext.tsx'
import TextAnnotationsLayer from '@/components/panel/renderers/text/TextAnnotationsLayer.tsx'
import AnnotationsLayerError from '@/components/panel/renderers/text/AnnotationsLayerError.tsx'


interface Props {
  htmlString?: string
  onReady?: () => void
  onUpdateMatchedAnnotationsMap?: (source: string, map: MatchedAnnotationsMap) => void
  source: string
  sourceType: 'text' | 'annotation'
  onSelect?: () => void
  ignoreFilters?: boolean
  paddingTop?: number // tailwind scale value i.e 16 for pt-16
}

// Renders the text. Its annotations are handled by TextAnnotationsLayer behind an error boundary of
// their own, so the text is shown whatever is wrong with the annotation data - the boundary only
// replaces the layer, and the visitor is told about it in the text's warning bar.
const GenericTextRenderer: FC<Props> = memo(({
  htmlString,
  onReady,
  onUpdateMatchedAnnotationsMap,
  source,
  sourceType,
  onSelect,
  ignoreFilters = false,
  paddingTop = 0
}) => {
  const { annotations } = usePanel()

  const textWrapperRef = useRef<HTMLDivElement>(null)
  // the parsed text once it is in the document - the annotations layer starts working on it then
  const [attachedDom, setAttachedDom] = useState<Element | null>(null)

  // Document object that is only recreated when htmlString changes - e.g. on item change or content type change
  const parsedDom: Element = useMemo(() => {
    if (htmlString === '') return
    const doc = new DOMParser().parseFromString(`${htmlString}`, 'text/html')
    const body = doc.querySelector('body')
    const div = doc.createElement('div')
    div.replaceChildren(...body.childNodes)
    return div
  }, [htmlString])

  // Attach the content of the Document object as children of textWrapperRef.
  useEffect(() => {
    if (!parsedDom) return

    textWrapperRef.current.replaceChildren(parsedDom)
    setAttachedDom(parsedDom)
    if (onReady) onReady()
  }, [parsedDom])

  return <div
    data-text-wrapper
    data-text-source={sourceType === 'text' ? source : undefined}
    ref={textWrapperRef}
    className="relative"
    style={{ paddingTop: `${paddingTop * 0.25}rem` }}>
    {attachedDom && <ErrorBoundary
      resetKeys={[attachedDom, annotations]}
      fallbackRender={({ error }) => <AnnotationsLayerError error={error} source={source} />}>
      <TextAnnotationsLayer
        parsedDom={attachedDom}
        wrapperRef={textWrapperRef}
        onUpdateMatchedAnnotationsMap={onUpdateMatchedAnnotationsMap}
        source={source}
        sourceType={sourceType}
        onSelect={onSelect}
        ignoreFilters={ignoreFilters}
      />
    </ErrorBoundary>}
  </div>
})

export default GenericTextRenderer
