import axios from 'axios';


import{
    CONSULTAR_REPORTES,
    CONSULTAR_REPORTES_ERROR,
    CONSULTAR_REPORTE,
    CONSULTAR_REPORTE_ERROR,
    LIMPIAR_REPORTES
}
from './TiposAcciones';

import RUTAS_API from '../../global/rutas_api';

//change base url
axios.defaults.baseURL = 'http://localhost:8080/priase/api/v1/';
export const consultarReportes = () => dispatch => {
    axios.get(RUTAS_API.REPORTES.CONSULTAR_REPORTES, null)
        .then(respuesta => {
            console.log(respuesta)
            dispatch({
                type: CONSULTAR_REPORTES,
                payload: respuesta.data
            });
        })
        .catch(error => {
            console.log(error)
            dispatch({
                type: CONSULTAR_REPORTES_ERROR,
                payload: error
            });
        }
    );
};

export const consultarReporte = (objeto) => dispatch => {
     axios.post(RUTAS_API.CONSULTAR_REPORTE, objeto)
        .then(respuesta => {
            dispatch({
                type: CONSULTAR_REPORTE,
                payload: respuesta.data
            });
        }
    )
    .catch(error => {
            dispatch({
                type: CONSULTAR_REPORTE_ERROR,
                payload: error
            }
        );
    });
};

export  const limpiarReportes = () => dispatch => {
    dispatch({
        type: LIMPIAR_REPORTES,
        payload: null
    });
}
