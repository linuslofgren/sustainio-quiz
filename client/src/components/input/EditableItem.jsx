import React, {useState} from 'react'
import MainInput from './MainInput'

const EditableItem = ({defaultValue, save, children}) => {
  let [edit, setEdit] = useState(false)
  return edit ?
      <MainInput defaultValue={defaultValue} save={(newVal)=>{setEdit(false); save(newVal)}}/>
    :
      <div style={{minWidth: 10, minHeight: 10, display: 'inline-block'}} onClick={()=>setEdit(true)}> {children} </div>


}

export default EditableItem
