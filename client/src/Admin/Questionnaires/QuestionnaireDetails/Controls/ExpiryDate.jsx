import React, {useState} from 'react'

const ExpiryDate = ({defaultDate, setExpirationDate, cancel}) => {
  let defaultString = defaultDate.toISOString()
  let dateCopy = new Date(defaultString)
  dateCopy.setMinutes(dateCopy.getMinutes() - dateCopy.getTimezoneOffset())
  defaultString = dateCopy.toISOString()
  let [inputDate, setInputDate] = useState(defaultString.slice(0, defaultString.lastIndexOf(":")))
  return <div>
    <input type="datetime-local" value={inputDate} onChange={(e) => setInputDate(e.target.value)}/>
    <button className="small-button" onClick={cancel}>Cancel</button><button onClick={()=>{
      setExpirationDate({date: (new Date(inputDate)).toISOString()})
      cancel()
    }}>Save</button>
  </div>
}

export default ExpiryDate
