import { FilterNode } from '@/types'

const updateNodeSelection = (path: number[], items: FilterNode[]): FilterNode[] => {
  const clonedItems = JSON.parse(JSON.stringify(items))
  let current: FilterNode[] = clonedItems

  for (let i = 0; i < path.length - 1; i++) {
    current = current[path[i]].items!
  }

  function updateNode(node: FilterNode, selected: boolean) {
    node.selected = selected
    if (node.items) {
      node.items.forEach(item => updateNode(item, selected))
    }
  }

  const lastIndex = path[path.length - 1]
  updateNode(current[lastIndex], !current[lastIndex].selected)

  return clonedItems
}

export {
  updateNodeSelection
}
