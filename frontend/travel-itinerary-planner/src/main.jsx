// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import App from './App';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
// import { PersistGate } from 'redux-persist/integration/react';


ReactDOM.render(
  <GoogleOAuthProvider clientId='68497468883-ohpuq8rsn7hcsmqk0tamhckqkrn019nd.apps.googleusercontent.com'>
  <Provider store={store}>
  {/* <PersistGate loading={null} persistor={persistor}> */}
    <App />
    {/* </PersistGate> */}
  </Provider>
  </GoogleOAuthProvider>,
  document.getElementById('root')
);

