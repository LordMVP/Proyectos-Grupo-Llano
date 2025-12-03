import { LIMPIAR_REVISION, ACTUALIZAR_CABECERA_REVISION, ACTUALIZAR_DISPERCION, ACTUALIZAR_LISTAS_REVISION, ACTUALIZAR_FACTURAS } from '../actions/TiposAcciones';

const initialState = {
  cabecera: {},
  listas: {},
  dispercion: {},
  facturas: {},
};

const actualizarCabeceraRevision = (state = initialState, action) => {
  return {
    ...state,
    cabecera: { ...state.cabecera, ...action.payload }
  };
};

const actualizarListasRevision = (state = initialState, action) => {
  return {
    ...state,
    listas: { ...state.listas, ...action.payload }
  };
};

const actualizarDispercion = (state = initialState, action) => {
  return {
    ...state,
    dispercion: { ...state.dispercion, ...action.payload }
  };
};

const actualizarFacturas = (state = initialState, action) => {
  return {
    ...state,
    facturas: { ...state.facturas, ...action.payload }
  };
};

const limpiarRevision = (state = initialState) => {
  return {
    listas: { ...state.listas },
  };
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ACTUALIZAR_CABECERA_REVISION:
      return actualizarCabeceraRevision(state, action);
    case ACTUALIZAR_LISTAS_REVISION:
      return actualizarListasRevision(state, action);
    case ACTUALIZAR_DISPERCION:
      return actualizarDispercion(state, action);
    case ACTUALIZAR_FACTURAS:
      return actualizarFacturas(state, action);
    case LIMPIAR_REVISION:
      return limpiarRevision(state);
    default:
      return state;
  }
};
