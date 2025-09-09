import { FC, useEffect } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import {
  DropdownMenu, DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu.tsx'
import { Button } from '@/components/ui/button.tsx'
import { ChevronDown } from 'lucide-react'

const WitnessFilter: FC = () => {
  const { witnesses, selectedWitnesses, setSelectedWitnesses, usePanelTranslation, matchedAnnotationsMap, setMatchedAnnotationsMap } = usePanel()
  const { t } = usePanelTranslation()

  function toggleSelectedWitness(witness: WitnessWithColor, checked: boolean) {
    const selected = [ ...selectedWitnesses ]
    if (checked) selected.push(witness)
    else {
      const index = selected.findIndex(w => w.idno === witness.idno)
      if (index > -1) selected.splice(index, 1)
    }
    // Small timeout before updating selected to reduce friction in the UI
    setTimeout(() => setSelectedWitnesses(selected), 100)
  }

  function getSelectedLabel() {
    return t('selected_witnesses', { selected: selectedWitnesses.length, total: witnesses.length })
  }

  useEffect(() => {
    const _matchedAnnotationsMap = { ...matchedAnnotationsMap }
    Object.keys(_matchedAnnotationsMap).forEach(key => {
      const { annotation } = _matchedAnnotationsMap[key]
      if (annotation.body['x-content-type'] !== 'Variant') return
      _matchedAnnotationsMap[key].filtered = selectedWitnesses.some(selWit => (annotation.body.value as AnnotationVariantValue).witnesses.includes(selWit.idno))
    })
    setMatchedAnnotationsMap(_matchedAnnotationsMap)
  }, [selectedWitnesses])

  return <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline" size="sm">{ getSelectedLabel() } <ChevronDown className="ml-1 h-6 w-6" /></Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-56">
      <DropdownMenuLabel>{ t('witnesses') }</DropdownMenuLabel>
      { witnesses?.map(witness => <>
        <DropdownMenuCheckboxItem
          checked={selectedWitnesses.map(w => w.idno).includes(witness.idno)}
          onCheckedChange={(checked) => toggleSelectedWitness(witness, checked)}
        >
          { witness.title ?? t('unknown_witness') }
        </DropdownMenuCheckboxItem>
      </>) ?? <></> }
    </DropdownMenuContent>
  </DropdownMenu>
}

export default WitnessFilter
