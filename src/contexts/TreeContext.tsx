import { ReactNode, createContext, useContext, FC } from 'react'

const TreeContext = createContext<TreeType | undefined>(undefined)

interface TreeType {
  onClick(node: TreeNode): void,

  onSelect(node: TreeNode): void

  onExpand(node: TreeNode): void,

  onCollapse(node: TreeNode): void,
}

interface TreeProviderProps {
  children?: ReactNode,

  onSelect(node: TreeNode): void,

  onExpand(node: TreeNode): void,

  onCollapse(node: TreeNode): void,
}

const TreeProvider: FC<TreeProviderProps> = ({ children, onSelect, onExpand, onCollapse }) => {

  function onClick(node: TreeNode) {
    if ('leaf' in node) onSelect(node)
    else if (!node.expanded) onExpand(node)
    else if (node.expanded) onCollapse(node)
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
