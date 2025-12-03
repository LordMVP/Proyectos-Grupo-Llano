import * as acciones from './TiposAcciones'

export const testAction = () => {
    return {
        type: acciones.OBTENER_TEST,
        payload: null,
    }
}
