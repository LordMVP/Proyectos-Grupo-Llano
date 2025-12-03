import axios from 'axios';
import RUTAS_API from '../../global/rutas_api';
import { URL_API_GC } from '../../global/constantes';


export default {
    
   BuscarRecurso(id){
        return axios.get(URL_API_GC + RUTAS_API.GESTION_VISITA.CONSULTA_NRECURSO + "/" + id);
    },

    guardarDatos(formEdicionGV,listText){
        var itemGV = {
            gestionVisita:formEdicionGV,
           /* gvis_fechavisita: formEdicionGV.gvis_fechavisita,
            nvis_idregistro: formEdicionGV.nvis_idregistro,
            gvis_observacion: formEdicionGV.gvis_observacion,
            gvis_numeroradicado: formEdicionGV.gvis_numeroradicado,
            mgef_ideregistro: formEdicionGV.mgef_ideregistro,*/
            listGestionNovedadRecursos: listText
        };
        console.log(itemGV);
       return axios.post(URL_API_GC + RUTAS_API.GESTION_VISITA.GUARDAR_GESTION_VISITA, itemGV);
    },

    guardarDatosArchivo(formEdicionGV,archivo){
        var id=" ";
        
        if(formEdicionGV.gvis_idregistro!=undefined) id=formEdicionGV.gvis_idregistro;
       return axios.post(URL_API_GC + RUTAS_API.GESTION_VISITA.GUARDAR_ARCHIVO + "/" + id  + "/" + formEdicionGV.gvis_fechavisita
       + "/" + formEdicionGV.gvis_observacion
       + "/" + formEdicionGV.gvis_numeroradicado
       + "/" + formEdicionGV.mgef_ideregistro
       + "/" + formEdicionGV.nvis_idregistro, archivo);
       
    },

    listarGestionVistasbyMaestro(id){
        return axios.get(URL_API_GC + RUTAS_API.GESTION_VISITA.CONSULTAR_GESTION_VISITA + "/" + id);
    },

    eliminarRegistros(id){
        return axios.get(URL_API_GC + RUTAS_API.GESTION_VISITA.ELIMINAR_REGISTRO + "/" + id);
    }

}