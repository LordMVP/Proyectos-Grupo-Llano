import { ACTUALIZAR_CABECERA_CONTRATO, ACTUALIZAR_LISTA_CONTRATOS, ACTUALIZAR_TIPO_CALCULO_CONTRATOS, ACTUALIZAR_DOCUMENTOS_CONTRATOS, ACTUALIZAR_GARANTIA_BANCARIA, ACTUALIZAR_GARANTIA_PREPAGO, ACTUALIZAR_PRECIO_POLIZA } from '../actions/TiposAcciones';
import { actualizarPrecioPoliza } from '../actions/ContratosAcciones';

const initialState = {
  cabecera: {},
  listas: {},
  tipoCalculo: {},
  documentos: {},
  garantiaBancaria: {},
  garantiaPrepago: {},
  precioPoliza: {},
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

const actualizarGarantiaBancaria = (state = initialState, action) => {
  return {
    ...state,
    garantiaBancaria: { ...state.garantiaBancaria, ...action.payload }
  };
};

const actualizarGarantiaPrepago = (state = initialState, action) => {
  return {
    ...state,
    garantiaPrepago: { ...state.garantiaPrepago, ...action.payload }
  };
};

const actualziarPrecioPoliza = (state = initialState, action) => {
  return {
    ...state,
    precioPoliza: { ...state.precioPoliza, ...action.payload }
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
    case ACTUALIZAR_GARANTIA_BANCARIA:
      return actualizarGarantiaBancaria(state, action);
    case ACTUALIZAR_GARANTIA_PREPAGO:
      return actualizarGarantiaPrepago(state, action);
    case ACTUALIZAR_PRECIO_POLIZA:
      return actualziarPrecioPoliza(state, action);
    default:
      return state;
  }
};
