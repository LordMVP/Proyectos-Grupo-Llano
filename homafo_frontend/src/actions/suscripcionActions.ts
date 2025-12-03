import suscripcionApi from "../api/suscripcion/suscripcionApi";
import * as types from "./actionTypes";
const newSuscripcionApi = new suscripcionApi();

export const loadCiudades = (data: string) => {
  return (dispatch: any) => {
    return newSuscripcionApi.getCiudades(data).then((response) => {
      dispatch({
        type: types.LOAD_CIUDADES_RESULT,
        payload: response.data,
      });
    });
  };
};
export const clearCiudades = () => {
  return {
    type: types.CLEAR_CIUDADES_RESULT,
  };
};

export const loadTipoIdentificacion = () => {
  return (dispatch: any) => {
    return newSuscripcionApi.getTipoIdentificacion().then((response) => {
      dispatch({
        type: types.LOAD_TIPO_IDENTIFICACION,
        payload: response.data,
      });
    });
  };
};

export const clearTipoIdentificacion = () => {
  return {
    type: types.CLEAR_TIPO_IDENTIFICACION,
  };
};

export const loadTipoPersona = () => {
  return (dispatch: any) => {
    return newSuscripcionApi.getTipoPersona().then((response) => {
      dispatch({
        type: types.LOAD_TIPO_PERSONA,
        payload: response.data,
      });
    });
  };
};

export const clearTipoPersona = () => {
  return {
    type: types.CLEAR_TIPO_PERSONA,
  };
};

export const loadMunicipios = () => {
  return (dispatch: any) => {
    return newSuscripcionApi.getMunicipios().then((response) => {
      dispatch({
        type: types.LOAD_MUNICIPIOS,
        payload: response.data,
      });
    });
  };
};

export const clearMunicipios = () => {
  return {
    type: types.CLEAR_MUNICIPIOS,
  };
};

export const loadBarrios = (id: string | number) => {
  return (dispatch: any) => {
    return newSuscripcionApi.getBarrios(id).then((response) => {
      dispatch({
        type: types.LOAD_BARRIOS,
        payload: response.data,
      });
    });
  };
};

export const CLEAR_BARRIOS = () => {
  return {
    type: types.CLEAR_BARRIOS,
  };
};
