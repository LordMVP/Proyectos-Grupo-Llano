import * as types from "./actionTypes";
import suscripcionSuscriptorApi from "../api/suscripcion/suscripcionSuscriptorApi";

const newApi = new suscripcionSuscriptorApi();

export const loadConvenios = () => {
  return (dispatch: any) => {
    return newApi.getConvenios().then((response) => {
      dispatch({
        type: types.LOAD_COVENIOS,
        payload: response.data,
      });
    });
  };
};

export const clearConvenios = () => ({
  type: types.CLEAR_COVENIOS,
});

export const loadCrearSuscriptor = (data: any) => {
  return (dispatch: any) => {
    return newApi.postCrearSuscriptor(data).then((response) => {
      dispatch({
        type: types.LOAD_CREAR_SUSCRIPTOR,
        payload: response.data,
      });
    });
  };
};

export const clearCrearSuscriptor = () => ({
  type: types.CLEAR_CREAR_SUSCRIPTOR,
});

export const loadCrearSuscripcion = (data: any) => {
  return (dispatch: any) => {
    return newApi.postCrearSuscripcion(data).then((response) => {
      dispatch({
        type: types.LOAD_CREAR_SUSCRIPCION,
        payload: response.data,
      });
    });
  };
};

export const clearCrearSuscripcion = () => ({
  type: types.CLEAR_CREAR_SUSCRIPCION,
});

export const loadEditarSuscripcion = (id: number | string, data: any) => {
  return (dispatch: any) => {
    return newApi.putEditarSuscripcion(id, data).then((response) => {
      dispatch({
        type: types.LOAD_EDITAR_SUSCRIPCION,
        payload: response.data,
      });
    });
  };
};

export const clearEditarSuscripcion = () => ({
  type: types.CLEAR_EDITAR_SUSCRIPCION,
});

export const loadBuscarSuscripcionId = (id: string | number) => {
  return (dispatch: any) => {
    return newApi.getBuscarSuscripcionId(id).then((response) => {
      dispatch({
        type: types.LOAD_BUSCAR_ID,
        payload: response.data,
      });
    });
  };
};
export const clearBuscarSuscripcionId = () => ({
  type: types.CLEAR_BUSCAR_ID,
});
export const loadDetallesSuscripcion = (id: string | number) => {
  return (dispatch: any) => {
    return newApi.getDetalleSuscripcion(id).then((response) => {
      dispatch({
        type: types.LOAD_DETALLE_SUSCRIPCION,
        payload: response.data,
      });
    });
  };
};

export const clearDetallesSuscripcion = () => ({
  type: types.CLEAR_DETALLE_SUSCRIPCION,
});

export const loadPropiedades = (id: string | number) => {
  return (dispatch: any) => {
    return newApi.getPropiedades(id).then((response) =>
      dispatch({
        type: types.LOAD_PROPIEDADES,
        payload: response.data,
      })
    );
  };
};

export const clearPropiedades = () => ({
  type: types.CLEAR_PROPIEDADES,
});

export const loadSuscripcionesByIdTercero = (id: string | number) => {
  return (dispatch: any) => {
    return newApi.getSuscripcionesByIDTercero(id).then((response) => {
      dispatch({
        type: types.LOAD_SUSCRIPCIONES_TERCERO,
        payload: response.data,
      });
    });
  };
};
export const clearSuscripcionesByIdTercero = () => ({
  type: types.CLEAR_SUSCRIPCIONES_TERCERO,
});

export const loadFiltrarSuscripcion = (body: any) => {
  return (dispatch: any) => {
    return newApi.postFiltrarSuscripciones(body).then((response) => {
      dispatch({
        type: types.LOAD_FILTRAR_SUSCRIPCION,
        payload: response.data,
      });
    });
  };
};

export const clearFiltrarSuscripcion = () => ({
  type: types.CLEAR_FILTRAR_SUSCRIPCION,
});

export const loadEstadosSuscripcion = () => {
  return (dispatch: any) => {
    return newApi.getEstadosSuscripcion().then((response) => {
      dispatch({
        type: types.LOAD_ESTADOS_SUSCRIPCION,
        payload: response.data,
      });
    });
  };
};

export const clearEstadosSuscripcion = () => ({
  type: types.CLEAR_ESTADOS_SUSCRIPCION,
});

export const loadEstratos = () => {
  return (dispatch: any) => {
    return newApi.getEstratos().then((response) => {
      dispatch({
        type: types.LOAD_ESTRATOS,
        payload: response.data,
      });
    });
  };
};

export const clearEstratos = () => ({
  type: types.CLEAR_ESTRATOS,
});

export const loadTiposUsos = () => {
  return (dispatch: any) => {
    return newApi.getTiposUsos().then((response) => {
      dispatch({
        type: types.LOAD_TIPOS_USO,
        payload: response.data,
      });
    });
  };
};

