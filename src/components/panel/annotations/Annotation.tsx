import React, { FC, useRef, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { parseStyleString } from '@/utils/html-to-react.ts'
import { Badge } from '@/components/ui/badge.tsx'

interface Props {
  data: Annotation
  top: number
}

const convertNodeToReact = (node, key) => {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent
  }

  if (node.nodeType !== Node.ELEMENT_NODE) return null

  const Tag = node.tagName.toLowerCase()
  const children = Array.from(node.childNodes).map((child, i) =>
    convertNodeToReact(child, `${key}-${i}`)
  )

  const props = {}
  for (const attr of node.attributes) {
    if (attr.name === 'style') {
      props.style = parseStyleString(attr.value)
    } else {
      props[attr.name === 'class' ? 'className' : attr.name] = attr.value
    }
  }

  return <Tag
    {...props}
    className={props.className || ''}
  >
    {children}
  </Tag>
}

const Annotation: FC<Props> = React.memo(({ data, top }) => {
  const {  setHoveredAnnotation, selectedAnnotation, setSelectedAnnotation } = usePanel()
  const ref = useRef(null)
  const [isHovered, setIsHovered] = useState(false)

  function handleClick() {
    setSelectedAnnotation(data)
  }

  function handleMouseEnter() {
    setIsHovered(true)
    setTimeout(() => {
      setHoveredAnnotation(data.id)
    }, 100)
  }
  function handleMouseLeave() {
    setIsHovered(false)
    setTimeout(() => {
      setHoveredAnnotation(null)
    }, 100)
  }

  function isSelected() {
    return selectedAnnotation && selectedAnnotation.id === data.id
  }

  const parsedDom = React.useMemo(() => {
    const parser = new DOMParser()
    if (typeof data.body.value !== 'string') return null
    return parser.parseFromString(`${data.body.value}`, 'text/html')
  }, [data.body.value])

  const children = React.useMemo(() => {
    if (!parsedDom) return
    return Array.from(parsedDom.body.childNodes).map((node, i) =>
      convertNodeToReact(node, i)
    )
  }, [parsedDom])

  return <>
    <div
      ref={ref}
      data-annotation={data.id}
      {...(isSelected() ? { 'data-selected': true } : {})}
      className={`absolute w-[calc(100%-2rem)] flex flex-col px-3 py-2 rounded-lg border border-border
      ${isSelected() ? 'shadow-md bg-background' : 'bg-accent border-border hover:bg-background cursor-pointer'}
      ${isHovered ? 'border-primary' : ''} transition-all max-h-16 overflow-hidden`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ top }}
    >
      <Badge variant="secondary" className="mb-1">{ data.body['x-content-type'] }</Badge>
      {children}
    </div>
  </>
})

export default Annotation
