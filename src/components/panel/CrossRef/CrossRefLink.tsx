import { ComponentPropsWithoutRef, ElementType, FC } from 'react'

import { usePanel } from '@/contexts/PanelContext.tsx'

import CrossRefInternalLink from '@/components/panel/CrossRef/CrossRefInternalLink.tsx'
import CrossRefExternalLink from '@/components/panel/CrossRef/CrossRefExternalLink.tsx'


type GenericElementProps<T extends ElementType> = {
  props?: ComponentPropsWithoutRef<T>
  node: HTMLElement,
} & ComponentPropsWithoutRef<T>

const CrossRefLink: FC<GenericElementProps<T>> = ({ props, node }) => {

  const { panelState } = usePanel()

  const isTargetInDiffItem = node.getAttribute('data-ref-item') !== panelState.item?.id


  if (isTargetInDiffItem) return <CrossRefExternalLink props={props} node={node} />
  return <CrossRefInternalLink props={props} node={node} />
}

export default CrossRefLink
