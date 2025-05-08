import { FC, useState } from 'react'
import { Button } from '@/components/ui/button.tsx'
import { usePanelStore } from '@/store/PanelStore.tsx'
import { useScrollStore } from '@/store/ScrollStore.tsx'

const SelectParallelPanels: FC = () => {
  const panelStates = usePanelStore(state => state.panels)
  const update = useScrollStore(state => state.update)
  const scrollPanelIds = useScrollStore(state => state.panelIds)

  const [selected, setSelected] = useState<{ [key: string]: boolean }>(scrollPanelIds.reduce((acc, cur) => {
    acc[cur] = true
    return acc
  }, {} as { [key: string]: boolean }))

  function select(panelId: string) {
    setSelected({
      ...selected,
      [panelId]: true
    })
  }

  function unselect(panelId: string) {
    const value = { ...selected }
    delete value[panelId]
    setSelected(value)
  }

  function toggle(panelId: string) {
    if (selected[panelId]) {
      unselect(panelId)
    } else {
      select(panelId)
    }
  }

  async function confirm() {
    update(Object.keys(selected))
  }

  function unsync() {
    const newSelected = {}
    setSelected(newSelected)
    update(Object.keys(newSelected))
  }

  return <>
    <div className="flex space-x-2 mb-2">
      { Object.keys(panelStates).map((panelId, i) =>
        <Button key={panelId} variant={selected[panelId] ? 'secondarySelected' : 'secondary'} onClick={() => toggle(panelId)}>Panel {i}</Button>)
      }
    </div>

    <Button onClick={confirm}>Confirm</Button>
    <Button onClick={unsync} className="ml-2">Unsync</Button>
  </>

}
export default SelectParallelPanels
