import { MOSTRAR_ALERTA, MOSTRAR_CARGADOR, OCULTAR_ALERTA, ACTUALIZAR_PROGRAMAS, MOSTRAR_PROGRAMA_MODAL, OCULTAR_PROGRAMA_MODAL } from '../actions/TiposAcciones';

const initialState = {
  appCargando: false,
  alerta: { mostrar: false },
  programaModal: null,
  programas: []
};

const cargadorReducer = (state = initialState, action) => {
  return {
    ...state,
    appCargando: action.payload
  };
};

const mostrarAlertaReducer = (state = initialState, action) => {

  console.log(action)
  action.payload.alerta = { "titulo": state.alerta.titulo, "texto": state.alerta.texto }

  return {
    ...state,
    alerta: {
      mostrar: true,
      ...action.payload.alerta
    }
  };
};

const ocultarAlertaReducer = (state = initialState, action) => {
  return {
    ...state,
    alerta: {
      mostrar: false,
      texto: null
    }
  };
};

const mostrarProgramaModalReducer = (state = initialState, action) => {
  return {
    ...state,
    programaModal: {
      mostrar: true,
      ...action.payload
    }
  };
};

const ocultarProgramaModalReducer = (state = initialState, action) => {
  return {
    ...state,
    programaModal: {
      mostrar: false,
      component: null
    }
  };
};

const actualizarListaProgramas = (state = initialState, action) => {
  return {
    ...state,
    programas: action.payload
  }
};

export default (state = initialState, action) => {
  switch (action.type) {
    case MOSTRAR_CARGADOR:
      return cargadorReducer(state, action);
    case MOSTRAR_ALERTA:
      return mostrarAlertaReducer(state, action);
    case OCULTAR_ALERTA:
      return ocultarAlertaReducer(state, action);
    case MOSTRAR_PROGRAMA_MODAL:
      return mostrarProgramaModalReducer(state, action);
    case OCULTAR_PROGRAMA_MODAL:
      return ocultarProgramaModalReducer(state, action);
    case ACTUALIZAR_PROGRAMAS:
      return actualizarListaProgramas(state, action);
    default:
      return state;
  }
};
