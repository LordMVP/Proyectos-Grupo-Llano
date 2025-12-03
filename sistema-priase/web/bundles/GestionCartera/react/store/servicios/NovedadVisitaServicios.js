import axios from 'axios';
import RUTAS_API from '../../global/rutas_api';
import { URL_API_GC } from '../../global/constantes';


export default {
    listarDatosNVisita(){
        return axios.get(URL_API_GC + RUTAS_API.NOVEDAD_VISITA.CONSULTA_NOVEDAD_VISITA);
    },

    guardarDatosNVisita(item){
        var itemNVisita = item;

        return axios.post(URL_API_GC + RUTAS_API.NOVEDAD_VISITA.GUARDAR_NOVEDAD_VISITA, itemNVisita);
    },

    listarDatosNVisitaRecurso(id){
        return axios.get(URL_API_GC + RUTAS_API.NOVEDAD_VISITA.CONSULTA_NOVEDAD_VISITA_RECURSO + "/" + id);
    },

    guardarDatosNVisitaRecurso(item){
        var itemNVisitaRecurso = {};
        itemNVisitaRecurso.nvisidregistro = item.nvis_idregistro;
        itemNVisitaRecurso.nvir_descripcion = item.nvir_descripcion;
        itemNVisitaRecurso.uni_unidadtrecurso = item.uni_unidadtrecurso;
        itemNVisitaRecurso.nvir_esobligatorio = item.nvir_esobligatorio;

        return axios.post(URL_API_GC + RUTAS_API.NOVEDAD_VISITA.GUARDAR_NOVEDAD_VISITA_RECURSO, itemNVisitaRecurso);
    },

    eliminarDatosNVisitaRecurso(item){
        var itemNVisitaRecurso = {};
        itemNVisitaRecurso.nvir_idregistro = item.nvir_idregistro;
        itemNVisitaRecurso.nvisidregistro = item.nvis_idregistro;
        itemNVisitaRecurso.nvir_descripcion = item.nvir_descripcion;
        itemNVisitaRecurso.uni_unidadtrecurso = item.uni_unidadtrecurso;
        itemNVisitaRecurso.nvir_esobligatorio = item.nvir_esobligatorio;

        return axios.post(URL_API_GC + RUTAS_API.NOVEDAD_VISITA.ELIMINAR_NOVEDAD_VISITA_RECURSO, itemNVisitaRecurso);
    }
}