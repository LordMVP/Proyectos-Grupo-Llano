import { ACTUALIZAR_VALIDAR_CALCULO_PERDIDAS } from './TiposAcciones';


export const actualizarValidarCalculoPerdidas = (validar) => {
  return {
    type: ACTUALIZAR_VALIDAR_CALCULO_PERDIDAS,
    payload: validar
  }
};
