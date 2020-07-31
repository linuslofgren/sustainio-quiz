import React, {useState} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import './App.css';
import Admin from './Admin/Admin'
import Quiz from './Quiz/Quiz'
import QuizById from './Quiz/QuizById'
import logo from './logo.png'

function App() {
  let [code, setCode] = useState('')
  let [start, setStart] = useState(true)
  let [invalidCode, setInvalidCode] = useState(false)
  return <Router>
    <Switch>
      <Route path="/admin">
        <Admin />
      </Route>
      <Route path="/login">
        <form action="/login" method="post">
          <div>
              <label>Username:</label>
              <input type="text" name="username"/>
          </div>
          <div>
              <label>Password:</label>
              <input type="password" name="password"/>
          </div>
          <div>
              <input type="submit" value="Log In"/>
          </div>
      </form>
      </Route>
      <Route path="/quiz/:id">
        <QuizById />
      </Route>
      <Route path="/">
        {start ?
           (
             <div className="App App-start">
               <div className="App-quiz-code-container">

                <a href="https://sustainio.se"><img className="App-quiz-logo" src={logo}></img></a>
                <p className="App-input-code-desc">Quiz code</p>
                <input value={code} onChange={e => setCode(e.target.value)} className={`App-input-code ${invalidCode ? 'App-input-code-invalid' : ''}`} placeholder="0000" />
                {invalidCode ? <p className="App-input-incorrect-text">The code didn't match any quiz, check and try again</p> : null}
                <button className="App-start-button" onClick={()=>setStart(false)}>Start</button>

              </div>
            </div>
          )
          :
          <Quiz code={code} setInvalid={(v) => {setInvalidCode(v); setStart(true)}}/>
        }
      </Route>
  </Switch>
  </Router>

}

export default App;
