import suscripcionSuscriptorApi from "../api/suscripcion/suscripcionHomologacion";
import * as types from "./actionTypes";
const newSuscripcionApi = new suscripcionSuscriptorApi();

export const loadBuscarHomologacion = (form: any) => {
  return (dispatch: any) => {
    return newSuscripcionApi.postBuscar(form).then((response) => {
      dispatch({
        type: types.LOAD_BUSCAR_HOMOLOGACION,
        payload: response.data,
      });
    });
  };
};

export const clearBuscarHomologacion = () => {
  return {
    type: types.CLEAR_BUSCAR_HOMOLOGACION,
  };
};
export const loadBuscarHomologaciones = (form: any) => {
  return (dispatch: any) => {
    return newSuscripcionApi.postBuscarHomologacion(form).then((response) => {
      dispatch({
        type: types.LOAD_BUSCAR_HOMOLOGACIONES_HOMOLOGABLES,
        payload: response.data,
      });
    });
  };
};

export const clearBuscarHomologaciones = () => {
  return {
    type: types.CLEAR_BUSCAR_HOMOLOGACIONES_HOMOLOGABLES,
  };
};
export const loadDetalleSuscripcion = (id: string | number) => {
  return (dispatch: any) => {
    return newSuscripcionApi.getDetalleSuscripcion(id).then((response) => {
      dispatch({
        type: types.LOAD_DETALLE_SUS_HOMOLOGACION,
        payload: response.data,
      });
    });
  };
};
export const clearDetalleSuscripcion = () => {
  return {
    type: types.CLEAR_DETALLE_SUS_HOMOLOGACION,
  };
};
export const loadConvenios = () => {
  return (dispatch: any) => {
    return newSuscripcionApi.getConvenios().then((response) => {
      dispatch({
        type: types.LOAD_CONVENIOS_HOMOLOGACION,
        payload: response.data,
      });
    });
  };
};

export const clearConvenios = () => {
  return {
    type: types.CLEAR_CONVENIOS_HOMOLOGACION,
  };
};

export const loadEmpresasConvenios = (id: string | number) => {
  return (dispatch: any) => {
    return newSuscripcionApi.getEmpresasConvenios(id).then((response) => {
      dispatch({
        type: types.LOAD_EMPRESA_CONVENIOS_HOMOLOGACION,
        payload: response.data,
      });
    });
  };
};
export const clearEmpresasConvenios = () => {
  return {
    type: types.CLEAR_EMPRESA_CONVENIOS_HOMOLOGACION,
  };
};

export const loadConveniosEmpresas = (id: string | number) => {
  return (dispatch: any) => {
    return newSuscripcionApi.getConveniosEmpresas(id).then((response) => {
      dispatch({
        type: types.LOAD_CONVENIOS_EMPRESA_HOMOLOGACION,
        payload: response.data,
      });
    });
  };
};
export const clearConveniosEmpresas = () => {
  return {
    type: types.CLEAR_CONVENIOS_EMPRESA_HOMOLOGACION,
  };
};
export const loadCiclosHomologacion = (id: string | number) => {
  return (dispatch: any) => {
    return newSuscripcionApi.getCiclos(id).then((response) => {
      dispatch({
        type: types.LOAD_CICLOS_HOMOLOGACION,
        payload: response.data,
      });
    });
  };
};
export const clearCiclosHomologacion = () => {
  return {
    type: types.CLEAR_CICLOS_HOMOLOGACION,
  };
};
export const loadCrearHomologacion = (form: any) => {
  return (dispatch: any) => {
    return newSuscripcionApi.postCrear(form).then((response) => {
      dispatch({
        type: types.LOAD_CREAR_HOMOLOGACION,
        payload: response.data,
      });
    });
  };
};

export const clearCrearHomologacion = () => {
  return {
    type: types.CLEAR_CREAR_HOMOLOGACION,
  };
};

export const loadActualizarHomologacion = (form: any) => {
  return (dispatch: any) => {
    return newSuscripcionApi.putActualizar(form).then((response) => {
      dispatch({
        type: types.LOAD_ACTUALIZAR_HOMOLOGACION,
        payload: response.data,
      });
    });
  };
};
export const clearActualizarHomologacion = () => {
  return {
    type: types.CLEAR_ACTUALIZAR_HOMOLOGACION,
  };
};

export const loadDsusHomologacion = (id: string | number) => {
  return (dispatch: any) => {
    return newSuscripcionApi.getDsusHomologacion(id).then((response) => {
      dispatch({
        type: types.LOAD_SUS_HOMOLOGACION,
        payload: response.data,
      });
    });
  };
};

export const clearDsusHomologacion = () => {
  return {
    type: types.CLEAR_SUS_HOMOLOGACION,
  };
};
export const loadEmpresas = () => {
  return (dispatch: any) => {
    return newSuscripcionApi.getEmpresas().then((response) => {
      dispatch({
        type: types.LOAD_EMPRESAS_HOMOLOGACION,
        payload: response.data,
      });
    });
  };
};

export const clearEmpresas = () => {
  return {
    type: types.CLEAR_EMPRESAS_HOMOLOGACION,
  };
};
export const loadEmpresasHomologables = () => {
  return (dispatch: any) => {
    return newSuscripcionApi.getEmpresasAlternaHologable().then((response) => {
      dispatch({
        type: types.LOAD_EMPRESAS_HOMOLOGABLE,
        payload: response.data,
      });
    });
  };
};

export const clearEmpresasHomologables = () => {
  return {
    type: types.CLEAR_EMPRESAS_HOMOLOGABLE,
  };
};
