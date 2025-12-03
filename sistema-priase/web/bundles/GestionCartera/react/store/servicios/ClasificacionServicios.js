import axios from 'axios';
import RUTAS_API from '../../global/rutas_api';
import { URL_API_GC } from '../../global/constantes';


export default {
    listarDatosClasificacion(){
        return axios.get(URL_API_GC + RUTAS_API.CLASIFICACION.CONSULTA_CLASIFICACION);
    },

    guardarDatosClasificacion(item, condicion){
        var itemClasificacion = {};
        itemClasificacion.cla_idregistro = item.id == null ? null : item.id;
        itemClasificacion.uni_unidadestado = item.idEstado;
        itemClasificacion.cla_nombre = item.nombre;
        itemClasificacion.cla_descripcion = item.descripcion;
        itemClasificacion.cla_observacion = item.observacion;
        itemClasificacion.cla_codigointerno = item.codigoInterno;
        itemClasificacion.cla_condicion = condicion;

        return axios.post(URL_API_GC + RUTAS_API.CLASIFICACION.GUARDAR_CLASIFICACION, itemClasificacion);
    }
}