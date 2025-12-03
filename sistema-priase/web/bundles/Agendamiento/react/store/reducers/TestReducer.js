import { Util } from 'appfuture-react'
import * as acciones from '../actions/TiposAcciones'

// Ejemplo de State para TestReducer
const initialState = {
    temp: null,
}

// Ejemplo de action de Redux usando thunk
const obtenerTest = (state, action) => {
    return Util.actualizarObjeto(state, { temp: 1 })
}

// Ejemplo de Switch case para controlar los actions y los reducers de Redux
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case acciones.OBTENER_TEST:
            return obtenerTest(state, action)
        default:
            return state
    }
}

export default reducer
