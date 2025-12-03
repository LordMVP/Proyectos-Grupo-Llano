import initialState from "../initialState";

function suscripcionHomologacionReducer(
  state = initialState.homologacion,
  action
) {
  const objRedux = {
    LOAD_BUSCAR_HOMOLOGACION: (state, payload) => ({
      ...state,
      buscar: payload,
    }),
    CLEAR_BUSCAR_HOMOLOGACION: (state) => ({ ...state, buscar: null }),
    LOAD_BUSCAR_HOMOLOGACIONES_HOMOLOGABLES: (state, payload) => ({
      ...state,
      buscarHomologaciones: payload,
    }),
    CLEAR_BUSCAR_HOMOLOGACIONES_HOMOLOGABLES: (state) => ({
      ...state,
      buscarHomologaciones: null,
    }),

    LOAD_DETALLE_SUS_HOMOLOGACION: (state, payload) => ({
      ...state,
      detalle_sus: payload,
    }),
    CLEAR_DETALLE_SUS_HOMOLOGACION: (state) => ({
      ...state,
      detalle_sus: null,
    }),
    LOAD_CONVENIOS_HOMOLOGACION: (state, payload) => ({
      ...state,
      convenios: payload,
    }),
    CLEAR_CONVENIOS_HOMOLOGACION: (state) => ({ ...state, convenios: null }),
    LOAD_CONVENIOS_EMPRESA_HOMOLOGACION: (state, payload) => ({
      ...state,
      convenios_empresas: payload,
    }),
    CLEAR_CONVENIOS_EMPRESA_HOMOLOGACION: (state) => ({
      ...state,
      convenios_empresas: null,
    }),
    LOAD_EMPRESA_CONVENIOS_HOMOLOGACION: (state, payload) => ({
      ...state,
      empreas_convenios: payload,
    }),
    CLEAR_EMPRESA_CONVENIOS_HOMOLOGACION: (state) => ({
      ...state,
      empreas_convenios: null,
    }),
    LOAD_CICLOS_HOMOLOGACION: (state, payload) => ({
      ...state,
      ciclos: payload,
    }),
    CLEAR_CICLOS_HOMOLOGACION: (state) => ({ ...state, ciclos: null }),
    LOAD_CREAR_HOMOLOGACION: (state, payload) => ({ ...state, crear: payload }),
    CLEAR_CREAR_HOMOLOGACION: (state) => ({ ...state, crear: null }),
    LOAD_ACTUALIZAR_HOMOLOGACION: (state, payload) => ({
      ...state,
      actualizar: payload,
    }),
    CLEAR_ACTUALIZAR_HOMOLOGACION: (state) => ({ ...state, actualizar: null }),
    LOAD_SUS_HOMOLOGACION: (state, payload) => ({
      ...state,
      susHomologacion: payload,
    }),
    CLEAR_SUS_HOMOLOGACION: (state) => ({ ...state, susHomologacion: null }),
    LOAD_EMPRESAS_HOMOLOGACION: (state, payload) => ({
      ...state,
      empresas: payload,
    }),
    CLEAR_EMPRESAS_HOMOLOGACION: (state) => ({ ...state, empresas: null }),
    LOAD_EMPRESAS_HOMOLOGABLE: (state, payload) => ({
      ...state,
      empresasHologables: payload,
    }),
    CLEAR_EMPRESAS_HOMOLOGABLE: (state) => ({
      ...state,
      empresasHologables: null,
    }),
  };
  return objRedux[action.type]
    ? objRedux[action.type](state, action.payload)
    : state;
}

export default suscripcionHomologacionReducer;
