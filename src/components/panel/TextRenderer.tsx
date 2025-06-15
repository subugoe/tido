import { FC, useEffect, useRef } from 'react'
import DOMPurify from 'dompurify'

import { usePanel } from '@/contexts/PanelContext.tsx'

interface Props {
  htmlString: string
}

import React from 'react'

const GenericElement = ({ tagName, props, children, isHighlighted }) => {
  const Tag = tagName

  return (
    <Tag
      {...props}
      className={
        (props.className || '') +
        (isHighlighted ? ' bg-yellow-200 relative cursor-pointer' : '')
      }
      onMouseEnter={isHighlighted ? props.onMouseEnter : props.onMouseEnter}
      onClick={isHighlighted ? props.onClick : props.onClick}
    >
      {children}
      {isHighlighted && (
        <div className="text-sm p-2">You hovered over a target</div>
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
      props[attr.name === 'class' ? 'className' : attr.name] = attr.value
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



const TextRenderer: FC<Props> = ({ htmlString }) => {
  const ref = useRef<HTMLInputElement>(null)
  const { panelId } = usePanel()
  const selectors = ['#N1l4l2l2l4l4l4', '#N1l4l2l4l4l4l2l5']
  const onClickTarget = () => {}

  useEffect(() => {
    // if (!ref?.current) return
    //
    // const scrollContainer = ref.current as HTMLElement
    // const parent = scrollContainer.parentElement
    // if (!parent) return
    //
    // scrollContainer.innerHTML = DOMPurify.sanitize(htmlString)
  }, [htmlString])

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
