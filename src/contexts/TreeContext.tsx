import { ReactNode, createContext, useContext, FC, useState } from 'react'

const TreeContext = createContext<TreeType | undefined>(undefined)

interface TreeType {
  onSelect(node: TreeNode, target: HTMLElement): void
  getChildren(node: TreeNode): Promise<TreeNode[]>
  selectedNodeId: string
  setSelectedNodeId: (val: string) => void
}

interface TreeProviderProps {
  children?: ReactNode
  onSelect(node: TreeNode, target: HTMLElement): void
  getChildren(node: TreeNode): Promise<TreeNode[]>
}

const TreeProvider: FC<TreeProviderProps> = ({ children, onSelect, getChildren }) => {
  const [selectedNodeId, setSelectedNodeId] = useState('')

  return (
    <TreeContext.Provider value={{ onSelect, getChildren, selectedNodeId, setSelectedNodeId }}>
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
