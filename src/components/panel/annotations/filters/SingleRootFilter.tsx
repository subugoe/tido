import { updateNodeSelection } from '@/utils/filter-tree.ts'
import { FC, useCallback, useState } from 'react'
import { AnnotationFiltersConfig, FilterNode } from '@/types'
import FilterTree from '@/components/panel/annotations/filters/FilterTree.tsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx'

interface Props {
  config: AnnotationFiltersConfig
  onChange?: (items: FilterNode[]) => void
}


const SingleRootFilter: FC<Props> = ({ config, onChange }) => {
  const [activeRootIndex, setActiveRootIndex] = useState(config.items.findIndex(item => item.selected))

  // Initialize tree states from config, re-initialize if config changes
  const [treeStates, setTreeStates] = useState<{ [key: number]: FilterNode[] }>(() => {
    const initial: { [key: number]: FilterNode[] } = {}
    config.items.forEach((item, index) => {
      initial[index] = JSON.parse(JSON.stringify(item.items || []))
    })
    return initial
  })

  const handleToggle = useCallback(
    (rootindex: number) => (path: number[]) => {
      setTreeStates((prev) => {
        const newStates = { ...prev }
        newStates[rootindex] = updateNodeSelection(path, newStates[rootindex])

        const newItems = [...config.items]
        newItems[rootindex] = {
          ...newItems[rootindex],
          items: newStates[rootindex]
        }
        onChange?.(newItems)

        return newStates
      })
    },
    [config.items, onChange]
  )


  const handleTabChange = useCallback((value: string) => {
    const index = parseInt(value)
    setActiveRootIndex(index)

    const newItems = [...config.items]
    newItems.forEach((item, i) => {
      item.selected = i == index
    })
    onChange?.(newItems)

  }, [])

  return (
    <Tabs value={String(activeRootIndex)} onValueChange={handleTabChange}>
      <div className="overflow-x-auto">
        <TabsList>
          {config.items.map((item, index) => (
            <TabsTrigger key={index} value={String(index)}>
              {item.label || `Filter ${index + 1}`}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {config.items.map((_, index) => (
        <TabsContent key={index} value={String(index)}>
          <div className="border border-border rounded-xl p-2">
            <FilterTree nodes={treeStates[index] || []} onToggle={handleToggle(index)} />
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}

export default SingleRootFilter
