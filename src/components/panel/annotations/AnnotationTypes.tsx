import { FC, useEffect, useRef, useState } from 'react'
import AnnotationType from '@/components/panel/annotations/AnnotationType.tsx'
import { Button } from '@/components/ui/button.tsx'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  typesMap: AnnotationTypesDict
}

const AnnotationTypes: FC<Props> = ({ typesMap }) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showButtons, setShowButtons] = useState(false)
  const [scrolledToStart, setScrolledToStart] = useState(true)
  const [scrolledToEnd, setScrolledToEnd] = useState(false)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const listener = () => {
      updateScrollState()
    }
    el.addEventListener('scrollend', listener)
    return () => {
      if (!el) return
      el.removeEventListener('scrollend', listener)
    }
  }, [scrollRef.current])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current
      const multiplier = 0.2
      const scrollAmount = (direction === 'left' ? -clientWidth  : clientWidth) * multiplier
      scrollRef.current.scrollTo({
        left: scrollLeft + scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  const updateScrollState = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setShowButtons(scrollWidth > clientWidth)
      setScrolledToStart(scrollLeft <= 0)
      setScrolledToEnd(scrollLeft + clientWidth >= scrollWidth - 1) // small tolerance
    }
  }

  useEffect(() => {
    updateScrollState()
  }, [typesMap])

  return <>
    {Object.keys(typesMap).length > 1 && <div className="relative flex justify-center w-100 gap-1">
      { showButtons && <Button
        variant="ghost"
        size="icon"
        className="rounded-full"
        onClick={() => scroll('left')}
        disabled={scrolledToStart}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button> }
      { Object.keys(typesMap).length > 0 && <div
        ref={scrollRef}
        data-cy="annotation-types"
        className="flex flex-nowrap gap-2 overflow-x-auto max-w-[75%] pb-1"
      >
        { Object.keys(typesMap).map((type: string, i) => <AnnotationType type={type} key={'annotation-type-' +i} />)}
      </div> }

      { showButtons && <Button
        variant="ghost"
        size="icon"
        className=" rounded-full"
        onClick={() => scroll('right')}
        disabled={scrolledToEnd}
      >
        <ChevronRight className="h-6 w-6" />
      </Button> }
    </div>
    }
  </>
}

export default AnnotationTypes
