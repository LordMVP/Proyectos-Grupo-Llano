import axios from 'axios';
import RUTAS_API from '../../global/rutas_api';
import { URL_API_GC } from '../../global/constantes';


export default {
    
    datosGeneralesLiquidarComision(listEje,idperido){
        var itemLC = {
            listIdsEjectivo:listEje,
            idPeriodo:idperido
        };
        
        return axios.post(URL_API_GC + RUTAS_API.LIQUIDAR_COMISION.DATOS_GENERALES,itemLC);
    },
    iniciarLiquidacion(id){
       
        return axios.get(URL_API_GC + RUTAS_API.LIQUIDAR_COMISION.INICIALIZAR_LIQUIDACION + "/" + id);
    },
    guardarAbono(formEdicionLC){
        
        var itemLC = {
            idMaestroGestion:formEdicionLC.mliq_idregistro,
            abono:formEdicionLC.mliq_valorbono
        };
       
       return axios.post(URL_API_GC + RUTAS_API.LIQUIDAR_COMISION.GUARDAR_ABONO, itemLC);
    },
    datosDetalle(id,tipo){
                
       return axios.get(URL_API_GC + RUTAS_API.LIQUIDAR_COMISION.DATOS_DETALLE+ "/" + id+ "/" + tipo);
    },
    consultarLiquidacionbyEjecutivos(formEdicion){
        var index = formEdicion.ejecutivos.indexOf("all");
        if (index > -1) {
            formEdicion.ejecutivos.splice(index, 1);
        }
        var itemLC = {
            listIdsEjectivo:formEdicion.ejecutivos,
            idPeriodo:formEdicion.mliq_periodo
        };
        
        return axios.post(URL_API_GC + RUTAS_API.LIQUIDAR_COMISION.DATOS_GENERALES,itemLC);
    },
    recalcularLiquidacionComision(ejecutivos, formEdicion){
        
        var itemLC = {
            listIdsEjectivo:ejecutivos,
            idPeriodo:formEdicion.mliq_periodo
        };
        return axios.post(URL_API_GC + RUTAS_API.LIQUIDAR_COMISION.RECALCULAR_LIQUIDACION,itemLC);
    },
    confirmarLiquidacionComision(accion,listmliqid){
       //el metodo sirve para cambiar estado a confirmado o para cerrar el periodo y cambiar a estdo cerrado
        var itemLC = {
            proceso:accion,
            listIdsMaestroComision:listmliqid
        };
        return axios.post(URL_API_GC + RUTAS_API.LIQUIDAR_COMISION.CONFIRMAR_LIQUIDACION, itemLC);
    },

    eliminarVacios(){
        //el metodo sirve para limpiar los datos que quedan sin concepto en el mliq
         return axios.post(URL_API_GC + RUTAS_API.LIQUIDAR_COMISION.ELIMINAR_VACIOS);
     },
    
}