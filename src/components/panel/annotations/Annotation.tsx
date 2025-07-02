import React, { FC, useEffect, useRef, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { Tag } from 'lucide-react'
import { parseStyleString } from '@/utils/html-to-react.ts'

interface Props {
  data: Annotation
  onMount: (target: HTMLElement, el: HTMLElement) => void
  onClick: (el: HTMLElement) => void
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

const Annotation: FC<Props> = React.memo(({ data, onMount, onClick }) => {
  const { panelId } = usePanel()
  const ref = useRef(null)
  const target = document.getElementById(panelId).querySelector(data.target[0].selector.value)
  const [isSelected, setIsSelected] = useState(false)

  useEffect(() => {
    onMount(target, ref.current)
  }, [])

  function handleClick() {
    onClick(ref.current)
  }

  useEffect(() => {
    if (!ref.current) return
    setIsSelected(!!ref.current.dataset.highlighted)

  }, [ref.current?.dataset.highlighted])

  const parsedDom = React.useMemo(() => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(`${data.body.value}`, 'text/html')
    return doc
  }, [data.body.value])

  const children = React.useMemo(() => {
    return Array.from(parsedDom.body.childNodes).map((node, i) =>
      convertNodeToReact(node, i)
    )
  }, [parsedDom])

  return <>
    <div
      ref={ref}
      className={`absolute flex-flex-col bg-background p-2 border border-border rounded-lg ${isSelected ? 'shadow-md' : 'shadow-sm'} transition-all`}
      onClick={handleClick}
    >
      {children}
    </div>
  </>
})

export default Annotation
