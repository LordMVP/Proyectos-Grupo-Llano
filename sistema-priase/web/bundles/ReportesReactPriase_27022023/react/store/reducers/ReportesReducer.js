import {
  CONSULTAR_REPORTES,
  CONSULTAR_REPORTE,
  LIMPIAR_REPORTES
} from '../actions/TiposAcciones';

const initialState = {
  reportes: null,
  reporte: null
};

const consultarReportes = (state = initialState, action) => {
  return {
    ...state,
    reportes: action.payload
  };
}

const consultarReporte = (state = initialState, action) => {
  return {
    ...state,
    reporte: action.payload
  };
}

const limpiarReportes = (state = initialState, action) => {
  return {
    ...state,
    reportes: null
  };
}

export default (state = initialState, action) => {
  switch (action.type) {
    case CONSULTAR_REPORTES:
      return consultarReportes(state, action);
    case CONSULTAR_REPORTE:
      return consultarReporte(state, action);
    case LIMPIAR_REPORTES:
      return limpiarReportes(state, action);
    default:
      return state;
  }
}