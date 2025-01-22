

import { FC, MouseEvent, useState } from 'react'

import { dataStore } from '@/store/DataStore.tsx'

interface ItemProps {
    label: string,
    url: string
}

const ItemTree: FC<ItemProps>  = ({ label, url }) => {

    const [active, setActive] = useState(false)
    const [itemUrl] = useState(url)

    const setClickedItemUrl = dataStore(state => state.setClickedItemUrl)
    const clickedItemUrl = dataStore(state => state.clickedItemUrl)

    function handleClick(e: MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault()
        if (!active) setClickedItemUrl(itemUrl)

        setActive(prevState => !prevState)
    }

    return <div>
            <button className="t-w-full t-text-left hover:t-bg-gray-200 t-cursor-pointer" style={{backgroundColor: url === clickedItemUrl ? '#0284c7': 'white'}}
                    onClick={(e) => handleClick(e)}>
                  { label }
            </button>
        </div>
}

export default ItemTree