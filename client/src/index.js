import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createClient, Provider } from 'urql'

const API_URL = process.env.REACT_APP_API_URL || window.location.origin + '/graphql'
console.log(API_URL)
const client = createClient({
  url: API_URL,
  fetchOptions: {
    credentials: 'include'
  }
})

ReactDOM.render(
  <React.StrictMode>
    <Provider value={client}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
