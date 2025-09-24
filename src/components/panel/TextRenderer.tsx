import {
  ComponentPropsWithoutRef, ElementType,
  FC,
  memo,
  ReactNode,
  useEffect,
  useRef,
  useState
} from 'react'


import React from 'react'

import { usePanel } from '@/contexts/PanelContext.tsx'

import CrossRefLink from '@/components/panel/CrossRef/CrossRefLink.tsx'

import { getExtendedFullAnnotationsTypesMap, isSelected } from '@/utils/annotations.ts'
import { scrollIntoViewIfNeeded } from '@/utils/dom.ts'
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
  children: ReactNode,
  node: HTMLElement,
  isHighlighted: boolean,
} & ComponentPropsWithoutRef<T>

const GenericElement = memo(<T extends ElementType>({ tagName: Tag, props, children, node, isHighlighted }: GenericElementProps<T>)  => {
  const { hoveredAnnotation, setHoveredAnnotation, selectedAnnotation, annotationsMode } = usePanel()
  const [isHovered, setIsHovered] = useState(false)
  const isRefEl = node.getAttribute('rel') === 'true'


  function onClick() {
    if (isHighlighted) {
      props.onClick(props['data-annotation'], annotationsMode)
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

  if (Tag === 'hr') {
    return <hr />
  }

  return (
    <Tag
      {...props}
      className={
        (props.className || '') +
        (isHighlighted ? ' bg-gray-200 dark:bg-muted relative cursor-pointer' : '') +
        (isHovered ? ' bg-primary/20 dark:bg-primary/50' : '') +
        (selectedAnnotation && isSelected(selectedAnnotation.id, props['data-annotation']) ? ' bg-primary/40 dark:bg-primary/80' : '') +
        (isRefEl ? ' bg-gray-400 font-bold' : '')
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
  // Main function to create GenericElement recursively out of HTML nodes.
  // Additional attributes regarding annotations will be applied.

  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent
  }

  if (node.nodeType !== Node.ELEMENT_NODE) return null


  const children = Array.from(node.childNodes).map((child, i) =>
    convertNodeToReact(child, `${key}-${i}`, matches, onClickTarget)
  )

  const props: ComponentPropsWithoutRef<ElementType> = {}
  for (const attr of node.attributes) {
    if (attr.name === 'style') {
      props.style = parseStyleString(attr.value)
    } else {
      props[attr.name === 'class' ? 'className' : attr.name] = attr.value
    }
  }

  const annotationIds = Object.keys(matches).reduce((acc, cur) => {
    const isMatch = matches[cur].target.includes(node) && matches[cur].filtered === true
    return isMatch ? [...acc, cur] : acc
  }, [])

  if (annotationIds.length > 0) {
    props['data-annotation'] = annotationIds.join(',')
    props.onClick = onClickTarget
  }

  if (node.hasAttribute('data-ref-target')) {
    return <CrossRefLink node={node} />
  }


  return (
    <GenericElement
      key={key}
      tagName={node.tagName.toLowerCase() as ElementType}
      props={props}
      isHighlighted={annotationIds.length > 0}
      node={node}
    >
      {children}
    </GenericElement>
  )
}

const TextRenderer: FC<Props> = memo(({ htmlString }) => {
  const textWrapperRef = useRef<HTMLInputElement>(null)
  const { panelState, fullAnnotationTypes, setFullAnnotationTypes, matchedAnnotationsMap,
    setMatchedAnnotationsMap, setSelectedAnnotation, updatePanel, panelId } = usePanel()


  function scrollIntoSelectedAnnotation(selectedAnnotation: Annotation) {
    const annotationId = selectedAnnotation?.id
    const panelEl = document.getElementById(panelId) as HTMLElement
    const container = panelEl.querySelector('div[data-sidebar-container]') as HTMLElement
    const annotationEl = container.querySelector('div[data-annotation="'+annotationId+'"]') as HTMLElement
    scrollIntoViewIfNeeded(annotationEl, container)
  }

  const onClickTarget = (idList: string, annotationsMode: 'align' | 'list') => {
    const idArr = idList.split(',')
    const last = idArr[idArr.length - 1]
    const annotation = panelState.annotations.find(a => a.id === last)
    if (annotation) {
      if (!panelState.annotationsOpen) {
        updatePanel({ annotationsOpen: true })
      }
      setSelectedAnnotation(annotation)
      if (annotationsMode === 'list') scrollIntoSelectedAnnotation(annotation)
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

  const calculatedMatchedAnnotMap = React.useMemo(() => {
    // switching to new item

    if (!panelState.annotations) return {}
    const result: MatchedAnnotationsMap = panelState.annotations.reduce((acc, cur) => {
      const textSelector = cur.target[0].selector.value
      if (!textSelector) {
        console.error('Annotation error','Selector value of target is empty for this annotation', cur)
        return acc
      }

      const matchedNodes = Array.from(parsedDom.body.querySelectorAll(cur.target[0].selector.value))
      if (matchedNodes.length > 0) {
        const annotType = cur.body['x-content-type']
        acc[cur.id] = { target: matchedNodes, filtered: fullAnnotationTypes[annotType] ?? true, annotation: cur }
      }
      return acc
    }, {})

    return result
  }, [parsedDom, panelState.annotations])

  useEffect(() => {
    setMatchedAnnotationsMap(calculatedMatchedAnnotMap)
  }, [calculatedMatchedAnnotMap])


  useEffect(() => {
    const extendedFullAnnotationsTypesMap = getExtendedFullAnnotationsTypesMap(panelState.annotations, fullAnnotationTypes)
    setFullAnnotationTypes(extendedFullAnnotationsTypesMap)
  }, [matchedAnnotationsMap])


  const reactElements = React.useMemo(() => {
    return Array.from(parsedDom.body.childNodes).map((node, i) =>
      convertNodeToReact(node as HTMLElement, i, matchedAnnotationsMap, onClickTarget)
    )
  }, [matchedAnnotationsMap, htmlString])




  return <div className="relative">
    <div ref={textWrapperRef}>
      { reactElements }
    </div>
  </div>
})

export default TextRenderer
