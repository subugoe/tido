import { FC, useEffect, useRef, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { validateCrossRefNode } from '@/utils/cross-ref.ts'
import { CustomError } from '@/utils/custom-error.ts'
import CrossRefLink from '@/components/panel/annotations/popover/cross-ref/CrossRefLink.tsx'
import { apiRequest } from '@/utils/api.ts'

interface Props {
  crossRefInfo: CrossRefInfo,
  onSelect: () => void
}

const CrossRefItem: FC<Props> = ({ crossRefInfo, onSelect }) => {
  const { usePanelTranslation } = usePanel()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { t } = usePanelTranslation()

  const extendedCrossRefInfoRef = useRef<CrossRefInfo>(null)
  const loadedData = useRef<boolean>(null)

  useEffect(() => {
    async function readCrossRefLabels(crossRefInfo: CrossRefInfo) {
      if (!error && !loadedData.current) {
        setLoading(true)
        try {
          const { manifestData, itemData } = await validateCrossRefNode(crossRefInfo)
          const newItemLabel = itemData.n ? itemData.n : itemData.title?.length > 0 ? itemData.title[0].title : ''
          extendedCrossRefInfoRef.current = {
            ...crossRefInfo,
            manifestLabel: (manifestData as Manifest).label,
            itemLabel: newItemLabel
          }
          if (crossRefInfo.textType === 'text') {
            // for cross ref referring to text part. Throw error when referenced el cannot be found due to a false selector
            const contentIndex = itemData.content.findIndex(c => c.type.split('=')[1] === crossRefInfo.contentType)
            const parser = new DOMParser()
            const referencedText: string = await apiRequest(itemData.content[contentIndex].url)
            const textEl = parser.parseFromString(referencedText, 'text/html')
            const targetExists = textEl.querySelector(crossRefInfo.selector)
            if (!targetExists) setError(new CustomError(t('cross_ref_error_title'), t('referenced_element_not_found')))
          }

          loadedData.current = true
        } catch(e) {
          setError(new CustomError(t(e.name), t(e.message)))
        } finally {
          setLoading(false)
        }
      }
    }

    readCrossRefLabels(crossRefInfo)
  }, [])

  return <CrossRefLink
    crossRefInfo={extendedCrossRefInfoRef.current}
    error={error}
    loading={loading}
    onSelect={onSelect}
  />

}

export default CrossRefItem
