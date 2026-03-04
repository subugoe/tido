import { ReactNode, createContext, useContext, FC, useState, useRef, useEffect } from 'react'
import { usePanelStore } from '@/store/PanelStore.tsx'

const TreeContext = createContext<TreeType | undefined>(undefined)

interface PanelData {
  item: Item,
  manifest: Manifest,
  collectionId: string
}

interface TreeType {
  onSelect(node: TreeNode, target: HTMLElement): void
  getChildren(node: TreeNode): Promise<TreeNode[]>
  selectedNodeId: string
  setSelectedNodeId: (val: string) => void
  elevation: number
  panels: PanelData[]
}

interface TreeProviderProps {
  children?: ReactNode
  onSelect(node: TreeNode, target: HTMLElement): void
  getChildren(node: TreeNode): Promise<TreeNode[]>
  elevation?: number
}

const TreeProvider: FC<TreeProviderProps> = ({ children, onSelect, getChildren, elevation = 0 }) => {
  const [selectedNodeId, setSelectedNodeId] = useState('')
  const [panels, setPanels] = useState<PanelData[]>([])
  const panelStates = usePanelStore(state => state.panels)
  const prevPanelsRef = useRef<PanelData[]>([])

  useEffect(() => {
    // This is needed for displaying the "opened" icons at tree nodes.
    // Since mapping out item, manifest and collectionId creates a new reference everytime and thus a triggers a re-rendering
    // in TreeNodes, we need only update "panels" when something actually was changed in value.

    const extracted = panelStates.map(({ item, manifest, collectionId }) => ({ item, manifest, collectionId }))

    const hasChanged = extracted.length !== prevPanelsRef.current.length ||
      extracted.some((p, i) =>
        p.item !== prevPanelsRef.current[i]?.item ||
        p.manifest !== prevPanelsRef.current[i]?.manifest ||
        p.collectionId !== prevPanelsRef.current[i]?.collectionId
      )

    if (hasChanged) {
      prevPanelsRef.current = extracted
      setPanels(extracted)
    }
  }, [panelStates])

  return (
    <TreeContext.Provider value={{ onSelect, getChildren, selectedNodeId, setSelectedNodeId, elevation, panels }}>
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
