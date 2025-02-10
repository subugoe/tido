import { ReactNode, createContext, useContext, FC } from 'react'

const TreeContext = createContext<TreeType | undefined>(undefined)

interface TreeType {
  onSelect(node: TreeNode, target): void

  getChildren(node: TreeNode): Promise<TreeNode[]>
}

interface TreeProviderProps {
  children?: ReactNode

  onSelect(node: TreeNode, target): void

  getChildren(node: TreeNode): Promise<TreeNode[]>
}

const TreeProvider: FC<TreeProviderProps> = ({ children, onSelect, getChildren }) => {


  return (
    <TreeContext.Provider value={{ onSelect, getChildren }}>
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
