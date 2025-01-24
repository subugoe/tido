import { ReactNode, createContext, useContext, FC } from 'react'
const TreeContext = createContext<TreeType | undefined>(undefined)

interface TreeType {
    onSelect(): void
    onExtend(): void
}

interface TreeProviderProps {
    children?: ReactNode
    onSelect(): void,
    onExtend(): void
}

const TreeProvider: FC<TreeProviderProps> = ({ children, onSelect, onExtend }) => {

    return (
        <TreeContext.Provider value={{ onSelect, onExtend }}>
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
