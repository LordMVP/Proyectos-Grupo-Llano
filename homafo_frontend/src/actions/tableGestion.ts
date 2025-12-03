import * as types from "./actionTypes";
import tablasGestionService from "../api/tablasGestion/tablasGestion";

const newApi = new tablasGestionService();
//actualizaciones
export const loadParametersEdit = () => {
  return async (dispatch) => {
    const response = await newApi.getListaUnidadesEdit();
    dispatch({
      type: types.LOAD_LISTA_UNIDADES_EDIT,
      payload: response.data,
    });
  };
};

export const loadBarriosAseo = () => {
  return async (dispatch) => {
    const response = await newApi.getListaBarriosAseo();
    dispatch({
      type: types.LOAD_LISTA_BARRIOS_ASEO,
      payload: response.data,
    });
  };
};

export const loadListaActualizacionOthers = (num: number, form: any) => {
  return async (dispatch) => {
    const response = await newApi.getListaActualizacionOthers(num, form);
    dispatch({
      type: types.LOAD_LISTA_ACTUALIZACION_OTHERS,
      payload: response.data,
    });
  };
};

export const clearListaActualizacionOthers = () => ({
  type: types.CLEAR_LISTA_ACTUALIZACION_OTHERS,
});

export const loadListaActualizacionPunto = (num: number) => {
  return async (dispatch) => {
    const response = await newApi.getListaActualizacionPunto(num);
    dispatch({
      type: types.LOAD_LISTA_ACTUALIZACION_PUNTO,
      payload: response.data,
    });
  };
};

export const clearListaActualizacionPunto = () => ({
  type: types.CLEAR_LISTA_ACTUALIZACION_PUNTO,
});

export const deleteActualizacion = (id: string | number) => {
  return async (dispatch) => {
    const response = await newApi.deleteActualizacion(id);
    dispatch({
      type: types.LOAD_BORRAR_ACTUALIZACION,
      payload: response.data ? true : null,
    });
  };
};

export const clearDeleteActualizacion = () => ({
  type: types.CLEAR_BORRAR_ACTUALIZACION,
});

export const loadImagenesActualizacion = (id: string | number) => {
  return async (dispatch) => {
    const response = await newApi.getImagenesActualizacion(id);
    dispatch({
      type: types.LOAD_IMAGENES_ACTUALIZACION,
      payload: response.data,
    });
  };
};
export const clearImagenesActualizacion = () => ({
  type: types.CLEAR_IMAGENES_ACTUALIZACION,
});

export const loadUpdateActualizacion = (form: any) => {
  return async (dispatch) => {
    const response = await newApi.updateActualizacion(form);
    dispatch({
      type: types.LOAD_UPDATE_ACTUALIZACION,
      payload: response.data,
    });
  };
};

export const loadAprobarActializacion = (id: string | number) => {
  return async (dispatch) => {
    const response = await newApi.postActualizacion(id);
    dispatch({
      type: types.LOAD_APROBAR_ACTUALIZACION,
      payload: response.data,
    });
  };
};
export const clearAprobarActializacion = () => ({
  type: types.CLEAR_APROBAR_ACTUALIZACION,
});

export const loadBuscarActualizacion = (id: string | number) => {
  return async (dispatch) => {
    const response = await newApi.getBuscarActualizacion(id);
    dispatch({
      type: types.LOAD_BUSCAR_ACTUALIZACION,
      payload: response.data,
    });
  };
};
export const clearBuscarActualizacion = () => ({
  type: types.CLEAR_BUSCAR_ACTUALIZACION,
});
//novedades
export const loadListaNovedad = (pag: string | number, form: any) => {
  return async (dispatch) => {
    const response = await newApi.getListaNovedad(pag, form);
    dispatch({
      type: types.LOAD_LISTA_NOVEDAD,
      payload: response.data,
    });
  };
};

export const clearListaNovedad = () => ({
  type: types.CLEAR_LISTA_NOVEDAD,
});

export const deleteNovedades = (id: string | number) => {
  return async (dispatch) => {
    const response = await newApi.deleteNovedad(id);
    dispatch({
      type: types.LOAD_BORRAR_NOVEDAD,
      payload: response.data,
    });
  };
};

export const clearDeleteNovedad = () => ({
  type: types.CLEAR_BORRAR_NOVEDAD,
});

export const aprobarNovedades = (id: string | number) => {
  return async (dispatch) => {
    const response = await newApi.aprobarNovedad(id);
    dispatch({
      type: types.LOAD_APROBAR_NOVEDAD,
      payload: response.data,
    });
  };
};

export const clearAprobarNovedad = () => ({
  type: types.CLEAR_APROBAR_NOVEDAD,
});
export const loadImagenesNovedad = (id: string | number) => {
  return async (dispatch) => {
    const response = await newApi.getImagenenNovedad(id);
    dispatch({
      type: types.LOAD_IMAGENES_NOVEDAD,
      payload: response.data,
    });
  };
};
export const clearImagenesNovedad = () => ({
  type: types.CLEAR_IMAGENES_NOVEDAD,
});
