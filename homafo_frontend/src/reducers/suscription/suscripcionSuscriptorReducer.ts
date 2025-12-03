import initialState from "../initialState";
import * as types from "../../actions/actionTypes";

function suscripcionSuscriptorReducer(
  state = initialState.suscriptionSuscripcion,
  action
) {
  switch (action.type) {
    case types.LOAD_COVENIOS:
      return {
        ...state,
        convenios: action.payload,
      };
    case types.CLEAR_COVENIOS:
      return {
        ...state,
        convenios: null,
      };
    case types.LOAD_CREAR_SUSCRIPTOR:
      return {
        ...state,
        crear_suscriptor: action.payload,
      };
    case types.CLEAR_CREAR_SUSCRIPTOR:
      return {
        ...state,
        crear_suscriptor: null,
      };

    case types.LOAD_CREAR_SUSCRIPCION:
      return {
        ...state,
        crear_suscripcion: action.payload,
      };
    case types.CLEAR_CREAR_SUSCRIPCION:
      return {
        ...state,
        crear_suscripcion: null,
      };

    case types.LOAD_EDITAR_SUSCRIPCION:
      return {
        ...state,
        edit_suscripcion: action.payload,
      };
    case types.CLEAR_EDITAR_SUSCRIPCION:
      return {
        ...state,
        edit_suscripcion: null,
      };

    case types.LOAD_BUSCAR_ID:
      return {
        ...state,
        search_id: action.payload,
      };
    case types.CLEAR_BUSCAR_ID:
      return {
        ...state,
        search_id: null,
      };

    case types.LOAD_DETALLE_SUSCRIPCION:
      return {
        ...state,
        detalles: action.payload,
      };
    case types.CLEAR_DETALLE_SUSCRIPCION:
      return {
        ...state,
        detalles: null,
      };

    case types.LOAD_PROPIEDADES:
      return {
        ...state,
        propiedades: action.payload,
      };
    case types.CLEAR_PROPIEDADES:
      return {
        ...state,
        propiedades: null,
      };

    case types.LOAD_SUSCRIPCIONES_TERCERO:
      return {
        ...state,
        suscripcion_by_tercero: action.payload,
      };
    case types.CLEAR_SUSCRIPCIONES_TERCERO:
      return {
        ...state,
        suscripcion_by_tercero: null,
      };

    case types.LOAD_FILTRAR_SUSCRIPCION:
      return {
        ...state,
        filtrar_suscripcion: action.payload,
      };
    case types.CLEAR_FILTRAR_SUSCRIPCION:
      return {
        ...state,
        filtrar_suscripcion: null,
      };

    case types.LOAD_ESTADOS_SUSCRIPCION:
      return {
        ...state,
        estados: action.payload,
      };
    case types.CLEAR_ESTADOS_SUSCRIPCION:
      return {
        ...state,
        estados: null,
      };

    case types.LOAD_TIPOS_USO:
      return {
        ...state,
        tipos_uso: action.payload,
      };
    case types.CLEAR_TIPOS_USO:
      return {
        ...state,
        tipos_uso: null,
      };

    case types.LOAD_LIQUIDACIONES:
      return {
        ...state,
        liquidaciones: action.payload,
      };
    case types.CLEAR_LIQUIDACIONES:
      return {
        ...state,
        liquidaciones: null,
      };

    case types.LOAD_CICLOS:
      return {
        ...state,
        ciclos: action.payload,
      };
    case types.CLEAR_CICLOS:
      return {
        ...state,
        ciclos: null,
      };

    case types.LOAD_RUTAS:
      return {
        ...state,
        rutas: action.payload,
      };
    case types.CLEAR_RUTAS:
      return {
        ...state,
        rutas: null,
      };

    case types.LOAD_RUTAS_APROVECHAMIENTO:
      return {
        ...state,
        rutasAprovechamiento: action.payload,
      };
    case types.CLEAR_RUTAS_APROVECHAMIENTO:
      return {
        ...state,
        rutasAprovechamiento: null,
      };

    case types.LOAD_MACRORUTA:
      return {
        ...state,
        macroRutas: action.payload,
      };
    case types.CLEAR_MACRORUTA:
      return {
        ...state,
        macroRutas: null,
      };

    case types.LOAD_MACRORUTA_BY_ID:
      return {
        ...state,
        macroRutas_by_id: action.payload,
      };
    case types.CLEAR_MACRORUTA_BY_ID:
      return {
        ...state,
        macroRutas_by_id: null,
      };

    case types.LOAD_HORARIOS:
      return {
        ...state,
        horarios: action.payload,
      };
    case types.CLEAR_HORARIOS:
      return {
        ...state,
        horarios: null,
      };
    case types.LOAD_ESTRATOS:
      return {
        ...state,
        estratos: action.payload,
      };
    case types.CLEAR_ESTRATOS:
      return {
        ...state,
        estratos: null,
      };
    case types.LOAD_ACTIVIDAD_ECONOMICA:
      return {
        ...state,
        actividad_economica: action.payload,
      };
    case types.CLEAR_ACTIVIDAD_ECONOMICA:
      return {
        ...state,
        actividad_economica: null,
      };
    case types.LOAD_TIPOS_SUSCRIPCION:
      return {
        ...state,
        tipos_suscripcion: action.payload,
      };
    case types.CLEAR_TIPOS_SUSCRIPCION:
      return {
        ...state,
        tipos_suscripcion: null,
      };

    case types.LOAD_CONCEPTOS:
      return {
        ...state,
        conceptos: action.payload,
      };
    case types.CLEAR_CONCEPTOS:
      return {
        ...state,
        conceptos: null,
      };
    case types.LOAD_HORARIOS_RUTA:
      return {
        ...state,
        horarios_rutas: action.payload,
      };
    case types.CLEAR_HORARIOS_RUTA:
      return {
        ...state,
        horarios_rutas: null,
      };
    case types.LOAD_EMPRESAS:
      return {
        ...state,
        empresas: action.payload,
      };
    case types.CLEAR_EMPRESAS:
      return {
        ...state,
        empresas: null,
      };
    default:
      return state;
  }
}

export default suscripcionSuscriptorReducer;
