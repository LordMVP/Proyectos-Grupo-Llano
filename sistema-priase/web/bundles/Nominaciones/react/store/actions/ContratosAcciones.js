import { ACTUALIZAR_CABECERA_CONTRATO, ACTUALIZAR_LISTA_CONTRATOS, ACTUALIZAR_TIPO_CALCULO_CONTRATOS, ACTUALIZAR_DOCUMENTOS_CONTRATOS, ACTUALIZAR_GARANTIA, LIMPIAR_CONTRATO } from './TiposAcciones';

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

export const actualizarGarantia = (garantia) => {
  return {
    type: ACTUALIZAR_GARANTIA,
    payload: garantia
  };
};

export const limpiarContrato = () => {
  return {
    type: LIMPIAR_CONTRATO,
  }
};
