import axios from 'axios';
import RUTAS_API from '../../global/rutas_api';
import { URL_API_GC } from '../../global/constantes';


export default {
    
    listarDatosEjecutivo(){
        return axios.get(URL_API_GC + RUTAS_API.EJECUTIVO.CONSULTA_EJECUTIVO);
    },

   listarDatosTercero(documento){
        return axios.get(URL_API_GC + RUTAS_API.TERCERO.CONSULTA_TERCERO_DOCUMENTO+ "/" + documento);
    },

    guardarDatosEjecutivo(item){
        return axios.post(URL_API_GC + RUTAS_API.EJECUTIVO.GUARDAR_EJECUTIVO, item);
    }
}