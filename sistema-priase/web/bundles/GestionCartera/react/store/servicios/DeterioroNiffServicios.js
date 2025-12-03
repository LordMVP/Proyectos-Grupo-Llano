import axios from 'axios';
import RUTAS_API from '../../global/rutas_api';
import { URL_API_GC } from '../../global/constantes';


export default {
    
    datosGeneralesIniciarDeterioro(){
        
        return axios.get(URL_API_GC + RUTAS_API.INICIA_DETERIORO_NIFF.DATOS_GENERALES);
    },
    consultarInicializacionDeterioro(){
        
        return axios.get(URL_API_GC + RUTAS_API.INICIA_DETERIORO_NIFF.CONSULTAR_INICIACION);
    },
    iniciarDeterioro(id){
        //return true;
        return axios.get(URL_API_GC + RUTAS_API.INICIA_DETERIORO_NIFF.INICIALIZAR_DETERIORO + "/" + id);
    },
    cambioEstadoDeterioro(accion,estAnt,estAct){
        return axios.get(URL_API_GC + RUTAS_API.INICIA_DETERIORO_NIFF.CAMBIO_ESTADOS + "/" + accion + "/" + estAct + "/" + estAnt);
    },
    consultaDeterioro(dataform){
        
        var itemData = {
            listLongPeriodo: dataform.per_ideregistro,
            listLongDeterioro:dataform.tipo_deterioro
        };
        return axios.post(URL_API_GC + RUTAS_API.INICIA_DETERIORO_NIFF.CONSULTA_DETERIORO, itemData ); 
    },
    compararacionDeterioro(dataform){
        var itemData = {
            idPeriodoA: dataform.per_ideregistroA,
            idPeriodoB: dataform.per_ideregistroB,
            listLongDeterioro:dataform.tipo_deterioro
        };
        return axios.post(URL_API_GC + RUTAS_API.INICIA_DETERIORO_NIFF.COMPARACION_DETERIORO, itemData ); 
    },
    generarExcel(idFiltro,idVista){
        
        var itemData = {
            listLongPeriodo: idFiltro,
            listLongDeterioro:idVista
        };
        return axios.post(URL_API_GC + RUTAS_API.INICIA_DETERIORO_NIFF.GENERAR_EXCEL, itemData,{ responseType: 'blob'} ); 
    },
    generarExcelComparativo(dataform){
        var itemData = {
            listLongDeterioro:dataform.tipo_deterioro,
            idPeriodoA:dataform.per_ideregistroA,
            idPeriodoB:dataform.per_ideregistroB
        };
        return axios.post(URL_API_GC + RUTAS_API.INICIA_DETERIORO_NIFF.GENERAR_EXCEL_COMPARATIVO, itemData,{ responseType: 'blob'} ); 
    },
    ConsultarConceptos(id){
        
        return axios.get(URL_API_GC + RUTAS_API.INICIA_DETERIORO_NIFF.CONSULTA_DETALLE_CONCEPTOS + "/" + id);
    },
}