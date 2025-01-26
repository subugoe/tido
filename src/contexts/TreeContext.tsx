import { ReactNode, createContext, useContext, FC } from 'react'
const TreeContext = createContext<TreeType | undefined>(undefined)

interface TreeType {
    selectedKey: string,
    onClick(node: TreeNode): void
    onSelect(node: TreeNode): void
    onExtend(node: TreeNode): void,
    onCollapse(node: TreeNode): void
}

interface TreeProviderProps {
    children?: ReactNode,
    onClick(node: TreeNode): void
    onSelect(node: TreeNode): void,
    onExtend(node: TreeNode): void,
    onCollapse(node: TreeNode): void
}

const TreeProvider: FC<TreeProviderProps> = ({ children, onClick, onSelect, onExtend, onCollapse }) => {

    return (
        <TreeContext.Provider value={{ onClick, onSelect, onExtend, onCollapse }}>
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
