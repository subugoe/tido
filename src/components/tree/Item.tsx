

import { FC, useState } from 'react'


interface ItemProps {
    label: string
}

const ItemTree: FC<ItemProps>  = ({ label }) => {

    const [active, setActive] = useState(false)

    function handleClick(
        e) {
        e.preventDefault()
        setActive(prevState => !prevState)
    }

    return <div>
            <button className="t-w-full t-text-left hover:t-bg-gray-200 t-cursor-pointer" style={{backgroundColor: !active ? 'white': '#0284c7'}}
                    onClick={(e) => handleClick(e)}>
                  { label }
            </button>
        </div>
}

export default ItemTree
