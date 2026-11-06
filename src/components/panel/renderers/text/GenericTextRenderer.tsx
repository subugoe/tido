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

  // The wrapper holds the text and the annotations layer, and is the positioning context of the
  // popover anchor the layer renders into it.
  const textWrapperRef = useRef<HTMLDivElement>(null)
  // The parsed text goes in here and nowhere else. React never renders into this element, so
  // replacing its children can never remove a node React still owns (like the popover anchor).
  const textContentRef = useRef<HTMLDivElement>(null)
  // the parsed text once it is in the document, together with the source it was loaded from - the
  // annotations layer starts working on it then. Both are handed over at once: the source prop
  // changes a render before the new text is attached, and the layer must never match the
  // annotations of the new source against the old text.
  const [attached, setAttached] = useState<{ dom: Element, source: string } | null>(null)

  // Document object that is recreated when the text or its source changes - e.g. on item change or
  // content type change, also when the text of the new source is the same as the previous one
  const parsedDom: Element = useMemo(() => {
    if (htmlString === '') return
    const doc = new DOMParser().parseFromString(`${htmlString}`, 'text/html')
    const body = doc.querySelector('body')
    const div = doc.createElement('div')
    div.replaceChildren(...body.childNodes)
    return div
  }, [source])

  // Attach the content of the Document object as the only child of textContentRef.
  useEffect(() => {
    if (!parsedDom) return

    textContentRef.current.replaceChildren(parsedDom)
    setAttached({ dom: parsedDom, source })
    if (onReady) onReady()
  }, [parsedDom])

  return <div
    data-text-wrapper
    data-text-source={sourceType === 'text' ? source : undefined}
    ref={textWrapperRef}
    className="relative"
    style={{ paddingTop: `${paddingTop * 0.25}rem` }}>
    <div data-text-content ref={textContentRef} />
    {attached && <ErrorBoundary
      resetKeys={[attached.dom, annotations]}
      fallbackRender={({ error }) => <AnnotationsLayerError error={error} source={attached.source} />}>
      <TextAnnotationsLayer
        parsedDom={attached.dom}
        wrapperRef={textWrapperRef}
        onUpdateMatchedAnnotationsMap={onUpdateMatchedAnnotationsMap}
        source={attached.source}
        sourceType={sourceType}
        onSelect={onSelect}
        ignoreFilters={ignoreFilters}
      />
    </ErrorBoundary>}
  </div>
})

export default GenericTextRenderer
