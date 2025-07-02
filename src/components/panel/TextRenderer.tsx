import { FC, memo, useEffect, useRef, useState } from 'react'

import { usePanel } from '@/contexts/PanelContext.tsx'

interface Props {
  htmlString: string
  aGroup?: boolean
}

import React from 'react'
import { parseStyleString } from '@/utils/html-to-react.ts'
import { isAutoScrolling, removeAutoScrolling, syncScrollPosition } from '@/utils/scroll.ts'
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

let scrollTimeout

const TextRenderer: FC<Props> = memo(({ htmlString }) => {
  const textWrapperRef = useRef<HTMLInputElement>(null)
  const scrollContainerRef = useRef(null)
  const { panelId, panelState, updatePanel } = usePanel()

  let selectors = []
  if (panelState.annotations) {
    selectors = panelState.annotations.map(a => a.target[0].selector.value)
  }

  const onClickTarget = () => {}

  useEffect(() => {
    if (!scrollContainerRef.current) return
    console.log('TextRenderer mount')
    const onScroll = () => {
      const target = document.querySelector(`[data-annotation-panel="${panelId}"]`)
      if (isAutoScrolling(scrollContainerRef.current)) return
      syncScrollPosition(scrollContainerRef.current, target)

      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout((event) => {
        removeAutoScrolling(document.querySelector(`[data-annotation-panel="${panelId}"]`))
      }, 150)
    }
    scrollContainerRef.current.addEventListener('scroll', onScroll)

    return () => {
      console.log('cleanup htmlstring')
      updatePanel({ textRendered: false })
      if (scrollContainerRef.current) scrollContainerRef.current.removeEventListener('scroll', onScroll)
    }
  }, [])

  // Step 1: Memoize the parsed DOM
  const parsedDom = React.useMemo(() => {
    console.log('updating htmlstring')
    updatePanel({ textRendered: false })

    const observer = new MutationObserver(() => {
      const lastChild = document.querySelector(`.${END_CLASS}`)
      if (lastChild) {
        console.log('Last child is now in the DOM')
        updatePanel({ textRendered: true })
        observer.disconnect()
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    const parser = new DOMParser()
    const doc = parser.parseFromString(`${htmlString}<span class="${END_CLASS}"></span>`, 'text/html')
    return doc
  }, [htmlString])

  // Step 2: Re-render React tree whenever selectors change
  const reactElements = React.useMemo(() => {
    const matches = selectors.flatMap((selector) =>
      Array.from(parsedDom.body.querySelectorAll(selector))
    )

    const comps = Array.from(parsedDom.body.childNodes).map((node, i) =>
      convertNodeToReact(node, i, matches, onClickTarget)
    )

    return comps
  }, [parsedDom, selectors])


  return <div ref={scrollContainerRef} data-panel={panelId} className="relative h-full overflow-auto px-3">
    <div ref={textWrapperRef}>
      { reactElements }
    </div>
  </div>
})

export default TextRenderer
