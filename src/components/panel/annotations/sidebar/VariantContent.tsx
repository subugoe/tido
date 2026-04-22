import React, { FC } from 'react'
import { parseStyleString } from '@/utils/html-to-react.ts'
import WitnessChip from '@/components/panel/annotations/sidebar/WitnessChip.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'

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

const VariantContent: FC<Props> = React.memo(({ body }) => {
  const { value, witnesses } = body
  const { selectedAnnotationTypes } = usePanel()

  const filteredWitnesses = selectedAnnotationTypes['Variant'] ? witnesses.filter(witness => selectedAnnotationTypes['Variant'].includes(witness)) : witnesses

  const parsedDom = React.useMemo(() => {
    const parser = new DOMParser()
    return parser.parseFromString(`${value}`, 'text/html')
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
      {filteredWitnesses.map((witness, i) => <WitnessChip idno={witness} key={'witness' + i} />)}
    </div>
  </div>
})

export default VariantContent
