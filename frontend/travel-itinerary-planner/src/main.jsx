// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import App from './App';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';


ReactDOM.render(
  <GoogleOAuthProvider clientId='68497468883-ohpuq8rsn7hcsmqk0tamhckqkrn019nd.apps.googleusercontent.com'>
  <Provider store={store}>
    <App />
    <ToastContainer />
  </Provider>
  </GoogleOAuthProvider>,
  document.getElementById('root')
);

