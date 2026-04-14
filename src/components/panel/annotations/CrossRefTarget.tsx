import { FC, useEffect, useRef } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { apiRequest } from '@/utils/api.ts'

interface Props {
  node: HTMLElement,
  source: string,
  onClick: (newOpen: boolean, crossRefInfo: CrossRefInfo) => void,
}

const CrossRefTarget: FC<Props> = ({ node, source, onClick }) => {
  // source: annotation Id: where cross ref appears

  const { annotations } = usePanel()
  const annotationsRef = useRef<Annotation[]>(null)

  useEffect(() => {
    annotationsRef.current = annotations
  }, [annotations])

  async function getCrossRefInfo(annotation: Annotation) {
    // annotation: CrossRefAnnotation which contains the cross ref data, from which we extract the desired information

    const body = annotation.body as AnnotationBodyCrossRef
    const source = body.source
    console.log('source', source)
    const refItem = source.item
    const refItemData = await apiRequest<Item>(refItem)
    const refAnnotationId = source?.id

    const annotationCollection = await apiRequest<AnnotationCollection>(refItemData.annotationCollection)
    const annotationPage = await apiRequest<AnnotationPage>(annotationCollection.first)
    const refAnnotation = annotationPage.items.find(annotation => annotation.id === refAnnotationId)
    // TODO: In Popover show error when refAnnotation is not found, due to error in CrossRef Information
    console.log('ref annotation', refAnnotation)
    const contentUrl = refAnnotation.target[0].source
    const refContentType = refItemData.content.find(c => c.url === contentUrl).type?.split('type=')[1]

    return {
      collection: source.collection,
      manifest: source.manifest,
      item: source.item,
      contentType: refContentType,
      annotationId: source?.id,
      selectedAnnotation: refAnnotation
    }
  }

  async function handleClick(e) {
    e.stopPropagation()
    const crossRefAnnotation = annotationsRef.current
      .filter(a => a.body?.source?.['x-content-type'] === 'CrossRef')
      .find(a => a.target[0].source === source)
    const crossRefInfo = await getCrossRefInfo(crossRefAnnotation)
    onClick(true, crossRefInfo)
  }

  return (
    <span
      onClick={handleClick}
      dangerouslySetInnerHTML={{ __html: node.innerHTML }}
      className="text-blue-500 underline cursor-pointer"
    />
  )

}

export default CrossRefTarget
