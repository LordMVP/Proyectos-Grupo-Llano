import axios from 'axios';
import RUTAS_API from '../../global/rutas_api';
import { URL_API_GC } from '../../global/constantes';


export default {
    listarDatosMGestion(){
        return axios.get(URL_API_GC + RUTAS_API.METAS_GESTION.CONSULTA_METAS_GESTION);
    },

    guardarDatosMGestion(item, condicion){
        var itemMGestion = item;
        itemMGestion.mege_condicion = condicion;

        return axios.post(URL_API_GC + RUTAS_API.METAS_GESTION.GUARDAR_METAS_GESTION, itemMGestion);
    },

    listarDatosMGestionDetalle(id,idFuncion){
        return axios.get(URL_API_GC + RUTAS_API.METAS_GESTION.CONSULTA_METAS_GESTION_DETALLE  + "/" + id + "/" + idFuncion);
    },

    guardarDatosMGestionDetalle(item){
        var itemMGestionDetalle = {};
        itemMGestionDetalle.megeidregistro = item.mege_idregistro;
        itemMGestionDetalle.megd_valorunitario = item.megd_valorunitario;
        itemMGestionDetalle.megd_valordesde = item.megd_valordesde;
        itemMGestionDetalle.megd_valorhasta = item.megd_valorhasta;
        itemMGestionDetalle.megd_valorporcentaje = item.megd_valorporcentaje;
        itemMGestionDetalle.fun_funciontipo = item.fun_funcionlmeta;

        return axios.post(URL_API_GC + RUTAS_API.METAS_GESTION.GUARDAR_METAS_GESTION_DETALLE, itemMGestionDetalle);
    },

    eliminarDatosMGestionDetalle(item){
        return axios.post(URL_API_GC + RUTAS_API.METAS_GESTION.ELIMINAR_METAS_GESTION_DETALLE, item);
    }
}