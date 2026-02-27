import React, { FC } from 'react'
import { parseStyleString } from '@/utils/html-to-react.ts'

interface Props {
  body: AnnotationBody
}

const convertNodeToReact = (node: ChildNode, key: string | number): React.ReactNode => {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent
  }

  if (node.nodeType !== Node.ELEMENT_NODE) return null

  const element = node as Element
  const tagName = element.tagName.toLowerCase()
  const children = Array.from(node.childNodes).map((child, i) =>
    convertNodeToReact(child, `${key}-${i}`)
  )

  const props: Record<string, unknown> = {}
  for (const attr of element.attributes) {
    if (attr.name === 'style') {
      props.style = parseStyleString(attr.value)
    } else {
      props[attr.name === 'class' ? 'className' : attr.name] = attr.value
    }
  }

  const childrenArray = children as React.ReactElement[]
  return React.createElement(
    tagName,
    { key: 'node-' + key, ...props, className: (props.className as string) || '' },
    ...childrenArray
  )
}

const AnnotationContent: FC<Props> = React.memo(({ body }) => {
  const { value } = body
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
