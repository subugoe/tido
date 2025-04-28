import { FC } from 'react'

import { useTranslation } from 'react-i18next'
import { Blocks, Circle, ListTree } from 'lucide-react'


type SelectionValue = 'new' | 'existing'

interface Props {
  onSelect?: (value: SelectionValue) => void
}

const AddNewPanelSelection: FC<Props> = ({ onSelect }) => {
  const { t } = useTranslation()
  const items = [
    {
      id: 'new' as SelectionValue,
      title: t('from_new_collection'),
      subtitle: t('from_new_collection_description'),
      icon: <Blocks size={24} />
    },
    {
      id: 'existing' as SelectionValue,
      title: t('from_existing_collections'),
      subtitle: t('from_existing_collections_description'),
      icon: <ListTree size={24} />
    }
  ]

  function select(id: SelectionValue) {
    if (onSelect) onSelect(id)
  }

  return (
    <div className="t-w-[420px] t-flex t-flex-col">
      { items
        .map(({ id, title, subtitle, icon }) =>
          <div
            className="t-group t-flex t-items-start t-p-4 first:t-border-b
            hover:t-bg-gray-100/80 t-transition-colors t-cursor-pointer
            focus:t-outline-none focus-visible:t-ring-2 focus-visible:t-ring-primary/60 focus-visible:t-ring-offset-2
            dark:t-border-gray-800 dark:t-text-gray-50 dark:t-ring-offset-gray-950 dark:focus-visible:t-ring-gray-300"
            tabIndex={0}
            onClick={() => select(id)}
            key={id}
          >
            <div
              className="t-mr-3 t-flex t-items-center t-justify-center t-aspect-square t-h-4 t-w-4 t-rounded-full
              t-border-2 t-border-gray-300 group-hover:t-border-primary group-hover:t-text-primary t-ring-offset-white"
            >
              <Circle className="t-h-2.5 t-w-2.5 t-fill-current t-text-current t-opacity-0 group-hover:t-opacity-100 t-transition-all" />
            </div>
            <div>
              <p className="t-font-semibold t-leading-none group-hover:t-text-primary t-transition-colors">{ title }</p>
              <p className="t-mt-4 t-text-sm t-text-gray-600">{ subtitle }</p>
            </div>
            <div className="t-text-gray-300 t-self-center t-ml-4 t-shrink-0">
              { icon }
            </div>
          </div>)
      }
    </div>
  )
}

export default AddNewPanelSelection
