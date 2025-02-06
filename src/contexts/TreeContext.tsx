import { ReactNode, createContext, useContext, FC } from 'react'
import { dataStore } from '@/store/DataStore.tsx'

const TreeContext = createContext<TreeType | undefined>(undefined)

interface TreeType {
    onClick(node: TreeNode, target): void

    onSelect(node: TreeNode, target): void

    getChildren(node: TreeNode): Promise<TreeNode[]>
}

interface TreeProviderProps {
    children?: ReactNode

    onSelect(node: TreeNode, target): void

    getChildren(node: TreeNode): Promise<TreeNode[]>
}

const TreeProvider: FC<TreeProviderProps> = ({ children, onSelect, getChildren }) => {


  async function onClick(node: TreeNode, target) {
    // can we get Children from this node ? -> we are dealing with a 'manifest' node or a 'collection' node
    // if the node is not expanded and we get can get children - add the children to the node


  }

  return (
    <TreeContext.Provider value={{ onClick, onSelect, getChildren }}>
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
