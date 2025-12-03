import axios from 'axios';
import RUTAS_API from '../../global/rutas_api';
import { URL_API_GC } from '../../global/constantes';


export default {
    
    datosGeneralesIniciarGestion(){
        return axios.get(URL_API_GC + RUTAS_API.INICIALIZAR_GESTION.DATOS_GENERALES);
    },
    iniciarGestion(id){
        //return true;
        return axios.get(URL_API_GC + RUTAS_API.INICIALIZAR_GESTION.INICIALIZAR_GESTION + "/" + id);
    },
    cambioEstadoGestion(accion,estAnt,estAct){
        return axios.get(URL_API_GC + RUTAS_API.INICIALIZAR_GESTION.CAMBIO_ESTADOS + "/" + accion + "/" + estAct + "/" + estAnt);
    },
}