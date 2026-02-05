import { FC, useEffect, useRef, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import Annotation from '@/components/panel/annotations/Annotation.tsx'
import { getFilteredAnnotations } from '@/utils/annotations.ts'

const ANNOTATION_GAP = 5

const AlignAnnotationsList: FC = () => {
  const { panelId, matchedAnnotationsMap, selectedAnnotation, setSelectedAnnotation, getSidebarScroller } = usePanel()

  // Elements represents an array of several infos for each visible annotation. These infos are needed to update the top
  // position of each annotation.
  const [elements, setElements] = useState([])

  const filteredAnnotations = getFilteredAnnotations(matchedAnnotationsMap)

  const [textContainer] = useState(document.getElementById(panelId).querySelector(`[data-text-wrapper]`) as HTMLElement)
  const [yMap, setYMap] = useState({})
  const [loading, setLoading] = useState(false)
  const [height, setHeight] = useState(0)


  const ref = useRef(null)

  function isClickedElAnnotation(clickedEl: HTMLElement) {
    if (clickedEl.getAttribute('data-annotation')) return true
    return clickedEl.parentElement?.getAttribute('data-annotation')
  }

  useEffect(() => {
    const scroller = getSidebarScroller()
    scroller.start()

    return () => {
      scroller.stop()
    }
  }, [])

  useEffect(() => {
    trackTopChange(elements, 0)

    const panelEl = document.getElementById(panelId) as HTMLElement
    const annotationsSideBarEl = panelEl?.querySelector('div[data-sidebar-container="true"]') as HTMLElement

    async function deselectAnnotationOnOutsideClick(event: MouseEvent) {
      // if we click at an annotation - we return false
      if (isClickedElAnnotation(event.target as HTMLElement)) return
      setSelectedAnnotation(null)
    }

    annotationsSideBarEl?.addEventListener('click', deselectAnnotationOnOutsideClick)

    // Cleanup on unmount
    return () => {
      annotationsSideBarEl?.removeEventListener('click', deselectAnnotationOnOutsideClick)
    }
  }, [selectedAnnotation])

  function getAnnotationsBelow(elements, annotationId) {
    const index = elements.findIndex(el => el.annotation.id === annotationId)
    if (index === -1) return []

    return elements.slice(index + 1).map(element => element.el)
  }



  function onAnnotationToggle(annotationId, element, finalHeight, translateY) {
    // Step 3: Push annotations below FIRST

    // we transition the body of Annotation
    // element: annotationBodyEl
    // finalHeight: final Height of bodyEl
    const newElements = [...elements]

    const annotationEl = elements.find(el => el.annotation.id === annotationId)[0]

    const annotationsBelow = getAnnotationsBelow(elements, annotationId)

    const index = elements.findIndex(el => el.annotation.id === annotationId)
    console.log('translate Y', translateY)

    for(let i = 0; i < newElements.length ; i++) {
      if (i > index) {
        if (i===index+1) console.log('prev desired y of next element', newElements[i].desiredY)
        newElements[i].desiredY += translateY

      }
    }

    console.log('new elements on Annotation Toggle', newElements)


    setElements(newElements)

    console.log('shifting annotations below')

    annotationsBelow.forEach(ann => {
      ann.style.top += translateY   //`translateY(${translateY}px)`
      ann.style.transition = 'transform ease-out'
    })

    console.log('shifted annotations below')

    // Step 4: Expand the annotation (slightly delayed or same time)
    setTimeout(() => {
      element.style.height = finalHeight + 'px'
      element.style.transition = 'height 100ms ease-out'
    },0)


    // Step 5: Update trackTopChange() after animation
    setTimeout(() => {
      console.log('track top change')
      trackTopChange(newElements, index, 'expand') // Recalculate final positions
    }, 1000)
  }

  function trackTopChange(currentElements, index, action='none') {
    // This function calculates all top positions from all currently visible annotations and sets them as "yMap" where
    // the key is the annotation id and the value is the top value.

    if (!currentElements) return
    if (currentElements.length === 0) return

    //const newElements = [...currentElements]

    if (currentElements.length === 0) return


    console.log('current Elements', currentElements)
    console.log('expanded element', currentElements[index])

    // Set the desiredY according to current target clean positions (clean = actual position in the text)
    for (let i = 0; i < currentElements.length; i++) {
      currentElements[i].desiredY = currentElements[i].target.getBoundingClientRect().top - textContainer.getBoundingClientRect().top
    }

    currentElements.sort((a, b) => a.desiredY - b.desiredY)


    for (let i = 0; i < currentElements.length; i++) {
      const annotationEl = currentElements[i]
      const lastHeight = i === 0 ? 0 : currentElements[i - 1].el.offsetHeight
      const lastY = i === 0 ? 0 : currentElements[i - 1].desiredY


      // The minimum top value needed if we want to place the current annotation right under the last one.
      const minY = lastY + lastHeight + ANNOTATION_GAP



      // Next, we decide if that minimum value is even needed or if the desiredY is more below and therefore should be used instead.
      const actualY = i === 0 ? annotationEl.desiredY : Math.max(annotationEl.desiredY, minY)

      if (i === index) {
        console.log('expanded annot last y', lastY)
        console.log('expanded annotation actualy y', actualY)
      }

      if (i === index + 1) {
        console.log('last y', lastY)
        console.log('last Height', lastHeight)
        console.log('min y', minY)
        console.log('desired y', annotationEl.desiredY)
        console.log('actual Y', actualY)
      }

      if (action !== 'none') {
        console.log('applied track top change')
      }


      if (selectedAnnotation && annotationEl.annotation.id === selectedAnnotation.id && actualY !== annotationEl.desiredY) {
        // If this is a selectedAnnotation, and it has some other annotations above
        // (which caused the current to move down, for example if the selected annotation is in the same row with multiple other annotations),
        // we want to move those annotations further above, so our selected one can be placed to the desiredY
        moveBefore(i)
        continue
      }
      annotationEl.desiredY = actualY
    }

    const map = currentElements.reduce((acc, cur) => {
      acc[cur.annotation.id] = cur.desiredY
      return acc
    }, {})

    setYMap(map)
    //setElements(newElements)
  }

  function moveBefore(index: number) {
    if (index === 0) return
    const cur = elements[index]
    const prev = elements[index - 1]

    const prevEndY = prev.desiredY + prev.el.offsetHeight + ANNOTATION_GAP

    prev.desiredY = Math.min(prevEndY, cur.desiredY - (prev.el.offsetHeight + ANNOTATION_GAP))
    moveBefore(index - 1)
  }

  useEffect(() => {
    // Set height equal to textContainer height since the text can be way longer
    // than the position of the last annotation.
    setHeight(textContainer.getBoundingClientRect().height)

    if (filteredAnnotations?.length === 0) {
      setElements([])
    } else {
      const annotationEls = Array.from(ref.current?.childNodes ?? [])
      const _elements = annotationEls.map(el => {
        const annotation = filteredAnnotations.find(a => a.id === (el as HTMLElement).getAttribute('data-annotation'))
        if (!annotation) return
        const target: HTMLElement = document.getElementById(panelId).querySelector((annotation.target[0].selector as CssSelector).value)
        return {
          target,
          el,
          desiredY: target.offsetTop,
          annotation
        }
      })
      setElements(_elements)
    }

    return () => {
      setLoading(true)
      setElements([])
    }
  }, [matchedAnnotationsMap])

  useEffect(() => {
    let resizeObserver
    let timeout
    if (elements.length > 0) {
      resizeObserver = new ResizeObserver(entries => {
        if (entries[0].contentRect.width > 0) trackTopChange(elements, 7)
      })
      resizeObserver.observe(textContainer)
    }

    setLoading(false)

    return () => {
      if (resizeObserver) resizeObserver.disconnect()
      if (timeout) clearTimeout(timeout)
    }
  }, [elements])


  if (filteredAnnotations.length > 0)
    return <div
      ref={ref}
      className={`transition-opacity ${loading ? 'opacity-0' : 'opacity-100'}`}
      style={{ height: `${height}px` }}
    >
      {filteredAnnotations.map(a => <Annotation
        data={a}
        key={a.id}
        top={yMap[a.id]}
        onToggle={onAnnotationToggle}
      />)}
    </div>
}

export default AlignAnnotationsList
