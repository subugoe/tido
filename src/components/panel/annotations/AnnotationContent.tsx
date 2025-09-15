import React, { FC } from 'react'
import { parseStyleString } from '@/utils/html-to-react.ts'

interface Props {
  value: string
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
    key={'node-' + key}
    {...props}
    className={props.className || ''}
  >
    {children}
  </Tag>
}

const AnnotationContent: FC<Props> = React.memo(({ value }) => {

  const parsedDom = React.useMemo(() => {
    const parser = new DOMParser()
    if (typeof value !== 'string') return null
    return parser.parseFromString(`${value}`, 'text/html')
  }, [value])

  const children = React.useMemo(() => {
    if (!parsedDom) return
    return Array.from(parsedDom.body.childNodes).map((node, i) =>
      convertNodeToReact(node, i)
    )
  }, [parsedDom])

  return <>
    <div>{children}</div>
  </>
})

export default AnnotationContent
