import axios from 'axios';
import RUTAS_API from '../../global/rutas_api';
import { URL_API_GC } from '../../global/constantes';


export default {
    listarDatosEdadCartera(){
        return axios.get(URL_API_GC + RUTAS_API.EDAD_CARTERA.CONSULTA_EDAD_CARTERA);
    },

    guardarDatosEdadCartera(item){
        var itemEdadCartera = {};
        itemEdadCartera = item;
        return axios.post(URL_API_GC + RUTAS_API.EDAD_CARTERA.GUARDAR_EDAD_CARTERA, itemEdadCartera);
    }
}