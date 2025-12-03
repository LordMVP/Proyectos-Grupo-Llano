import suscripcionTerceroApi from "../api/suscripcion/suscripcionTerceroApi";
import arcgisApi from "../api/suscripcion/arcgisApi";
import * as types from "./actionTypes";
const newSuscripcionTerceroApi = new suscripcionTerceroApi();
const newArcgisApi = new arcgisApi();
export const loadBuscarTerceros = (data: any) => {
  return (dispatch: any) => {
    return newSuscripcionTerceroApi
      .getSuscripcionTercero(data)
      .then((response) => {
        dispatch({
          type: types.LOAD_BUSCAR_TERCEROS_RESULT,
          payload: response.data,
        });
      });
  };
};

export const clearBuscarTerceros = () => {
  return {
    type: types.CLEAR_BUSCAR_TERCEROS_RESULT,
  };
};

export const loadClasificacionTerceros = () => {
  return (dispatch: any) => {
    return newSuscripcionTerceroApi
      .getSuscripcionTerceroClasificacion()
      .then((response) => {
        dispatch({
          type: types.LOAD_CLASIFICACION_TERCEROS_RESULT,
          payload: response.data,
        });
      });
  };
};

export const clearClasificacionTerceros = () => {
  return {
    type: types.CLEAR_CLASIFICACION_TERCEROS_RESULT,
  };
};

export const createSuscripcionTercero = (form: any) => {
  return (dispatch: any) => {
    return newSuscripcionTerceroApi
      .createSuscripcionTercero(form)
      .then((response) => {
        dispatch({
          type: types.LOAD_CREAR_TERCERO,
          payload: response.data,
        });
      });
  };
};

export const clearSuscripcionTercero = () => {
  return {
    type: types.CLEAR_CREAR_TERCERO,
  };
};

export const actualizarSuscripcionTercero = (data: {
  id: string;
  form: any;
}) => {
  return (dispatch: any) => {
    return newSuscripcionTerceroApi
      .actualizarSuscripcionTercero(data)
      .then((response) => {
        dispatch({
          type: types.LOAD_ACTUALIZAR_TERCERO,
          payload: response.data,
        });
      });
  };
};

export const clearActualizarSuscripcionTercero = () => {
  return {
    type: types.CLEAR_ACTUALIZAR_TERCERO,
  };
};

export const loadComplementos = (data: {
  idMunicipio: string | number;
  idBarrio: string | number;
}) => {
  return (dispatch: any) => {
    return newSuscripcionTerceroApi.getComplementos(data).then((response) => {
      dispatch({
        type: types.LOAD_BUSCAR_COMPLEMENTOS,
        payload: response.data,
      });
    });
  };
};

export const clearComplementos = () => {
  return {
    type: types.CLEAR_BUSCAR_COMPLEMENTOS,
  };
};
//
export const loadTokent = () => {
  return (dispatch: any) => {
    return newArcgisApi.getTokenMapa().then((response) => {
      dispatch({
        type: types.LOAD_TOKEN,
        payload: response.data,
      });
    });
  };
};

export const clearTokent = () => {
  return {
    type: types.CLEAR_TOKEN,
  };
};

export const searchGeolocalizar = (form: any) => {
  return (dispatch: any) => {
    return newArcgisApi.postGeolocalizar(form).then((response) => {
      dispatch({
        type: types.LOAD_GEOLOCALIZAR,
        payload: response.data,
      });
    });
  };
};

export const clearGeolocalizar = () => {
  return {
    type: types.CLEAR_GEOLOCALIZAR,
  };
};

export const searchCaracteristicasArcgis = (form: any) => {
  return (dispatch: any) => {
    return newArcgisApi.postCaracteristicas(form).then((response) => {
      dispatch({
        type: types.LOAD_CARACTERISTICAS_ARCGIS,
        payload: response.data,
      });
    });
  };
};

export const clearCaracteristicasArcgis = () => {
  return {
    type: types.CLEAR_CARACTERISTICAS_ARCGIS,
  };
};

