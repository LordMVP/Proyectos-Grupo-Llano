import axios from 'axios';
import RUTAS_API from '../../global/rutas_api';
import { URL_API_GC } from '../../global/constantes';


export default {
    listarDatosEstadoCartera(){
        return axios.get(URL_API_GC + RUTAS_API.ESTADO_CARTERA.CONSULTA_ESTADO_CARTERA);
    },

    guardarDatosEstadoCartera(item, condicion){
        var itemEstadoCartera = {};
        itemEstadoCartera.ecar_idregistro = item.id == null ? null : item.id;
        itemEstadoCartera.uni_unidadestado = item.idEstado;
        itemEstadoCartera.ecar_nombre = item.nombre;
        itemEstadoCartera.ecar_descripcion = item.descripcion;
        itemEstadoCartera.ecar_observacion = item.observacion;
        itemEstadoCartera.ecar_codigointerno = item.codigoInterno;
        itemEstadoCartera.ecar_condicion = condicion;

        return axios.post(URL_API_GC + RUTAS_API.ESTADO_CARTERA.GUARDAR_ESTADO_CARTERA, itemEstadoCartera);
    }
}