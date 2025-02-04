import { ReactNode, createContext, useContext, FC, useState } from 'react'
import { dataStore } from '@/store/DataStore.tsx'

const TreeContext = createContext<TreeType | undefined>(undefined)

interface TreeType {
  onClick(node: TreeNode, itemRef): void

  onSelect(node: TreeNode, itemRef): void

  onExpand(node: TreeNode, nodes: TreeNode[]): void

  onCollapse(node: TreeNode, nodes: TreeNode[]): void
}

interface TreeProviderProps {
  children?: ReactNode

  onSelect(node: TreeNode, target): void

  onExpand(node: TreeNode, nodes: TreeNode[]): void

  onCollapse(node: TreeNode, nodes: TreeNode[]): void
}

const TreeProvider: FC<TreeProviderProps> = ({ children, onSelect, onExpand, onCollapse }) => {

  const treeNodes = dataStore(state => state.treeNodes)

  function onClick(node: TreeNode, target) {
    if ('leaf' in node) onSelect(node, target)
    else if (!node.expanded) onExpand(node, treeNodes)
    else if (node.expanded) onCollapse(node, treeNodes)
  }

  return (
    <TreeContext.Provider value={{ onClick, onSelect, onExpand, onCollapse }}>
      {children}
    </TreeContext.Provider>
  )
}


function useTree(): TreeType {
  const context = useContext(TreeContext)
  if (!context) {
    throw new Error('useTree must be used inside the TreeProvider')
  }

  return context
}

export { TreeProvider, useTree }
