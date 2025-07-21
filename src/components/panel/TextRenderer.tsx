import {
  ComponentPropsWithoutRef, ElementType,
  FC,
  memo,
  ReactNode,
  useEffect,
  useRef,
  useState
} from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import React from 'react'
import { parseStyleString } from '@/utils/html-to-react.ts'
const END_CLASS = 'tido-text-end'

interface Props {
  htmlString: string
  aGroup?: boolean
  onReady?: () => void
}

type GenericElementProps<T extends ElementType> = {
  tagName: T
  props?: ComponentPropsWithoutRef<T>
  children: ReactNode
  isHighlighted: boolean
} & ComponentPropsWithoutRef<T>

const GenericElement = memo(<T extends ElementType>({ tagName: Tag, props, children, isHighlighted }: GenericElementProps<T>)  => {
  const { hoveredAnnotation, setHoveredAnnotation, selectedAnnotation } = usePanel()
  const [isHovered, setIsHovered] = useState(false)
  function onClick() {
    if (isHighlighted) {
      props.onClick(props['data-annotation'])
    }
  }

  function handleMouseEnter() {
    if (isHighlighted) {
      setIsHovered(true)
      setHoveredAnnotation(props['data-annotation'])
    }
  }

  function handleMouseLeave() {
    setIsHovered(false)
    setHoveredAnnotation(null)
  }

  useEffect(() => {
    if (!hoveredAnnotation) setIsHovered(false)
    else if (hoveredAnnotation === props['data-annotation']) setIsHovered(true)
  }, [hoveredAnnotation])

  if (Tag === 'br') {
    return <br />
  }

  return (
    <Tag
      {...props}
      className={
        (props.className || '') +
        (isHighlighted ? ' bg-gray-200 relative cursor-pointer' : '') +
        (isHovered ? ' bg-primary/20' : '') +
        (selectedAnnotation && selectedAnnotation.id === props['data-annotation'] ? ' bg-primary/40' : '')
      }
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {children}
    </Tag>
  )
})

const convertNodeToReact = (node: HTMLElement, key, matches, onClickTarget) => {
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

  const annotationIds = Object.keys(matches).reduce((acc, cur) => {
    const isMatch = matches[cur].includes(node)
    return isMatch ? [...acc, cur] : acc
  }, [])

  if (annotationIds.length > 0) {
    props['data-annotation'] = annotationIds.join(',')
    props.onClick = onClickTarget
  }

  return (
    <GenericElement
      key={key}
      tagName={node.tagName.toLowerCase()}
      props={props}
      isHighlighted={annotationIds.length > 0}
    >
      {children}
    </GenericElement>
  )
}

const TextRenderer: FC<Props> = memo(({ htmlString }) => {
  const textWrapperRef = useRef<HTMLInputElement>(null)
  const { panelState, setSelectedAnnotation, setFilteredAnnotations, showTextOptions, updatePanel } = usePanel()

  const onClickTarget = (id: string) => {
    const annotation = panelState.annotations.find(a => a.id === id)
    if (annotation) {
      if (!panelState.annotationsOpen) {
        updatePanel({ annotationsOpen: true })
      }
      setSelectedAnnotation(annotation)
    }
  }

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

  const matchedAnnotationsMap = React.useMemo(() => {
    if (!panelState.annotations) return {}
    return panelState.annotations.reduce((acc, cur) => {
      const matchedNodes = Array.from(parsedDom.body.querySelectorAll(cur.target[0].selector.value))
      if (matchedNodes.length > 0) {
        acc[cur.id] = matchedNodes
      }
      return acc
    }, {})
  }, [parsedDom, panelState.annotations])

  useEffect(() => {
    const filteredAnnotations = panelState.annotations?.filter(a => matchedAnnotationsMap[a.id]) ?? []
    setFilteredAnnotations(filteredAnnotations)
  }, [matchedAnnotationsMap])

  const reactElements = React.useMemo(() => {
    return Array.from(parsedDom.body.childNodes).map((node, i) =>
      convertNodeToReact(node as HTMLElement, i, matchedAnnotationsMap, onClickTarget)
    )
  }, [matchedAnnotationsMap])

  return <div className={`relative ${showTextOptions ? 'pt-12' : ''}`}>
    <div ref={textWrapperRef}>
      { reactElements }
    </div>
  </div>
})

export default TextRenderer
