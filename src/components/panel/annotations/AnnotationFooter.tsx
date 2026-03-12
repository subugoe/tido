import React, { FC, useRef, useState, useEffect } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import Annotation from '@/components/panel/annotations/Annotation.tsx'

interface Props {
  nestedAnnotations: Annotation[],
  showExpanded: boolean,
  onExpand?: (e: React.MouseEvent<HTMLDivElement>, expandType: string) => void,
  onCollapse?: () => void
}

const AnnotationFooter: FC<Props> = ({ nestedAnnotations, showExpanded, onExpand, onCollapse }) => {

  const [expanded, setExpanded] = useState(false)
  const nestedAnnotationsRef = useRef(null)

  useEffect(() => {
    setExpanded(showExpanded)
  }, [showExpanded])


  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation()
    if (!expanded) {
      setExpanded(true)
      onExpand(e, 'nested-annotations')
      return
    }
    setExpanded(false)
    onCollapse()
  }

  useEffect(() => {
    if (showExpanded) setExpanded(true)
  }, [showExpanded])



  return <div className="w-full h-full flex flex-col border-t-[1px] border-gray-400 bg-gray-100">
    <div className="flex footer-stripe pr-4 py-1 justify-end hover:bg-gray-200 hover:cursor-pointer" onClick={(e) => handleClick(e)}>
      <span className="p-0.5 text-sm">{nestedAnnotations.length} nested {nestedAnnotations.length > 1 ? 'annotations' : 'annotation'} </span>
      {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
    </div>
    {expanded && <div className="nested-annotations border-l-2 ml-[2px] border-gray-400 pl-2  mt-2 flex flex-col gap-1 w-full h-fit" ref={nestedAnnotationsRef}>
      {nestedAnnotations.map((annotation) => <Annotation key={annotation.id} data={annotation} isNested={true} /> )}
    </div>
    }
  </div>
}

export default AnnotationFooter
