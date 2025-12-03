import initialState from "../initialState";
import * as types from "../../actions/actionTypes";

function suscripcionReducer(state = initialState.suscription, action) {
  switch (action.type) {
    case types.LOAD_CIUDADES_RESULT:
      return {
        ...state,
        ciudades: action.payload,
      };

    case types.CLEAR_CIUDADES_RESULT:
      return {
        ...state,
        ciudades: [],
      };
    case types.LOAD_TIPO_IDENTIFICACION:
      return {
        ...state,
        tipos_indentificacion: action.payload,
      };
    case types.CLEAR_TIPO_IDENTIFICACION:
      return {
        ...state,
        tipos_indentificacion: [],
      };
    case types.LOAD_TIPO_PERSONA:
      return {
        ...state,
        tipos_persona: action.payload,
      };
    case types.CLEAR_TIPO_PERSONA:
      return {
        ...state,
        tipos_persona: [],
      };
    case types.LOAD_MUNICIPIOS:
      return {
        ...state,
        municipios: action.payload,
      };
    case types.CLEAR_MUNICIPIOS:
      return {
        ...state,
        municipios: [],
      };
    case types.LOAD_BARRIOS:
      return {
        ...state,
        barrios: action.payload,
      };
    case types.CLEAR_BARRIOS:
      return {
        ...state,
        barrios: [],
      };

    default:
      return state;
  }
}
export default suscripcionReducer;
