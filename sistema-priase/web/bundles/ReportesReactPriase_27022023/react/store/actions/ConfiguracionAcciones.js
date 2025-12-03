import axios from 'axios';
import {
  CONSULTAR_TIPOS_CONFIGURACIONES,
  CONSULTAR_CONFIGURACIONES,
  CONSULTAR_CONFIGURACIONES_TIPO,
  CONSULTAR_CONFIGURACIONES_ERROR,
  LIMPIAR_CONFIGURACIONES
} from './TiposAcciones';
import RUTAS_API from '../../global/rutas_api';

export const consultarTiposConfiguraciones = () => dispatch => {
  axios
    .post(RUTAS_API.CONFIGURACION.CONSULTAR_TIPOS, { criterio: '' } )
    .then(respuesta => {
      dispatch({
        type: CONSULTAR_TIPOS_CONFIGURACIONES,
        payload: respuesta.data.datos
      });
    })
    .catch(error => {
      dispatch({
        type: CONSULTAR_CONFIGURACIONES_ERROR,
        payload: error
      });
    });
};

export const consultarConfiguraciones = () => dispatch => {
  axios
    .post(RUTAS_API.CONFIGURACION.CONSULTAR_TODAS)
    .then(respuesta => {
      dispatch({
        type: CONSULTAR_CONFIGURACIONES,
        payload: respuesta.datos
      });
    })
    .catch(error => {
      console.log("respuesta");
      console.log(respuesta);
      dispatch({
        
        type: CONSULTAR_CONFIGURACIONES_ERROR,
        payload: error
      });
    }); 
};

export const consultarConfiguracionesTipo = (filtro) => dispatch => {
  axios
    .post(RUTAS_API.CONFIGURACION.CONSULTAR_POR_TIPO, filtro)
    .then(respuesta => {
      dispatch({
        type: CONSULTAR_CONFIGURACIONES_TIPO,
        payload: respuesta.data.datos
      });
    })
    .catch(error => {
      dispatch({
        type: CONSULTAR_CONFIGURACIONES_ERROR,
        payload: error
      });
    });
};

export const limpiarConfiguraciones = () => dispatch => {
  dispatch({
    type: LIMPIAR_CONFIGURACIONES,
    payload: null
  });
};
