import { MOSTRAR_ALERTA, MOSTRAR_CARGADOR, OCULTAR_ALERTA } from '../actions/TiposAcciones';

const initialState = {
  appCargando: false,
  alerta: { mostrar: false }
};

const cargadorReducer = (state = initialState, action) => {
  return {
    ...state,
    appCargando: action.payload
  };
};

const mostrarAlertaReducer = (state = initialState, action) => {
  return {
    ...state,
    alerta: {
      mostrar: true,
      ...action.payload.alerta
    }
  };
};

const ocultarAlertaReducer = (state = initialState, action) => {
  return {
    ...state,
    alerta: {
      mostrar: false
    }
  };
};

export default (state = initialState, action) => {
  switch (action.type) {
    case MOSTRAR_CARGADOR:
      return cargadorReducer(state, action);
    case MOSTRAR_ALERTA:
      return mostrarAlertaReducer(state, action);
    case OCULTAR_ALERTA:
      return ocultarAlertaReducer(state, action);
    default:
      return state;
  }
};
