import initialState from "../initialState";

function tablasGestion(state = initialState.tablasGestion, action) {
  const objReducer = {
    LOAD_LISTA_BARRIOS_ASEO: (state, payload) => ({
      ...state,
      listaBarriosAseo: payload,
    }),
    LOAD_LISTA_UNIDADES_EDIT: (state, payload) => ({
      ...state,
      listaUnidadesEdit: payload,
    }),
    LOAD_LISTA_ACTUALIZACION_OTHERS: (state, payload) => ({
      ...state,
      listaActualizacionOthers: payload,
    }),
    CLEAR_LISTA_ACTUALIZACION_OTHERS: (state) => ({
      ...state,
      listaActualizacionOthers: [],
    }),
    LOAD_LISTA_ACTUALIZACION_PUNTO: (state, payload) => ({
      ...state,
      listaActualizacionPunto: payload,
    }),
    CLEAR_LISTA_ACTUALIZACION_PUNTO: (state) => ({
      ...state,
      listaActualizacionPunto: [],
    }),
    LOAD_BORRAR_ACTUALIZACION: (state) => ({
      ...state,
      borrarActualizacion: true,
    }),
    CLEAR_BORRAR_ACTUALIZACION: (state) => ({
      ...state,
      borrarActualizacion: null,
    }),
    LOAD_IMAGENES_ACTUALIZACION: (state, payload) => ({
      ...state,
      imagenesActualizacion: payload,
    }),
    CLEAR_IMAGENES_ACTUALIZACION: (state) => ({
      ...state,
      imagenesActualizacion: [],
    }),
    LOAD_UPDATE_ACTUALIZACION: (state, payload) => ({
      ...state,
      updateActualizacion: payload,
    }),
    LOAD_APROBAR_ACTUALIZACION: (state, payload) => ({
      ...state,
      aprobarActualizacion: payload,
    }),
    CLEAR_APROBAR_ACTUALIZACION: (state) => ({
      ...state,
      aprobarActualizacion: null,
    }),
    LOAD_BUSCAR_ACTUALIZACION: (state, payload) => ({
      ...state,
      actualizacion: payload,
    }),
    CLEAR_BUSCAR_ACTUALIZACION: (state) => ({
      ...state,
      actualizacion: null,
    }),
    //novedades
    LOAD_LISTA_NOVEDAD: (state, payload) => ({
      ...state,
      listaNovedad: payload,
    }),
    CLEAR_LISTA_NOVEDAD: (state) => ({
      ...state,
      listaNovedad: [],
    }),
    LOAD_BORRAR_NOVEDAD: (state) => ({
      ...state,
      borrarNovedad: true,
    }),
    CLEAR_BORRAR_NOVEDAD: (state) => ({
      ...state,
      borrarNovedad: false,
    }),
    LOAD_APROBAR_NOVEDAD: (state) => ({
      ...state,
      aprobarNovedad: true,
    }),
    CLEAR_APROBAR_NOVEDAD: (state) => ({
      ...state,
      aprobarNovedad: false,
    }),
    LOAD_IMAGENES_NOVEDAD: (state, payload) => ({
      ...state,
      imagenesNovedad: payload,
    }),
    CLEAR_IMAGENES_NOVEDAD: (state) => ({
      ...state,
      imagenesNovedad: [],
    }),
  };
  return objReducer[action.type]
    ? objReducer[action.type](state, action.payload)
    : state;
}
export default tablasGestion;
