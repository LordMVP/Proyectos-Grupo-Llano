import axios from 'axios';
import RUTAS_API from '../../global/rutas_api';
import { URL_API_GC } from '../../global/constantes';


export default {
    
    datosGeneralesExportarKactus(){
        return axios.post(URL_API_GC + RUTAS_API.EXPORTAR_KACTUS.DATOS_GENERALES);
    },
    consultarComisiones(id){
        //return true;
        return axios.get(URL_API_GC + RUTAS_API.EXPORTAR_KACTUS.CONSULTAR_COMISION + "/" + id);
    },
    envioKactus(dataform){
       /* var itemMG = {
            idFiltro: idFiltro,
            tipoVista:idVista
        };*/
        return axios.post(URL_API_GC + RUTAS_API.EXPORTAR_KACTUS.ENVIAR_KACTUS, dataform); 
    }
  
}