export const clearTiposUsos = () => ({
  type: types.CLEAR_TIPOS_USO,
});
export const loadLiquidaciones = () => {
  return (dispatch: any) => {
    return newApi.getliquidaciones().then((response) => {
      dispatch({
        type: types.LOAD_LIQUIDACIONES,
        payload: response.data,
      });
    });
  };
};

export const clearLiquidaciones = () => ({
  type: types.CLEAR_LIQUIDACIONES,
});

export const loadCiclos = () => {
  return (dispatch: any) => {
    return newApi.getCiclos().then((response) => {
      dispatch({
        type: types.LOAD_CICLOS,
        payload: response.data,
      });
    });
  };
};

export const clearCiclos = () => ({
  type: types.CLEAR_CICLOS,
});

export const loadRutas = (idmun: string | number, idbar: string | number) => {
  return (dispatch: any) => {
    return newApi.getRutas(idmun, idbar).then((response) => {
      dispatch({
        type: types.LOAD_RUTAS,
        payload: response.data,
      });
    });
  };
};

export const clearRutas = () => ({
  type: types.CLEAR_RUTAS,
});

export const loadRutasAprovechamiento = (tipoEstructura: string | number = 3224) => {
  return (dispatch: any) => {
    return newApi.getRutasAprovechamiento(tipoEstructura).then((response) => {
      dispatch({
        type: types.LOAD_RUTAS_APROVECHAMIENTO,
        payload: response.data,
      });
    }).catch((error) => {
      console.error('❌ Error al cargar rutas aprovechamiento:', error);
    });
  };
};

export const clearRutasAprovechamiento = () => ({
  type: types.CLEAR_RUTAS_APROVECHAMIENTO,
});

export const loadMacroRuta = () => {
  return (dispatch: any) => {
    return newApi.getMacroRuta().then((response) => {
      dispatch({
        type: types.LOAD_MACRORUTA,
        payload: response.data,
      });
    });
  };
};

export const clearMacroRuta = () => ({
  type: types.CLEAR_MACRORUTA,
});
export const loadMacroRutaById = (id: string | number) => {
  return (dispatch: any) => {
    return newApi.getMacroRutaById(id).then((response) => {
      dispatch({
        type: types.LOAD_MACRORUTA_BY_ID,
        payload: response.data,
      });
    });
  };
};

export const clearMacroRutaById = () => ({
  type: types.CLEAR_MACRORUTA_BY_ID,
});

export const loadHorariosRutas = (id: string | number) => {
  return (dispatch: any) => {
    return newApi.getHorarioByRutas(id).then((response) => {
      dispatch({
        type: types.LOAD_HORARIOS_RUTA,
        payload: response.data,
      });
    });
  };
};

export const clearHorariosRutas = () => ({
  type: types.CLEAR_HORARIOS_RUTA,
});

export const loadHorarios = (id: string | number) => {
  return (dispatch: any) => {
    return newApi.getHorarioByMacroRuta(id).then((response) => {
      dispatch({
        type: types.LOAD_HORARIOS,
        payload: response.data,
      });
    });
  };
};

export const clearHorarios = () => ({
  type: types.CLEAR_HORARIOS,
});

export const loadActividadEconomica = () => {
  return (dispatch: any) => {
    return newApi.getActividadEconomica().then((response) => {
      dispatch({
        type: types.LOAD_ACTIVIDAD_ECONOMICA,
        payload: response.data,
      });
    });
  };
};

export const clearActividadEconomica = () => ({
  type: types.CLEAR_ACTIVIDAD_ECONOMICA,
});
export const loadTiposSuscripcion = (
  idMun: string | number,
  idCon: string | number
) => {
  return (dispatch: any) => {
    return newApi.getTiposSuscripcion(idMun, idCon).then((response) => {
      dispatch({
        type: types.LOAD_TIPOS_SUSCRIPCION,
        payload: response.data,
      });
    });
  };
};

export const clearTiposSuscripcion = () => ({
  type: types.CLEAR_TIPOS_SUSCRIPCION,
});
export const loadConceptos = () => {
  return (dispatch: any) => {
    return newApi.getConceptosLiquidacion(796).then((response) => {
      dispatch({
        type: types.LOAD_CONCEPTOS,
        payload: response.data,
      });
    });
  };
};

export const clearConceptos = () => ({
  type: types.CLEAR_CONCEPTOS,
});
export const loadEmpresas = () => {
  return (dispatch: any) => {
    return newApi.getEmpresas().then((response) => {
      dispatch({
        type: types.LOAD_EMPRESAS,
        payload: response.data,
      });
    });
  };
};

export const getEmpresas = () => ({
  type: types.CLEAR_EMPRESAS,
});
