import { FC, useState } from 'react'
import { Button } from '@/components/ui/button.tsx'
import { panelStore } from '@/store/PanelStore.tsx'
import { scrollStore } from '@/store/ScrollStore.tsx'

const SelectParallelPanels: FC = () => {
  const panelStates = panelStore(state => state.panels)
  const update = scrollStore(state => state.update)
  const scrollPanelIds = scrollStore(state => state.panelIds)

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
    setSelected({})
    update(Object.keys(selected))
  }

  return <>
    <div className="t-flex t-space-x-2 t-mb-2">
      { Object.keys(panelStates).map((panelId, i) =>
        <Button key={panelId} variant={selected[panelId] ? 'secondarySelected' : 'secondary'} onClick={() => toggle(panelId)}>Panel {i}</Button>)
      }
    </div>

    <Button onClick={confirm}>Confirm</Button>
    <Button onClick={unsync}>Unsync</Button>
  </>

}
export default SelectParallelPanels
