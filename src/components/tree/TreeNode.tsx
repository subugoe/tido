import { FC, MouseEvent, useEffect, useState } from 'react'
import { useTree } from '@/contexts/TreeContext'
import { useTranslation } from 'react-i18next'
import { ChevronRight, Folder, LibraryBig, File, FolderOpen } from 'lucide-react'

import EmptyNode from '@/components/tree/EmptyNode.tsx'
import ErrorNode from '@/components/tree/ErrorNode.tsx'
import { usePanelStore } from '@/store/PanelStore.tsx'
import OpenedIcon from '@/components/tree/OpenedIcon.tsx'
import { apiRequest } from '@/utils/api.ts'
import { getRootChildrenCollectionsIds } from '@/utils/tree.ts'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip.tsx'


interface TreeNodeProps {
  node: TreeNode,
}


const TreeNode: FC<TreeNodeProps> = ({ node }) => {
  const { onSelect, getChildren, selectedNodeId, setSelectedNodeId, elevation } = useTree()
  const panels = usePanelStore(state => state.panels)
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(node.expanded)
  const [showEmptyNode, setShowEmptyNode] = useState(false)
  const [showErrorNode, setShowErrorNode] = useState(false)
  const [children, setChildren] = useState(node.children)
  const [bg, setBg] = useState({
    selected: 'bg-accent',
    hover: 'hover:bg-muted'
  })

  const [panelsNumbersOpened, setPanelsNumbersOpened] = useState([])

  useEffect(() => {
    if (elevation === 0) {
      setBg({
        selected: 'bg-accent',
        hover: 'hover:bg-muted'
      })
    } else if (elevation === 1) {
      setBg({
        selected: 'bg-accent',
        hover: 'hover:bg-accent'
      })
    }
  }, [elevation])



  useEffect(() => {
    // show icon green circle for 'currently opened items' and all its parent nodes

    async function updatePanelsNumbersForItemOrManifest(node: TreeNode) {
      const newPanelsNumbersOpened = []
      panels?.forEach((panel, index) => {
        if (node.type === 'item' ? panel.item?.id === node.id : panel.manifest?.id === node.id) {
          newPanelsNumbersOpened.push(index + 1)
        }
      })
      setPanelsNumbersOpened(newPanelsNumbersOpened)
    }


    async function updatePanelsNumbersForCollection(node: TreeNode) {
      const newPanelsNumbersOpened = []
      const rootCollection = await apiRequest<Collection>(node.id)
      const childCollectionIds = await getRootChildrenCollectionsIds(rootCollection)
      childCollectionIds.push(node.id) // if current collection is leaf node, then we want to check if this node is present in any of panels

      panels?.forEach((panel, index) => {
        if (childCollectionIds.includes(panel.collectionId)) newPanelsNumbersOpened.push(index + 1)
      })

      setPanelsNumbersOpened(newPanelsNumbersOpened)
    }

    async function updatePanelsNumbersOpened() {
      if (node.type === 'item' || node.type === 'manifest') updatePanelsNumbersForItemOrManifest(node)
      if (node.type === 'collection') updatePanelsNumbersForCollection(node)
    }

    updatePanelsNumbersOpened()
  }, [panels])

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  async function handleNodeClick(e: MouseEvent<HTMLElement>) {
    e.preventDefault()

    if (!node.leaf) toggleExpand()

    if (!node.leaf && isExpanded) return

    if (!isExpanded && !node.leaf) {
      try {
        setShowErrorNode(false)
        node.children = [...await getChildren(node)]
        setChildren(node.children)
        if (node.children.length > 0) return
      } catch (error) {
        console.error(error)
        setShowErrorNode(true)
        return
      }
    }


    // the node has no children and it is not a leaf node, so we should add an empty node and return
    if (!node.leaf && node.children.length === 0) {
      setShowEmptyNode(true)
      return
    }

    onSelect(node, e.target as HTMLElement)
    setSelectedNodeId(node.id)
  }


  async function onErrorRetry() {
    try {
      setShowErrorNode(false)
      node.children = [...await getChildren(node)]
      setChildren(node.children)
      // setChildren -> rerender the component
    } catch(error) {
      setShowErrorNode(true)
      console.error(error)
    }
  }


  return <div data-cy="tree-node" data-node-key={node.key} className="mb-1">
    <div
      className={`flex relative items-start h-8 px-2 py-1 rounded-md cursor-pointer ${selectedNodeId === node.id ? `border border-border active ${bg.selected}` : bg.hover}`}
      onClick={(e) => handleNodeClick(e)}
    >
      {!node.leaf &&
        <span className={`mt-1 transition-all ${isExpanded && 'rotate-90'}`}><ChevronRight size={18} /></span>}
      <div className={`shrink-0 mt-1 mx-2 ${node.leaf ? 'ml-5' : ''}`}>
        {node.type === 'collection' && <LibraryBig size={18} />}
        {node.type === 'manifest' && !isExpanded && <Folder size={18} />}
        {node.type === 'manifest' && isExpanded && <FolderOpen size={18} />}
        {node.type === 'item' && <File size={18} />}
      </div>
      <TooltipProvider skipDelayDuration={600}>
        <Tooltip delayDuration={1000}>
          <TooltipTrigger asChild>
            <span data-cy="node-label" className="w-[80%] pr-2 truncate">{node.label}</span>
          </TooltipTrigger>
          <TooltipContent>
            {node.label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <div data-cy="tree-node-actions" className="w-6 shrink-0 grow-0 flex justify-end items-center h-[100%]">
        {panelsNumbersOpened.length > 0 &&
          <OpenedIcon panelsNumbers={panelsNumbersOpened} nodeType={node.type} />}
      </div>
    </div>
    <div className="flex-col" data-cy="node-children">
      {isExpanded && children?.map((item: TreeNode, i) => (
        <ul data-cy="tree-node-child" className="ml-3" key={i}>
          <TreeNode node={item} />
        </ul>
      ))}
    </div>
    {showEmptyNode && isExpanded && <EmptyNode label={t('no_items_found')} />}
    {showErrorNode && isExpanded && <ErrorNode onRetry={onErrorRetry} />}
  </div>
}

export default TreeNode
