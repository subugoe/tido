import { FC, useEffect, useRef, useState } from 'react'
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

  const [nodeEl, setNodeEl] = useState<HTMLElement>(null)

  function getContentType(contents: Content[], url: string) {
    const content = contents.find(c => c.url === url)
    if (!content) return null

    const eqIndex = content.type.indexOf('=')
    return eqIndex !== -1 ? content.type.slice(eqIndex + 1) : content.type
  }

  function getContentUrl(annotationId: string, annotations: Annotation[]) {
    const annotation = annotations.filter(annotation => annotation.id === annotationId)[0]
    if (annotation) {
      return annotation.target[0].source
    }
  }

  async function getCrossRefEl(crossRefAnnotation: Annotation) {
    console.log('cross ref annotation', crossRefAnnotation)
    const annotationId = crossRefAnnotation.body?.source?.id
    const collection = crossRefAnnotation.body?.source?.collection
    const manifest = crossRefAnnotation.body?.source?.manifest
    const item = crossRefAnnotation.body?.source?.item

    // compute content type -> read item object ->

    const contentUrl = getContentUrl(annotationId, annotations)
    console.log('content Url', contentUrl)

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

    setNodeEl(node)
  }

  useEffect(() => {

    if (!annotations) return

    const nodeSelector = '#'+ nodeLink.getAttribute('id')
    const crossRefAnnotations =  annotations.filter(a => a.body?.source?.['x-content-type'] === 'CrossRef')
    const crossRefAnnotation = crossRefAnnotations.filter(annotation => annotation.target[0].selector.value === nodeSelector)[0]
    if (crossRefAnnotation)  getCrossRefEl(crossRefAnnotation)
  }, [])


  return  <CrossRefLink node={nodeEl} />
}

export default CrossRefAnnotation
