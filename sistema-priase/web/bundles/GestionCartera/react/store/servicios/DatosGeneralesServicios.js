import axios from 'axios';
import RUTAS_API from '../../global/rutas_api';
import { URL_API_GC } from '../../global/constantes';


export default {
    listarDatosGenerales(){
        return axios.get(URL_API_GC + RUTAS_API.DATOS_GENERALES.CONSULTA_DATOS_DATOS_GENERALES);
    },
    listarDatosGeneralesVG(){
        return axios.get(URL_API_GC + RUTAS_API.VARIABLE_GLOBAL.CONSULTA_DATOS_DATOS_GENERALES);
    },
    listarDatosGeneralesEje(){
        return axios.get(URL_API_GC + RUTAS_API.EJECUTIVO.CONSULTA_DATOS_DATOS_GENERALES);
    },
}