import { FC } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'

import ItemSelection from '@/components/tree/ItemSelection.tsx'

const PanelHeader: FC = () => {
  const { panelState } = usePanel()

  function getManifestLabel() {
    return panelState.manifest.label
  }

  function getItemLabel() {
    return 'Page ' + panelState.item.n
  }

  return (
    <>
      <span className="t-font-semibold">{ getManifestLabel() } &nbsp;/&nbsp;</span>
      <ItemSelection title={getItemLabel()} />
    </>
  )
}

export default PanelHeader
