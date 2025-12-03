import { LIMPIAR_REVISION, ACTUALIZAR_CABECERA_REVISION, ACTUALIZAR_DISPERCION, ACTUALIZAR_LISTAS_REVISION, ACTUALIZAR_FACTURAS } from './TiposAcciones';

export const actualizarCabeceraRevision = (cabecera) => {
  return {
    type: ACTUALIZAR_CABECERA_REVISION,
    payload: cabecera
  };
};

export const actualizarListasRevision = (nuevaLista) => {
  return {
    type: ACTUALIZAR_LISTAS_REVISION,
    payload: nuevaLista
  };
};

export const actualizarFacturas = (factura) => {
  return {
    type: ACTUALIZAR_FACTURAS,
    payload: factura
  };
};

export const actualizarDispercion = (dispercion) => {
  return {
    type: ACTUALIZAR_DISPERCION,
    payload: dispercion
  };
};

export const limpiarRevision = () => {
  return {
    type: LIMPIAR_REVISION,
  }
};
