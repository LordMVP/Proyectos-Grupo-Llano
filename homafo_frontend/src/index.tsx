import React from "react";
//import esriConfig from "@arcgis/core/config.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/grid.css";
import "./assets/app.css";

import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import configureStore from "./store/configureStore";

import AppNew from "./containers/AppNew";
import PARAMETROS from "./data/constantes";
//esriConfig.assetsPath = ".";
const store = configureStore();

render(
  <BrowserRouter basename={PARAMETROS.BASENAME}>
    <Provider store={store}>
      <AppNew />
    </Provider>
  </BrowserRouter>,
  document.getElementById("root")
);
