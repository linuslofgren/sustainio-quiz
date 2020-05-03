import React from 'react';
import logo from './logo.svg';
import { useQuery } from 'urql'
import './App.css';

function App() {
  const [res, executeQuery] = useQuery({
    query: `
      query ($code: String!) {
        questionnaireByCode(code: $code) {
          code
          expiryDate
          name
          questions {
            text
          }
          userAnswersResults {
            time
          }
        }
      }
    `,
    variables: {code: "1234"}
  })
  return (
    <div className="App">
      <h1>{((res.data || {}).questionnaireByCode || {}).name}</h1>
      <input type="number" className="App-input-code" placeholder="CODE" />
    </div>
  );
}

export default App;
