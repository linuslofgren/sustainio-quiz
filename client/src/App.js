import React, {useState} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import logo from './logo.svg';
import './App.css';
import Admin from './Admin/Admin'
import Quiz from './Quiz'

function App() {
  let [code, setCode] = useState('')
  let [start, setStart] = useState(true)
  return <Router>
    <Switch>
      <Route path="/admin">
        <Admin />
      </Route>
      <Route path="/">
        {start ?
           (
            <div className="App">
              <input type="number" value={code} onChange={e => setCode(e.target.value)} className="App-input-code" placeholder="CODE" />
              <button onClick={()=>setStart(false)}>GO</button>
            </div>
          )
          :
          <Quiz code={code}/>
        }
      </Route>
  </Switch>
  </Router>

}

export default App;
