import { FC } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'

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
      <span className="t-font-semibold">{ getManifestLabel() }</span> <span className="t-text-gray-600">&nbsp;/&nbsp;{ getItemLabel() }</span>
    </>
  )
}

export default PanelHeader
