import {
  CONSULTAR_TIPOS_CONFIGURACIONES,
  CONSULTAR_CONFIGURACIONES,
  CONSULTAR_CONFIGURACIONES_TIPO,
  LIMPIAR_CONFIGURACIONES
} from '../actions/TiposAcciones';

const initialState = {
  configuraciones: null,
  tiposConfiguracion: null
};

const consultarTiposConfiguraciones = (state = initialState, action) => {
  return {
    ...state,
    tiposConfiguracion: action.payload
  };
};

const consultarConfiguraciones = (state = initialState, action) => {
  return {
    ...state,
    configuraciones: action.payload
  };
};

const consultarConfiguracionesTipo = (state = initialState, action) => {
  return {
    ...state,
    configuraciones: action.payload
  };
};

const limpiarConfiguraciones = (state = initialState, action) => {
  return {
    ...state,
    configuraciones: null
  };
};

// TODO: Hacer refactor de los reducers.

export default (state = initialState, action) => {
  switch (action.type) {
    case CONSULTAR_TIPOS_CONFIGURACIONES:
      return consultarTiposConfiguraciones(state, action);
    case CONSULTAR_CONFIGURACIONES:
      return consultarConfiguraciones(state, action);
    case CONSULTAR_CONFIGURACIONES_TIPO:
      return consultarConfiguracionesTipo(state, action);
    case LIMPIAR_CONFIGURACIONES:
      return limpiarConfiguraciones(state, action);
    default:
      return state;
  }
};
