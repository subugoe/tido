import { FC, useEffect, useRef, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import CrossRefDifferentItem from '@/components/panel/CrossRef/CrossRefDifferentItem.tsx'
import CrossRefSameItem from '@/components/panel/CrossRef/CrossRefSameItem.tsx'
import { validateCrossRefNode } from '@/utils/cross-ref.ts'
import { existsTargetInText } from '@/utils/dom.ts'
import { CustomError } from '@/utils/custom-error.ts'


interface Props {
  crossRefInfo: CrossRefInfo,
  onSelect: () => void
}

const TestCrossRefArea: FC<Props> = ({ crossRefInfo, onSelect }) => {

  const { panelState, usePanelTranslation } = usePanel()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { t } = usePanelTranslation()


  const extendedCrossRefInfoRef = useRef<CrossRefInfo>(null)
  const loadedData = useRef<boolean>(null)
  const isDifferentItem = crossRefInfo?.item !== panelState.item?.id

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
            itemLabel: newItemLabel,
          }
          // TODO: if (!await existsTargetInText(extendedCrossRefInfoRef.current.refItemData, extendedCrossRefInfoRef.current.contentType, extendedCrossRefInfoRef.current.selector)) throw new CustomError('cross_ref_error_title', 'referenced_element_not_found')
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


  if (isDifferentItem) return <CrossRefDifferentItem crossRefInfo={extendedCrossRefInfoRef.current} error={error} loading={loading} onSelect={onSelect} />
  return <div>Cross Ref same component</div>
}

export default TestCrossRefArea
