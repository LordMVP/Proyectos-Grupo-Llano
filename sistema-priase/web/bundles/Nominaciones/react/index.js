import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import { QueryClient, QueryClientProvider } from "react-query";
import thunk from 'redux-thunk';

import './index.scss';
import App from './App';

import { rootReducer } from './store/reducers';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const reduxMiddleWares = [thunk];
/* const store = createStore(rootReducer, composeEnhancers(
  applyMiddleware(...reduxMiddleWares)
));

const app = (
  <Provider store={store}>
    <BrowserRouter basename="/achagua/sistema/web/app.php/nominaciones/">
      <App />
    </BrowserRouter>
  </Provider>
); */
const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(...reduxMiddleWares))
);
const queryClient = new QueryClient();
const app = (
  <Provider store={store}>
    <BrowserRouter basename="/achagua/sistema/web/app.php/nominaciones/">
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </Provider>
);

ReactDOM.render(app, document.getElementById('root'));
