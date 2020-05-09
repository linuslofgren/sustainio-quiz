import React, {useState} from 'react'
import './MainInput.css'

const MainInput = ({defaultValue, save}) => {
  let [inp, setInp] = useState(defaultValue)
  return <div className="Component-MainInput-container">
    <input className="Component-MainInput-input" value={inp} onChange={(e) => setInp(e.target.value)}/>
    <button className="Component-MainInput-button" onClick={()=>save(inp)}>Save</button>
  </div>
}

export default MainInput
