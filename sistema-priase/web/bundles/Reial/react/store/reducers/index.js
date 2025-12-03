import { combineReducers } from 'redux';
import testReducer from './TestReducer';
import appReducer from './AplicacionReducers';
import configuracionReducer from './ConfiguracionReducers';
import { CERRAR_SESION } from '../actions/TiposAcciones';

const appReducers = combineReducers({
  configuracion: configuracionReducer,
  test: testReducer,
  app: appReducer
});

const rootReducer = (state, action) => {
  if (action.type === CERRAR_SESION) {
    state = undefined;
  }
  
  return appReducers(state, action);
};

export { rootReducer };
