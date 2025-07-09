import React, { FC, useEffect, useRef, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { parseStyleString } from '@/utils/html-to-react.ts'

interface Props {
  data: Annotation
  onMount: (target: HTMLElement, el: HTMLElement, annotation: Annotation) => void
  onClick: (el: HTMLElement, a: Annotation) => void
  selected: boolean
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

const Annotation: FC<Props> = React.memo(({ data, onMount, onClick, selected, top }) => {
  const { panelId, hoveredAnnotation, setHoveredAnnotation } = usePanel()
  const ref = useRef(null)
  const target = document.getElementById(panelId).querySelector(data.target[0].selector.value)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    onMount(target, ref.current, data)
  }, [])

  useEffect(() => {
    if (!hoveredAnnotation) setIsHovered(false)
    else if (hoveredAnnotation === data.id) setIsHovered(true)
  }, [hoveredAnnotation])

  function handleClick() {
    onClick(ref.current, data)
  }

  function handleMouseEnter() {
    setHoveredAnnotation(data.id)
  }
  function handleMouseLeave() {
    setHoveredAnnotation(null)
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
      className={`absolute flex-flex-col p-2 rounded-lg border border-border
      ${selected ? 'shadow-md bg-background' : 'bg-accent border-border hover:bg-background cursor-pointer'}
      ${isHovered ? 'border-primary' : ''} transition-all max-h-16 overflow-hidden`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ top }}
    >
      {children}
    </div>
  </>
})

export default Annotation
