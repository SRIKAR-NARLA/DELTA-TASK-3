import { useState } from "react"

function Dropdown(props) {
    const [selectedValue,setSearchValue] = useState('');


    return (
        <div>
            <select value={selectedValue} onChange={(e)=>setSearchValue(e.target.value)}>
                {props.options.map((item,index)=>
                    <option key={index} value={item.value}>{item.name}</option>
                )}
            </select>
        </div>
    )
}

export default Dropdown
