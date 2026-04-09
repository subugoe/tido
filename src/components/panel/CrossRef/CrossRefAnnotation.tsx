import { FC, useEffect, useRef } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { apiRequest } from '@/utils/api.ts'
import CrossRefLink from '@/components/panel/CrossRef/CrossRefLink.tsx'

interface Props {
  nodeLink: HTMLElement
}

const CrossRefAnnotation: FC<Props> = ({ nodeLink }) => {

  // from nodeLink get its nearest HTMLElement which contains attribute "data-annotation"
  // Goal: create a new DOM Element which you do not render, where you set attributes
  //   data-ref-content-type, data-ref-target, data-ref-item, data-ref-collection
  // pass this hTML Element to CrossRefLink

  console.log('nodeLink', nodeLink)

  const { annotations } = usePanel()

  const nodeEl = useRef<HTMLElement>(null)

  function getCrossRefAnnotation(annotationEl: HTMLElement, annotations: Annotation[]) {
    // CrossRefAnnotation is the Annotation which contains CrossRefInformation -> information of our target
    const annotationId = annotationEl.getAttribute('data-annotation')
    const crossRefAnnotations = annotations.filter(a => a.body?.source?.['x-content-type'] === 'CrossRef')
    return crossRefAnnotations.find(annotation =>
      annotation.target?.some((a) => a.source?.id === annotationId)
    )
  }

  function getContentType(contents: Content[], url: string) {
    const content = contents.find(c => c.url === url)
    if (!content) return null

    const eqIndex = content.type.indexOf('=')
    return eqIndex !== -1 ? content.type.slice(eqIndex + 1) : content.type
  }

  async function getCrossRefEl(crossRefAnnotation: Annotation) {
    const annotationId = crossRefAnnotation.body?.source?.id
    const collection = crossRefAnnotation.body?.source?.collection
    const manifest = crossRefAnnotation.body?.source?.manifest
    const item = crossRefAnnotation.body?.source?.item

    // compute content type -> read item object ->

    const contentUrl = crossRefAnnotation.target[0].source

    // get ContentUrl of this annotation
    // read item and find the content type which corresponds to this contentUrl

    const itemData = await apiRequest(item) as Item
    const contentType = getContentType(itemData.content, contentUrl)
    const selector = '#' + annotationId

    const node = document.createElement('div')
    node.setAttribute('data-ref-target', selector)
    node.setAttribute('data-ref-collection', collection)
    node.setAttribute('data-ref-manifest', manifest)
    node.setAttribute('data-ref-item', item)
    node.setAttribute('data-ref-content-type', contentType)
    node.setAttribute('data-selected-annotation', annotationId)

    return node
  }

  useEffect(() => {

    async function assignNode(crossRefAnnotation: Annotation) {
      nodeEl.current = await getCrossRefEl(crossRefAnnotation)
      //console.log('nodeEl', nodeEl.current)
    }

    if (!annotations) return

    const annotationEl = nodeLink.closest('[data-annotation]') as HTMLElement
    console.log('annotationEl', annotationEl)
    if (!annotationEl) return
    //const annotationEl2 = document.querySelector('[data-annotation="https://textapi.mha.d.sub.uni-goettingen.de/api/annotations/annotationPage/MHA01/B6r/ftn1"]') as HTMLElement
    //console.log('annotation El as div', annotationEl)
    const crossRefAnnotation = getCrossRefAnnotation(annotationEl, annotations)
    assignNode(crossRefAnnotation)
  }, [])



  return  <CrossRefLink node={nodeLink} />
}

export default CrossRefAnnotation
