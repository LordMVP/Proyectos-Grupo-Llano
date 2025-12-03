import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { logger } from 'redux-logger';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import './index.scss';
import App from './App';

import { rootReducer } from './store/reducers';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const reduxMiddleWares = [thunk, logger];
const store = createStore(rootReducer, composeEnhancers(
  applyMiddleware(...reduxMiddleWares)
));

const app = (
  <Provider store={store}>
    <BrowserRouter basename="/achagua/sistema/web/app.php/gestioncartera/">
      <App/>
    </BrowserRouter>
  </Provider>
);

ReactDOM.render(app, document.getElementById('root'));
