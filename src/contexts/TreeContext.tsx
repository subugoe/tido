import { ReactNode, createContext, useContext, FC } from 'react'
import { dataStore } from '@/store/DataStore.tsx'

const TreeContext = createContext<TreeType | undefined>(undefined)

interface TreeType {
  onClick(node: TreeNode, target): void

  onSelect(node: TreeNode, target): void

  onExpand(node: TreeNode, nodes: TreeNode[]): Promise<TreeNode[] | undefined>

  onCollapse(node: TreeNode, nodes: TreeNode[]): Promise<TreeNode[] | undefined>
}

interface TreeProviderProps {
  children?: ReactNode

  onSelect(node: TreeNode, target): void

  onExpand(node: TreeNode, nodes: TreeNode[]): Promise<TreeNode[] | undefined>

  onCollapse(node: TreeNode, nodes: TreeNode[]): Promise<TreeNode[] | undefined>
}

const TreeProvider: FC<TreeProviderProps> = ({ children, onSelect, onExpand, onCollapse }) => {

  const treeNodes = dataStore(state => state.treeNodes)
  const setTreeNodes = dataStore(state => state.setTreeNodes)

  async function onClick(node: TreeNode, target) {
    if ('leaf' in node) onSelect(node, target)
    else if (!node.expanded) {
      const updatedTree = await onExpand(node, treeNodes)
      if (updatedTree) setTreeNodes(updatedTree)
    } else if (node.expanded) {
      const updatedTree = await onCollapse(node, treeNodes)
      if (updatedTree) setTreeNodes(updatedTree)
    }
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
