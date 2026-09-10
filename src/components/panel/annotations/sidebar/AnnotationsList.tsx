import { FC, useEffect } from 'react'
import Annotation from '@/components/panel/annotations/sidebar/Annotation.tsx'
import { useAnnotations } from '@/contexts/AnnotationsContext.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { alignSidebarToAnnotation, alignTextToAnnotation, handleExternalSelection } from '@/utils/annotation-alignment.ts'


const AnnotationsList: FC = () => {
  const { filteredAnnotations } = useAnnotations()
  const { panelId, selectedAnnotation } = usePanel()

  // Same reaction to a selection as in AlignAnnotationsList: the side the selection did not come
  // from moves, so the card and its target end up at the same height. Nothing here goes through the
  // scroller - the sidebar and the text views keep their own scroll positions in this mode, and only
  // a selection moves either of them. The cards sit in the normal document flow, so the sidebar has
  // its full scrollable height as soon as they render and there is nothing to wait for.
  // filteredAnnotations is in the deps because a selection can arrive - through the config or a
  // bookmarked state - before the cards this effect looks up are in the DOM.
  useEffect(() => {
    if (!selectedAnnotation) return

    const panelEl = document.getElementById(panelId) as HTMLElement
    const controller = new AbortController()

    // The card was clicked in the sidebar, so it is already where the user put it - only the text
    // has to follow.
    if (selectedAnnotation.origin === 'annotation') {
      alignTextToAnnotation(panelEl, selectedAnnotation.annotation)
      return
    }

    // The target was clicked in the text. Moving the text again would pull it out from under the
    // user, so the sidebar is the side that moves - far enough for the card to sit at the height of
    // the clicked target, the way the aligned list positions it there.
    if (selectedAnnotation.origin === 'text') {
      alignSidebarToAnnotation(panelEl, selectedAnnotation.annotation)
      return
    }

    // Everything else - cross ref, bookmarking, a selectedAnnotationId in the config - scrolls the
    // sidebar to the card and waits for that scroll to end before aligning the text.
    handleExternalSelection(panelEl, selectedAnnotation.annotation, controller.signal)

    return () => controller.abort()
  }, [selectedAnnotation, filteredAnnotations])

  if (filteredAnnotations.length > 0) return <div className={`transition-opacity pt-4`}>
    {filteredAnnotations.map(a => <Annotation
      data={a}
      key={a.id}
    />)}
  </div>
}

export default AnnotationsList
