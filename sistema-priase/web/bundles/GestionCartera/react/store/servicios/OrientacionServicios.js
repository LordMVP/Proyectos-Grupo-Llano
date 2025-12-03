import axios from 'axios';
import RUTAS_API from '../../global/rutas_api';
import { URL_API_GC } from '../../global/constantes';


export default {
    listarDatosOrientacion(){
        return axios.get(URL_API_GC + RUTAS_API.ORIENTACION.CONSULTA_ORIENTACION);
    },

    guardarDatosOrientacion(item, condicion){
        var itemOrientacion = {};
        itemOrientacion.ori_idregistro = item.id == null ? null : item.id;
        itemOrientacion.uni_unidadestado = item.idEstado;
        itemOrientacion.ori_nombre = item.nombre;
        itemOrientacion.ori_descripcion = item.descripcion;
        itemOrientacion.ori_observacion = item.observacion;
        itemOrientacion.ori_codigointerno = item.codigoInterno;
        itemOrientacion.ori_condicion = condicion;

        return axios.post(URL_API_GC + RUTAS_API.ORIENTACION.GUARDAR_ORIENTACION, itemOrientacion);
    }
}