import { FC, MouseEvent, useEffect, useState } from 'react'
import { useTree } from '@/contexts/TreeContext'
import { useTranslation } from 'react-i18next'
import { ChevronRight, Folder, LibraryBig, File, FolderOpen } from 'lucide-react'

import EmptyNode from '@/components/tree/EmptyNode.tsx'
import ErrorNode from '@/components/tree/ErrorNode.tsx'


interface TreeNodeProps {
  node: TreeNode,
}


const TreeNode: FC<TreeNodeProps> = ({ node }) => {
  const { onSelect, getChildren, selectedNodeId, setSelectedNodeId, elevation } = useTree()
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(node.expanded)
  const [showEmptyNode, setShowEmptyNode] = useState(false)
  const [showErrorNode, setShowErrorNode] = useState(false)
  const [children, setChildren] = useState(node.children)
  const [bg, setBg] = useState({
    selected: 'bg-accent',
    hover: 'hover:bg-muted'
  })

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

  return <div className="mb-1">
    <div data-cy="tree-node" data-node-key={node.key}>
      <div
        className={`flex items-start px-2 py-1 rounded-md cursor-pointer ${ selectedNodeId === node.id ? `border border-border active ${bg.selected}` : bg.hover }`}
        onClick={(e) => handleNodeClick(e)}
      >
        {!node.leaf && <span className={`mt-1 transition-all ${isExpanded && 'rotate-90'}`}><ChevronRight size={18} /></span>}
        <div className={`shrink-0 mt-1 mx-2 ${node.leaf ? 'ml-5': ''}`}>
          { node.type === 'collection' && <LibraryBig size={18} />}
          { node.type === 'manifest' && !isExpanded && <Folder size={18} />}
          { node.type === 'manifest' && isExpanded && <FolderOpen size={18} />}
          { node.type === 'item' && <File size={18} />}
        </div>
        <span data-cy="node-label">{node.label}</span>
      </div>
      <div className="flex-col" data-cy="node-children">
        { isExpanded && children?.map((item: TreeNode, i) => (
          <ul data-cy="tree-node-child" className="ml-3" key={i}>
            <TreeNode node={item} />
          </ul>
        ))}
      </div>
      {showEmptyNode && isExpanded && <EmptyNode label={t('no_items_found')} />}
      {showErrorNode && isExpanded && <ErrorNode onRetry={onErrorRetry} />}
    </div>
  </div>
}

export default TreeNode
