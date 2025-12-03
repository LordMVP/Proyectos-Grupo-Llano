import { ACTUALIZAR_VALIDAR_CALCULO_PERDIDAS } from '../actions/TiposAcciones';

const initialState = {
  validar: {}
};


const actualizarValidar = (state = initialState, action) => {
  return {
    ...state,
    validar: { ...state.validar, ...action.payload }
  };
};


export default (state = initialState, action) => {
  switch (action.type) {
    case ACTUALIZAR_VALIDAR_CALCULO_PERDIDAS:
      return actualizarValidar(state, action);
    default:
      return state;
  }
};
