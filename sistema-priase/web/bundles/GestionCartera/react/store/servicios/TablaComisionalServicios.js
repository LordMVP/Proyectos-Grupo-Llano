import axios from 'axios';
import RUTAS_API from '../../global/rutas_api';
import { URL_API_GC } from '../../global/constantes';


export default {
    listarDatosTComisional(){
        return axios.get(URL_API_GC + RUTAS_API.TABLA_COMISIONAL.CONSULTA_TABLA_COMISONAL_EMPRESA);
    },

    guardarDatosTComisional(item, condicion){
        var itemTComisional = item;
        itemTComisional.tcom_condicion = condicion;

        return axios.post(URL_API_GC + RUTAS_API.TABLA_COMISIONAL.GUARDAR_TABLA_COMISIONAL, itemTComisional);
    },

    listarDatosTComisionalDetalle(id, idFuncion){
        return axios.get(URL_API_GC + RUTAS_API.TABLA_COMISIONAL.CONSULTA_TABLA_COMISIONAL_DETALLE + "/" + id + "/" + idFuncion) ;
    },

    guardarDatosTComisionalDetalle(item){
        var itemTComisionalDetalle = {};
        itemTComisionalDetalle.tcomidregistro = item.tcom_idregistro;
        itemTComisionalDetalle.tcomd_valorunitario = item.tcomd_valorunitario;
        itemTComisionalDetalle.tcomd_valordesde = item.tcomd_valordesde;
        itemTComisionalDetalle.tcomd_valorhasta = item.tcomd_valorhasta;
        itemTComisionalDetalle.tcomd_valorporcentaje = item.tcomd_valorporcentaje;
        itemTComisionalDetalle.fun_funciontipo = item.fun_funcionmcomision;

        return axios.post(URL_API_GC + RUTAS_API.TABLA_COMISIONAL.GUARDAR_TABLA_COMISIONAL_DETALLE, itemTComisionalDetalle);
    },

    eliminarDatosTComisionalDetalle(item){
        return axios.post(URL_API_GC + RUTAS_API.TABLA_COMISIONAL.ELIMINAR_TABLA_COMISIONAL_DETALLE, item);
    }
}