export const getListaCapas = () => {
  return (dispatch: any) => {
    return newArcgisApi.getCapas().then((response) => {
      if (response.data !== "") {
        dispatch({
          type: types.LOAD_CAPAS_MAPA,
          payload: response.data,
        });
      }
    });
  };
};

export const clearListaCapas = () => {
  return {
    type: types.CLEAR_CAPAS_MAPA,
  };
};

export const getTiposPropiedad = () => {
  return (dispatch: any) => {
    return newSuscripcionTerceroApi.getTiposPropiedad().then((response) => {
      dispatch({
        type: types.LOAD_TIPO_PROPIEDAD,
        payload: response.data,
      });
    });
  };
};

export const clearTiposPropiedad = () => {
  return {
    type: types.CLEAR_TIPO_PROPIEDAD,
  };
};

export const getTiposClasificacionVivienda = () => {
  return (dispatch: any) => {
    return newSuscripcionTerceroApi
      .getTiposClasificacionVivienda()
      .then((response) => {
        dispatch({
          type: types.LOAD_TIPOS_VIVIENDA,
          payload: response.data,
        });
      });
  };
};
export const clearTiposClasificacionVivienda = () => {
  return {
    type: types.CLEAR_TIPOS_VIVIENDA,
  };
};

export const postCrearPropiedad = (form: any) => {
  return (dispatch: any) => {
    return newSuscripcionTerceroApi
      .postCrearPropiedad(form)
      .then((response) => {
        dispatch({
          type: types.LOAD_CREAR_PROPIEDAD,
          payload: response.data,
        });
      });
  };
};

export const clearCrearPropiedad = () => {
  return {
    type: types.CLEAR_CREAR_PROPIEDAD,
  };
};

export const putEditarPropiedad = (data: {
  id: string | number;
  form: any;
}) => {
  return (dispatch: any) => {
    return newSuscripcionTerceroApi
      .putEditarPropiedad(data)
      .then((response) => {
        dispatch({
          type: types.LOAD_UPDATE_PROPIEDAD,
          payload: response.data,
        });
      });
  };
};
export const clearActualizarPropiedad = () => {
  return {
    type: types.CLEAR_UPDATE_PROPIEDAD,
  };
};

export const putCopiarPropiedad = (data: {
  id: string | number;
  form: any;
}) => {
  return (dispatch: any) => {
    return newSuscripcionTerceroApi
      .putCopiarPropiedad(data)
      .then((response) => {
        dispatch({
          type: types.LOAD_CLONAR_PROPIEDAD,
          payload: response.data,
        });
      });
  };
};
export const clearCopiarPropiedad = () => {
  return {
    type: types.CLEAR_CLONAR_PROPIEDAD,
  };
};
export const deletePropiedad = (id: string | number) => {
  return (dispatch: any) => {
    return newSuscripcionTerceroApi.deletePropiedad(id).then((response) => {
      dispatch({
        type: types.LOAD_DELETE_PROPIEDAD,
        payload: response.data,
      });
    });
  };
};
export const clearBorrarPropiedad = () => {
  return {
    type: types.CLEAR_DELETE_PROPIEDAD,
  };
};

export const getBuscarPropiedadesPorTercero = (id: string | number) => {
  return (dispatch: any) => {
    return newSuscripcionTerceroApi
      .getBuscarPropiedadesPorTercero(id)
      .then((response) => {
        dispatch({
          type: types.LOAD_LISTAR_PROPIEDADES_TERCERO,
          payload: response.data,
        });
      });
  };
};
export const clearBuscarPropiedadesPorTercero = () => {
  return {
    type: types.CLEAR_LISTAR_PROPIEDADES_TERCERO,
  };
};

export const getBuscarPropiedadPorID = (id: string | number) => {
  return (dispatch: any) => {
    return newSuscripcionTerceroApi
      .getBuscarPropiedadPorID(id)
      .then((response) => {
        dispatch({
          type: types.LOAD_PROPIEDAD,
          payload: response.data,
        });
      });
  };
};
export const clearBuscarPropiedadPorID = () => {
  return {
    type: types.CLEAR_PROPIEDAD,
  };
};
