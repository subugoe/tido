
import { FC, useEffect, useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu.tsx'
import { Button } from '@/components/ui/button.tsx'
import { ChevronDown } from 'lucide-react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { getUniqueWitnesses } from '@/utils/annotations.ts'

interface AnnotationFilterDropdownProps {
  type: string
}

const AnnotationFilterDropdown: FC<AnnotationFilterDropdownProps> = ({ type }) => {

  const { panelState, filteredAnnotations, annotationTypes } = usePanel()

  const [ show, setShow] = useState(annotationTypes[type])
  const [items, setItems] = useState([])
  const [checkedValues, setCheckedValues] = useState(new Array(items.length).fill(true))
  const [label, setLabel] = useState('')

  function handleValueChange(i, value) {
    const newValues = [...checkedValues]
    newValues[i] = value
    setCheckedValues(newValues)
  }

  function getItems(type: string) {
    const textEl = document.querySelector('div[data-text-container]')

    if (type === 'Variant') {
      const variantAnnotations = panelState.annotations.filter((a) =>
        Array.from(textEl.querySelectorAll(a.target[0].selector.value)).length > 0 && a.body['x-content-type'] === 'Variant')

      const uniqueWitnesses = getUniqueWitnesses(variantAnnotations)
      setItems(uniqueWitnesses)
      setCheckedValues(new Array(uniqueWitnesses.length).fill(true))
    }
  }

  function setFilterLabel(type) {
    if (type === 'Variant') setLabel('Witnesses')
  }


  useEffect(() => {
    getItems(type)
    setShow(true)
    setFilterLabel(type)
  }, [filteredAnnotations])

  useEffect(() => {
    setShow(annotationTypes[type] === true)
  }, [annotationTypes[type]])


  return (
    <div>
      { show && <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            { label }<ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{ type } </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {items.map((item,i) =>
            <DropdownMenuCheckboxItem
              checked={checkedValues[i]}
              onCheckedChange={(value) => handleValueChange(i, value)}
            >
              {item}
            </DropdownMenuCheckboxItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      }
    </div>
  )
}

export default AnnotationFilterDropdown
