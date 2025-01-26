import { ReactNode, createContext, useContext, FC } from 'react'
const TreeContext = createContext<TreeType | undefined>(undefined)

interface TreeType {
    onClick(node: TreeNode): void
    onSelect(node: TreeNode): void
    onExtend(node: TreeNode): void,
    onCollapse(node: TreeNode): void,
    selectedKey: string
}

interface TreeProviderProps {
    children?: ReactNode,
    onClick(node: TreeNode): void
    onSelect(node: TreeNode): void,
    onExtend(node: TreeNode): void,
    onCollapse(node: TreeNode): void,
    selectedKey: string
}

const TreeProvider: FC<TreeProviderProps> = ({ children, onClick, onSelect, onExtend, onCollapse, selectedKey }) => {

    return (
        <TreeContext.Provider value={{ onClick, onSelect, onExtend, onCollapse, selectedKey }}>
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
