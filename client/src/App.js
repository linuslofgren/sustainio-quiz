import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import Quiz from './Quiz'

function App() {
  let [code, setCode] = useState('')
  let [start, setStart] = useState(true)
  if(start) {
    return (
      <div className="App">
        <input type="number" value={code} onChange={e => setCode(e.target.value)} className="App-input-code" placeholder="CODE" />
        <button onClick={()=>setStart(false)}>GO</button>
      </div>
    );
  } else {
    return <Quiz code={code}/>
  }

}

export default App;
