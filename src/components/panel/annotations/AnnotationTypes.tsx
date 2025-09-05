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

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current
      const scrollAmount = direction === 'left' ? -clientWidth : clientWidth
      scrollRef.current.scrollTo({
        left: scrollLeft + scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollWidth, clientWidth } = scrollRef.current
      setShowButtons(scrollWidth > clientWidth)
    }
  }

  useEffect(() => {
    checkScroll()
  }, [typesMap])

  return <div className="relative flex justify-center w-100 gap-1">
    { showButtons && <Button
      variant="ghost"
      size="icon"
      className="rounded-full"
      onClick={() => scroll('left')}
    >
      <ChevronLeft className="h-6 w-6" />
    </Button> }
    { Object.keys(typesMap).length > 1 && <div ref={scrollRef} data-cy="annotation-types" className="flex flex-nowrap gap-2 overflow-x-auto max-w-[75%]">
      { Object.keys(typesMap).map((type: string, i) => <AnnotationType type={type} key={'annotation-type-' +i} />)}
    </div> }

    { showButtons && <Button
      variant="ghost"
      size="icon"
      className=" rounded-full"
      onClick={() => scroll('right')}
    >
      <ChevronRight className="h-6 w-6" />
    </Button> }
  </div>
}

export default AnnotationTypes
