import { FC, ReactNode } from 'react'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import ContentModal from '@/components/tree-modal/ContentModal'

import { configStore } from '@/store/ConfigStore'
import { dataStore } from '@/store/DataStore'

import { getNodeIndices } from '@/utils/tree'

interface LocalTreeProps {
    TriggerButton: ReactNode
}

const LocalTreeModal: FC<LocalTreeProps> = ({ TriggerButton }) => {

    // TODO: add a [loading, setLoading] => which shows the pop over when the tree has been loaded -> TreeView Component updates the loading of its parent

    // function of this component: create a new Panel

    const addNewPanel = configStore(state => state.addNewPanel)
    const nodes = dataStore(state => state.treeNodes)


    function createNewPanel(newEntrypoint: string, type: string) {
        //...

        const nodeIndices = getNodeIndices(newEntrypoint, nodes)

        if (type === 'collection') addNewPanel({
            entrypoint: {
                url: newEntrypoint,
                type: "collection",
            }
        }
        )

        if (type === 'item') {
            const { collectionIndex, manifestIndex, itemIndex } = nodeIndices
            const collectionUrl = nodes[collectionIndex].id
            addNewPanel({
                entrypoint: {
                    url: collectionUrl,
                    type: "collection",
                },
                manifestIndex: manifestIndex,
                itemIndex: itemIndex
            }
            )
        }

    }

    return <div className="local-tree-modal">
        <Popover>
            <PopoverTrigger className="open-tree-button t-h-8 t-w-10 t-relative">
                {TriggerButton}
            </PopoverTrigger>
            <PopoverContent className="t-bg-white t-absolute t-z-10">
                <ContentModal createNewPanel={createNewPanel} />
            </PopoverContent>
        </Popover>
    </div>
}

export default LocalTreeModal