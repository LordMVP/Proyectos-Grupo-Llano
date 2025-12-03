import {
    MOSTRAR_ALERTA,
    MOSTRAR_CARGADOR,
    OCULTAR_ALERTA,
    ACTUALIZAR_PROGRAMAS,
    MOSTRAR_PROGRAMA_MODAL,
    OCULTAR_PROGRAMA_MODAL,
} from './TiposAcciones'

export const mostrarCargador = (mostrar) => {
    return {
        type: MOSTRAR_CARGADOR,
        payload: mostrar,
    }
}

export const mostrarAlerta = (titulo, texto, botones) => (dispatch) => {
    dispatch({
        type: MOSTRAR_ALERTA,
        payload: { alerta: { titulo, texto, botones } },
    })
}

export const ocultarAlerta = () => (dispatch) => {
    dispatch({ type: OCULTAR_ALERTA })
}

export const mostrarProgramaModal = (componente, callbackCierre) => (
    dispatch
) => {
    dispatch({
        type: MOSTRAR_PROGRAMA_MODAL,
        payload: { componente, callbackCierre },
    })
}

export const ocultarProgramaModal = () => (dispatch) => {
    dispatch({ type: OCULTAR_PROGRAMA_MODAL })
}

export const actualizarProgramas = (programas) => (dispatch) => {
    dispatch({
        type: ACTUALIZAR_PROGRAMAS,
        payload: programas,
    })
}
