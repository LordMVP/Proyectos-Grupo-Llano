import { combineReducers } from 'redux';
import testReducer from './TestReducer';
import appReducer from './AplicacionReducers';
import configuracionReducer from './ConfiguracionReducers';
import contratosReducer from './ContratosReducers';
import calculoPerdidasReducer from './CalculoPerdidasReducers';
import revisionReducer from './RevisionFacturaReducers';
import { CERRAR_SESION } from '../actions/TiposAcciones';

const appReducers = combineReducers({
  contratos: contratosReducer,
  configuracion: configuracionReducer,
  test: testReducer,
  app: appReducer,
  calculoPerdidas: calculoPerdidasReducer,
  revision: revisionReducer
});

const rootReducer = (state, action) => {
  if (action.type === CERRAR_SESION) {
    state = undefined;
  }

  return appReducers(state, action);
};

export { rootReducer };
