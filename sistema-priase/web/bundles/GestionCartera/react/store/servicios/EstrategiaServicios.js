import axios from 'axios';
import RUTAS_API from '../../global/rutas_api';
import { URL_API_GC } from '../../global/constantes';


export default {
    listarDatosEstrategia(){
        return axios.get(URL_API_GC + RUTAS_API.ESTRATEGIA.CONSULTA_ESTRATEGIA);
    },

    guardarDatosEstrategia(item, condicion, clasificaciones){
        var itemEstrategia = {};
        itemEstrategia.est_idregistro = item.id == null ? null : item.id;
        itemEstrategia.uni_unidadestado = item.idEstado;
        itemEstrategia.est_nombre = item.nombre;
        itemEstrategia.est_descripcion = item.descripcion;
        itemEstrategia.est_observacion = item.observacion;
        itemEstrategia.est_codigointerno = item.codigoInterno;
        itemEstrategia.clasificaciones = clasificaciones;
        itemEstrategia.est_condicion = condicion;

        return axios.post(URL_API_GC + RUTAS_API.ESTRATEGIA.GUARDAR_ESTRATEGIA, itemEstrategia);
    }
}