import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Config from './Config';
import axios from 'axios';

async function renderApp() {
  let userToken = localStorage.getItem('userToken');
  if(!userToken) {
    const userTokenReq = await axios.post(Config.backendEndpoint('/users'));
    userToken = userTokenReq.data;
    localStorage.setItem('userToken', userToken);
  }
  
  Config.userToken = userToken;
  console.log('TOKEN', userToken);
  
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  );
}

renderApp().catch(console.log);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
