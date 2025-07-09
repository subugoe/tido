import React, { FC, useEffect, useRef } from 'react'
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
  const { panelId } = usePanel()
  const ref = useRef(null)
  const target = document.getElementById(panelId).querySelector(data.target[0].selector.value)

  useEffect(() => {
    onMount(target, ref.current, data)
  }, [])

  function handleClick() {
    onClick(ref.current, data)
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
      className={`absolute flex-flex-col bg-background p-2 border border-border rounded-lg ${selected ? 'shadow-md' : 'shadow-sm'} transition-all max-h-16 overflow-hidden`}
      onClick={handleClick}
      style={{ top }}
    >
      {children}
    </div>
  </>
})

export default Annotation
