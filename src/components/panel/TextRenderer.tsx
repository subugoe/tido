import { FC, useEffect, useRef, useState } from 'react'

import { usePanel } from '@/contexts/PanelContext.tsx'

interface Props {
  htmlString: string
  aGroup?: boolean
}

import React from 'react'

const GenericElement = ({ tagName, props, children, isHighlighted }) => {
  const Tag = tagName
  const [isHovered, setIsHovered] = useState(false)

  function onClick() {
    if (isHighlighted) {
      props.onClick()
    }
  }

  return (
    <Tag
      {...props}
      className={
        (props.className || '') +
        (isHighlighted ? ' bg-gray-200 relative cursor-pointer' : '')
      }
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {children}
      {isHovered && isHighlighted && (
        <div className="absolute text-sm p-2 bg-white border border-border shadow-sm">You hovered over a target</div>
      )}
    </Tag>
  )
}

const convertNodeToReact = (node, key, matches, onClickTarget) => {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent
  }

  if (node.nodeType === Node.ELEMENT_NODE) {
    const children = Array.from(node.childNodes).map((child, i) =>
      convertNodeToReact(child, `${key}-${i}`, matches, onClickTarget)
    )

    const props = {}
    for (const attr of node.attributes) {
      if (attr.name === 'style') {
        props.style = parseStyleString(attr.value)
      } else {
        props[attr.name === 'class' ? 'className' : attr.name] = attr.value
      }
    }

    const isHighlighted = matches.includes(node)
    if (isHighlighted) {
      props.onClick = () => onClickTarget(node)
    }

    return (
      <GenericElement
        key={key}
        tagName={node.tagName.toLowerCase()}
        props={props}
        isHighlighted={isHighlighted}
      >
        {children}
      </GenericElement>
    )
  }

  return null
}

const parseStyleString = (styleString) => {
  return styleString
    .split(';')
    .filter((rule) => rule.trim() !== '')
    .reduce((styleObj, rule) => {
      const [key, value] = rule.split(':')
      if (!key || !value) return styleObj

      const camelKey = key
        .trim()
        .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())

      styleObj[camelKey] = value.trim()
      return styleObj
    }, {})
}


const TextRenderer: FC<Props> = ({ htmlString }) => {
  const ref = useRef<HTMLInputElement>(null)
  const { panelId, panelState } = usePanel()

  let selectors = []
  if (panelState.annotations) {
    selectors = panelState.annotations.map(a => a.target[0].selector.value)
  }

  const onClickTarget = () => {}

  useEffect(() => {
    console.log('text renderer mounted')
  }, [])

  // Step 1: Memoize the parsed DOM
  const parsedDom = React.useMemo(() => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlString, 'text/html')
    return doc
  }, [htmlString])

  // Step 2: Re-render React tree whenever selectors change
  const reactElements = React.useMemo(() => {
    const matches = selectors.flatMap((selector) =>
      Array.from(parsedDom.body.querySelectorAll(selector))
    )

    return Array.from(parsedDom.body.childNodes).map((node, i) =>
      convertNodeToReact(node, i, matches, onClickTarget)
    )
  }, [parsedDom, selectors])


  return <div data-panel={panelId} ref={ref} className="h-full relative overflow-auto px-3">
    { reactElements }
  </div>
}

export default TextRenderer
