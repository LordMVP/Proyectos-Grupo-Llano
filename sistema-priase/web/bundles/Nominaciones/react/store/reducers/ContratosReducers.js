import { ACTUALIZAR_CABECERA_CONTRATO, ACTUALIZAR_LISTA_CONTRATOS, ACTUALIZAR_TIPO_CALCULO_CONTRATOS, ACTUALIZAR_DOCUMENTOS_CONTRATOS, ACTUALIZAR_GARANTIA, LIMPIAR_CONTRATO } from '../actions/TiposAcciones';

const initialState = {
  cabecera: {},
  listas: {},
  tipoCalculo: {},
  documentos: {},
  garantia: {},
};

const actualizarCabeceraContrato = (state = initialState, action) => {
  return {
    ...state,
    cabecera: { ...state.cabecera, ...action.payload }
  };
};

const actualizarListaContratos = (state = initialState, action) => {
  return {
    ...state,
    listas: { ...state.listas, ...action.payload }
  };
};

const actualizarTipoCalculoContrato = (state = initialState, action) => {
  return {
    ...state,
    tipoCalculo: { ...state.tipoCalculo, ...action.payload }
  };
};

const actualizarDocumentosContrato = (state = initialState, action) => {
  return {
    ...state,
    documentos: { ...state.documentos, ...action.payload }
  };
};

const actualizarGarantia = (state = initialState, action) => {
  return {
    ...state,
    garantia: { ...state.garantia, ...action.payload }
  };
};

const limpiarObjetoContrato = (state = initialState) => {
  return {
    listas: { ...state.listas },
    // cabecera: {},
    // tipoCalculo: {},
    // documentos: {},
    // garantia: {},
  };
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ACTUALIZAR_CABECERA_CONTRATO:
      return actualizarCabeceraContrato(state, action);
    case ACTUALIZAR_LISTA_CONTRATOS:
      return actualizarListaContratos(state, action);
    case ACTUALIZAR_TIPO_CALCULO_CONTRATOS:
      return actualizarTipoCalculoContrato(state, action);
    case ACTUALIZAR_DOCUMENTOS_CONTRATOS:
      return actualizarDocumentosContrato(state, action);
    case ACTUALIZAR_GARANTIA:
      return actualizarGarantia(state, action);
    case LIMPIAR_CONTRATO:
      return limpiarObjetoContrato(state);
    default:
      return state;
  }
};
