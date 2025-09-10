import { FC } from 'react'

import { usePanel } from '@/contexts/PanelContext.tsx'

import CrossRefSameItem from '@/components/panel/CrossRef/CrossRefSameItem.tsx'
import CrossRefDifferentItem from '@/components/panel/CrossRef/CrossRefDifferentItem.tsx'


interface Props {
  node: HTMLElement
}

const CrossRefLink: FC<Props> = ({  node }) => {

  const { panelState } = usePanel()

  const isTargetInDiffItem = node.getAttribute('data-ref-item') !== panelState.item?.id


  if (isTargetInDiffItem) return <CrossRefDifferentItem node={node} />
  return <CrossRefSameItem node={node} />
}

export default CrossRefLink
