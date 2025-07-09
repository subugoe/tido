import { FC, memo, useEffect, useRef, useState } from 'react'

import { usePanel } from '@/contexts/PanelContext.tsx'

interface Props {
  htmlString: string
  aGroup?: boolean
  onReady?: () => void
}

import React from 'react'
import { parseStyleString } from '@/utils/html-to-react.ts'
const END_CLASS = 'tido-text-end'


const GenericElement = ({ tagName, props, children, isHighlighted, isSelected = false }) => {
  const Tag = tagName
  const [isHovered, setIsHovered] = useState(false)
  function onClick() {
    if (isHighlighted) {
      props.onClick()
    }
  }

  if (tagName === 'br') {
    return <br />
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
    </Tag>
  )
}

const convertNodeToReact = (node: HTMLElement, key, matches, onClickTarget, isSelected = false) => {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent
  }

  if (node.nodeType !== Node.ELEMENT_NODE) return null

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
      isSelected={isSelected}
    >
      {children}
    </GenericElement>
  )
}

const TextRenderer: FC<Props> = memo(({ htmlString }) => {
  const textWrapperRef = useRef<HTMLInputElement>(null)
  const { panelState, updatePanel } = usePanel()
  const [selectors, setSelectors] = useState([])

  useEffect(() => {
    if (panelState.annotations) {
      setSelectors(panelState.annotations.map(a => a.target[0].selector.value))
    }
  }, [panelState.annotations])

  const onClickTarget = () => {}

  const parsedDom = React.useMemo(() => {
    const observer = new MutationObserver(() => {
      const lastChild = document.querySelector(`.${END_CLASS}`)
      if (lastChild) {
        observer.disconnect()
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    const parser = new DOMParser()
    return parser.parseFromString(`${htmlString}<span class="${END_CLASS}"></span>`, 'text/html')
  }, [htmlString])

  const reactElements = React.useMemo(() => {
    const matchedSelectors = []

    const matches = selectors.flatMap((selector) => {
      const matchedNodes = Array.from(parsedDom.body.querySelectorAll(selector))
      if (matchedNodes.length > 0) matchedSelectors.push(selector)
      return matchedNodes
    })

    updatePanel({ annotationSelectors: matchedSelectors })

    return Array.from(parsedDom.body.childNodes).map((node, i) =>
      convertNodeToReact(node as HTMLElement, i, matches, onClickTarget)
    )
  }, [parsedDom, selectors])

  return <div className="relative">
    <div ref={textWrapperRef}>
      { reactElements }
    </div>
  </div>
})

export default TextRenderer
