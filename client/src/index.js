import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createClient, Provider } from 'urql'

const client = createClient({
  url: window.location.protocol + "//" + window.location.hostname + process.env.NODE_ENV === 'production' ? '' : ':4000' + '/graphql',
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
