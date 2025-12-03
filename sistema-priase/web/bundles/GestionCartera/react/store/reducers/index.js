import { combineReducers } from 'redux';
import testReducer from './TestReducer';
import appReducer from './AplicacionReducers';
import { CERRAR_SESION } from '../actions/TiposAcciones';
import gestionCarteraReducer from './GestionCarteraReducer';

const appReducers = combineReducers({
  test: testReducer,
  app: appReducer,
  gestioncartera: gestionCarteraReducer
});

const rootReducer = (state, action) => {
  if (action.type === CERRAR_SESION) {
    state = undefined;
  }

  return appReducers(state, action);
};

export { rootReducer };
