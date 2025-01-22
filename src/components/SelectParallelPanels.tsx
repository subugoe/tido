import { FC } from 'react'
import { Button } from '@/components/ui/button.tsx'
import { dataStore } from '@/store/DataStore.tsx'
import { panelStore } from '@/store/PanelStore.tsx'

const SelectParallelPanels: FC<any> = () => {
  const collections = dataStore(state => state.collections)
  const initAnnotations = dataStore(state => state.initAnnotations)
  const panels = panelStore(state => state.panels)

  const selected: { [key: string]: boolean } = {}


  function select(panelId: string) {
    selected[panelId] = true
  }

  function confirm() {
    const collection = collections[Object.keys(collections)[0]]

    if (!collection.annotationCollection) return
    initAnnotations(collection.id, collection.annotationCollection)
  }

  return <>
  { Object.keys(panels).map((panelId, i) => <span key={i} className="t-font-bold t-p-2" onClick={() => select(panelId)}>Panel {i}</span>) }
    <Button onClick={confirm}>Confirm</Button>
  </>

}
export default SelectParallelPanels
