import initialState from "../initialState";
import * as types from "../../actions/actionTypes";

function suscripcionTerceroReducer(
  state = initialState.suscriptionTercero,
  action
) {
  console.log(action);
  switch (action.type) {
    case types.LOAD_BUSCAR_TERCEROS_RESULT:
      return {
        ...state,
        resultSearch: action.payload,
      };
    case types.CLEAR_BUSCAR_TERCEROS_RESULT:
      return {
        ...state,
        resultSearch: null,
      };
    case types.LOAD_CLASIFICACION_TERCEROS_RESULT:
      return {
        ...state,
        clasificaciones: action.payload,
      };
    case types.CLEAR_CLASIFICACION_TERCEROS_RESULT:
      return {
        ...state,
        clasificaciones: [],
      };
    case types.LOAD_CREAR_TERCERO:
      return {
        ...state,
        crear: action.payload,
      };
    case types.CLEAR_CREAR_TERCERO:
      return {
        ...state,
        crear: null,
      };
    case types.LOAD_ACTUALIZAR_TERCERO:
      return {
        ...state,
        actualizar: action.payload,
      };
    case types.CLEAR_ACTUALIZAR_TERCERO:
      return {
        ...state,
        actualizar: null,
      };
    case types.LOAD_BUSCAR_COMPLEMENTOS:
      return {
        ...state,
        complementos_direccion: action.payload,
      };
    case types.CLEAR_BUSCAR_COMPLEMENTOS:
      return {
        ...state,
        complementos_direccion: [],
      };
    case types.LOAD_TOKEN:
      return {
        ...state,
        token_mapa: action.payload,
      };

    case types.CLEAR_TOKEN:
      return {
        ...state,
        token_mapa: null,
      };

    case types.LOAD_GEOLOCALIZAR:
      return {
        ...state,
        geo_data: action.payload,
      };

    case types.CLEAR_GEOLOCALIZAR:
      return {
        ...state,
        geo_data: null,
      };
    case types.LOAD_CARACTERISTICAS_ARCGIS:
      return {
        ...state,
        geo_data_caracteristicas: action.payload,
      };
    case types.CLEAR_CARACTERISTICAS_ARCGIS:
      return {
        ...state,
        geo_data_caracteristicas: null,
      };
    case types.LOAD_CAPAS_MAPA:
      return {
        ...state,
        lista_capas: action.payload,
      };
    case types.CLEAR_CAPAS_MAPA:
      return {
        ...state,
        lista_capas: [],
      };

    case types.LOAD_TIPO_PROPIEDAD:
      return {
        ...state,
        tipos_propiedad: action.payload,
      };
    case types.CLEAR_TIPO_PROPIEDAD:
      return {
        ...state,
        tipos_propiedad: [],
      };
    case types.LOAD_TIPOS_VIVIENDA:
      return {
        ...state,
        tipos_vivienda: action.payload,
      };
    case types.CLEAR_TIPOS_VIVIENDA:
      return {
        ...state,
        tipos_vivienda: [],
      };
    case types.LOAD_CREAR_PROPIEDAD:
      return {
        ...state,
        crear_propiedad: action.payload,
      };
    case types.CLEAR_CREAR_PROPIEDAD:
      return {
        ...state,
        crear_propiedad: null,
      };
    case types.LOAD_UPDATE_PROPIEDAD:
      console.log(action.payload);
      return {
        ...state,
        update_propiedad: action.payload,
      };
    case types.CLEAR_UPDATE_PROPIEDAD:
      return {
        ...state,
        update_propiedad: null,
      };
    case types.LOAD_CLONAR_PROPIEDAD:
      return {
        ...state,
        clonar_propiedad: action.payload,
      };
    case types.CLEAR_CLONAR_PROPIEDAD:
      return {
        ...state,
        clonar_propiedad: null,
      };
    case types.LOAD_DELETE_PROPIEDAD:
      return {
        ...state,
        delete_propiedad: action.payload,
      };
    case types.CLEAR_DELETE_PROPIEDAD:
      return {
        ...state,
        delete_propiedad: null,
      };
    case types.LOAD_LISTAR_PROPIEDADES_TERCERO:
      return {
        ...state,
        lista_propiedades_tercero: action.payload,
      };
    case types.CLEAR_LISTAR_PROPIEDADES_TERCERO:
      return {
        ...state,
        lista_propiedades_tercero: [],
      };
    case types.LOAD_PROPIEDAD:
      return {
        ...state,
        propiedad: action.payload,
      };
    case types.CLEAR_PROPIEDAD:
      return {
        ...state,
        propiedad: [],
      };
    default:
      return state;
  }
}

export default suscripcionTerceroReducer;
