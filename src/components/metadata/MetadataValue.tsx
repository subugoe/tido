import React, { FC } from 'react'

import { usePanel } from '@/contexts/PanelContext.tsx'
import { parseStyleString } from '@/utils/html-to-react.ts'

interface MetadataValueProps {
  value?: string
}

const MetadataValue: FC<MetadataValueProps> = ( { value } ) => {
  const { usePanelTranslation } = usePanel()
  const { t } = usePanelTranslation()

  const convertNodeToReact = (node: ChildNode, key: string | number): React.ReactNode => {
    if (node.nodeType === Node.TEXT_NODE) {
      return t(node.textContent || '')
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
      { ...props, className: (props.className as string) || '' },
      ...childrenArray
    )
  }


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


  return <div className="ml-1 mb-4">
    {children}
  </div>
}

export default MetadataValue

