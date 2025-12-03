import axios from 'axios';
import RUTAS_API from '../../global/rutas_api';
import { URL_API_GC } from '../../global/constantes';


export default {
    listarDatosCondonacion(){
        return axios.get(URL_API_GC + RUTAS_API.CONDONACION.CONSULTA_CONDONACION);
    },

    guardarDatosCondonacion(item){
        var itemCondonacion = item;

        return axios.post(URL_API_GC + RUTAS_API.CONDONACION.GUARDAR_CONDONACION, itemCondonacion);
    }
}