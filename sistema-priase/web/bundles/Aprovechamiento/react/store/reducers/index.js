import { combineReducers } from 'redux';
import testReducer from './TestReducer';
import appReducer from './AplicacionReducers';
import { CERRAR_SESION } from '../actions/TiposAcciones';
import configuracionReducer from './ConfiguracionReducers';
import Utils from './Utils';
import Items from './Items';

const appReducers = combineReducers({
  test: testReducer,
  app: appReducer,
  configuracion: configuracionReducer,
  Utils,
  Items,
});

const rootReducer = (state, action) => {
  if (action.type === CERRAR_SESION) {
    state = undefined;
  }

  return appReducers(state, action);
};

export { rootReducer };
