import { FilterNodeWithSelection, FilterType } from '@/types'

const updateNodesSelection = (path: number[], items: FilterNodeWithSelection[], selected?: boolean): FilterNodeWithSelection[] => {
  const clonedItems = JSON.parse(JSON.stringify(items))
  let current: FilterNodeWithSelection[] = clonedItems

  for (let i = 0; i < path.length - 1; i++) {
    current = current[path[i]].items!
  }

  const lastIndex = path[path.length - 1]
  const newSelected = selected === undefined ? !current[lastIndex].selected : !current[lastIndex].selected

  updateNodeSelection(current[lastIndex], newSelected)

  return clonedItems
}

function updateNodeSelection(node: FilterNodeWithSelection, selected: boolean) {
  node.selected = selected
  if (node.items) {
    node.items.forEach(item => updateNodeSelection(item, selected))
  }
}

function getTypeValue(type: FilterType) {
  if (typeof type === 'object') {
    return Object.keys(type)[0] ?? null
  }
  return type
}

export {
  updateNodesSelection,
  updateNodeSelection,
  getTypeValue
}
