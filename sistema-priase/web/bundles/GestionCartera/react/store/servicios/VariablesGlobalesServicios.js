import axios from 'axios';
import RUTAS_API from '../../global/rutas_api';
import { URL_API_GC } from '../../global/constantes';


export default {
    listarDatosVGlobales(){
        return axios.get(URL_API_GC + RUTAS_API.VARIABLE_GLOBAL.CONSULTA_VARIABLE_GLOBAL);
    },

    guardarDatosVGlobales(item){
        if(item.uni_unimcarga === 3545 || item.uni_unimcarga === "3545"){
            item.uni_tipometodo = null;
            item.fun_funcionorigen = null;
            item.vglo_valorconstante = null;
        }
        if(item.uni_unimcarga === 3546 || item.uni_unimcarga === "3546"){
            item.uni_tipometodo = null;
            item.fun_funcionorigen = null;
            item.uni_atrmaestrocartera = null;
        }
        if(item.uni_unimcarga === 3547 || item.uni_unimcarga === "3547"){
            item.vglo_valorconstante = null;
            item.uni_atrmaestrocartera = null;
        }
        return axios.post(URL_API_GC + RUTAS_API.VARIABLE_GLOBAL.GUARDAR_VARIABLE_GLOBAL, item);
    },
    BuscarVariable(name){
        return axios.get(URL_API_GC + RUTAS_API.VARIABLE_GLOBAL.CONSULTA_VARIABLE_GLOBAL_INPUT + "/" + name);
    }
    
}