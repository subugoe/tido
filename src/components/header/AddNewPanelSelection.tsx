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
    <div className="w-[420px] flex flex-col">
      { items
        .map(({ id, title, subtitle, icon }) =>
          <div
            className="group flex items-start p-4 first:border-b
            hover:bg-gray-100/80 transition-colors cursor-pointer
            focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2
            dark:border-gray-800 dark:text-gray-50 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300"
            tabIndex={0}
            onClick={() => select(id)}
            key={id}
          >
            <div
              className="mr-3 flex items-center justify-center aspect-square h-4 w-4 rounded-full
              border-2 border-gray-300 group-hover:border-primary group-hover:text-primary ring-offset-white"
            >
              <Circle className="h-2.5 w-2.5 fill-current text-current opacity-0 group-hover:opacity-100 transition-all" />
            </div>
            <div>
              <p className="font-semibold leading-none group-hover:text-primary transition-colors">{ title }</p>
              <p className="mt-4 text-sm text-gray-600">{ subtitle }</p>
            </div>
            <div className="text-gray-300 self-center ml-4 shrink-0">
              { icon }
            </div>
          </div>)
      }
    </div>
  )
}

export default AddNewPanelSelection
