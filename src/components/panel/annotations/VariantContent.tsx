import React, { FC } from 'react'
import { parseStyleString } from '@/utils/html-to-react.ts'
import WitnessChip from '@/components/panel/annotations/WitnessChip.tsx'

interface Props {
  value: AnnotationVariantValue
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

const VariantContent: FC<Props> = React.memo(({ value }) => {

  const parsedDom = React.useMemo(() => {
    const parser = new DOMParser()
    if (typeof value === 'string') return null
    return parser.parseFromString(`${value.entry}`, 'text/html')
  }, [value])

  const children = React.useMemo(() => {
    if (!parsedDom) return
    return Array.from(parsedDom.body.childNodes).map((node, i) =>
      convertNodeToReact(node, i)
    )
  }, [parsedDom])



  return <div className="flex">
    <div>{children}</div>
    <div className="ml-auto flex gap-1">
      {value.witnesses.map((witness, i) => <WitnessChip idno={witness} key={'witness' + i} />)}
    </div>
  </div>
})

export default VariantContent
