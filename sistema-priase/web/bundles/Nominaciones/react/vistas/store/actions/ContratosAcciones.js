import { ACTUALIZAR_CABECERA_CONTRATO, ACTUALIZAR_LISTA_CONTRATOS, ACTUALIZAR_TIPO_CALCULO_CONTRATOS, ACTUALIZAR_DOCUMENTOS_CONTRATOS, ACTUALIZAR_GARANTIA_BANCARIA, ACTUALIZAR_GARANTIA_PREPAGO, ACTUALIZAR_PRECIO_POLIZA } from './TiposAcciones';

export const actualizarCabeceraContrato = (cabecera) => {
  return {
    type: ACTUALIZAR_CABECERA_CONTRATO,
    payload: cabecera
  };
};

export const actualizarListaContratos = (nuevaLista) => {
  return {
    type: ACTUALIZAR_LISTA_CONTRATOS,
    payload: nuevaLista
  };
};

export const actualizarTipoCalculoContrato = (tipoCalculo) => {
  return {
    type: ACTUALIZAR_TIPO_CALCULO_CONTRATOS,
    payload: tipoCalculo
  };
};

export const actualizarDocumentosContrato = (tipoCalculo) => {
  return {
    type: ACTUALIZAR_DOCUMENTOS_CONTRATOS,
    payload: tipoCalculo
  };
};

export const actualizarGarantiaBancaria = (garantiaBancaria) => {
  return {
    type: ACTUALIZAR_GARANTIA_BANCARIA,
    payload: garantiaBancaria
  };
};

export const actaulizarGarantiaPrepago = (garantiaPrepago) => {
  return {
    type: ACTUALIZAR_GARANTIA_PREPAGO,
    payload: garantiaPrepago
  };
};

export const actualizarPrecioPoliza = (precioPoliza) => {
  return {
    type: ACTUALIZAR_PRECIO_POLIZA,
    payload: precioPoliza
  };
};
