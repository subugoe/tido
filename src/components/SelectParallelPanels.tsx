import { FC } from 'react'
import { Button } from '@/components/ui/button.tsx'
import { dataStore } from '@/store/DataStore.tsx'

const SelectParallelPanels: FC<any> = () => {
  const collections = dataStore(state => state.collections)
  const initAnnotations = dataStore(state => state.initAnnotations)

  const selected = {}

  function select(index: number) {
    selected['p' + index] = true
  }

  function confirm() {
    if (!collections[0].annotationCollection) return
    initAnnotations(collections[0].id, collections[0].annotationCollection)
  }

  return <>
    <span className="t-font-bold t-p-2" onClick={() => select(0)}>Panel 1</span>
    <span className="t-font-bold t-p-2" onClick={() => select(1)}>Panel 2</span>
    <Button onClick={confirm}>Confirm</Button>
  </>

}
export default SelectParallelPanels
