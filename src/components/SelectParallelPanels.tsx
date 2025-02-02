import { FC, useState } from 'react'
import { Button } from '@/components/ui/button.tsx'
import { dataStore } from '@/store/DataStore.tsx'
import { panelStore } from '@/store/PanelStore.tsx'
import { scrollStore } from '@/store/ScrollStore.tsx'

const SelectParallelPanels: FC<any> = () => {
  const collections = dataStore(state => state.collections)
  const initAnnotations = dataStore(state => state.initAnnotations)
  const panels = panelStore(state => state.panels)
  const addScrollPanel = scrollStore(state => state.addScrollPanel)

  const [selected, setSelected] = useState<{ [key: string]: boolean }>({})

  function select(panelId: string) {
    setSelected({
      ...selected,
      [panelId]: true
    })
    addScrollPanel(panelId)
  }

  function confirm() {
    const collection = collections[Object.keys(collections)[0]]

    if (!collection.annotationCollection) return
    initAnnotations(collection.id, collection.annotationCollection)
  }

  return <>
    <div className="t-flex t-space-x-2 t-mb-2">
      { Object.keys(panels).map((panelId, i) =>
        <Button key={i} variant={selected[panelId] ? 'secondarySelected' : 'secondary'} onClick={() => select(panelId)}>Panel {i}</Button>)
      }
    </div>

    <Button onClick={confirm}>Confirm</Button>
  </>

}
export default SelectParallelPanels
