import axios from 'axios';
import RUTAS_API from '../../global/rutas_api';
import { URL_API_GC } from '../../global/constantes';


export default {
    
    datosGeneralesConsolidarMetas(){
       
      return axios.get(URL_API_GC + RUTAS_API.CUMPLIMIENTO_METAS.DATOS_GENERALES);
    },
    
    datosGeneralesConsulta(tipoReporte, tipoMeta,lisPer,listEje){
      
      var item={};
      if(tipoReporte==2){
        var arrayListEje = [];
        var arrayListPer = [];
        arrayListEje.push(listEje);
        arrayListPer.push(lisPer)
         item = {
          tipoReporte:tipoReporte,
          idsPeriodo:[],
          idsMetaPerido:arrayListPer,
          idsEjecutivos:arrayListEje,
          tipoMeta:tipoMeta
        };
      }else{
        if(listEje==undefined) listEje=[];
         item = {
          tipoReporte:tipoReporte,
          idsPeriodo:[],
          idsMetaPerido:lisPer,
          idsEjecutivos:listEje
        };
      }
      
      
      return axios.post(URL_API_GC + RUTAS_API.CUMPLIMIENTO_METAS.CONSULTAR_BASICAMETAS,item);
    },

    inicioConsolidacion(ids){
      
        var item ={
          idsPeriodo:[],
          idsMetaPerido:ids
        }
        return axios.post(URL_API_GC + RUTAS_API.CUMPLIMIENTO_METAS.CONSOLIDAR_METAS,item);
    },

    datosDetalle(id,tipo){
                
       return axios.get(URL_API_GC + RUTAS_API.CUMPLIMIENTO_METAS.DATOS_DETALLE+ "/" + id+ "/" + tipo);
    },

   
    recalcularMetas(ids){
        
      var item ={
        idsPeriodo:[],
        idsMetaPerido:ids
      }
        return axios.post(URL_API_GC + RUTAS_API.CUMPLIMIENTO_METAS.RECALCULAR_METAS,item);
    },

    cambioEstado(accion,estAct,estAnt){
      return axios.get(URL_API_GC + RUTAS_API.CUMPLIMIENTO_METAS.CONFIRMAR_META + "/" + accion + "/" + estAct +  "/" + estAnt);
    },

    datosGeneralesConsultarHistoricos(){
      return axios.get(URL_API_GC + RUTAS_API.CUMPLIMIENTO_METAS.DATOS_GENERALES_CONSULTAR_METAS);
    },

    ConsultaHistoricos(form,tipoReporte,tipoMeta){
      
      var item={};

        if(form.ejecutivos==undefined) form.ejecutivos=[];
         item = {
          tipoReporte:tipoReporte,
          idsMetas:form.metas,
          idsEjecutivos:form.ejecutivos,
          perDesde:form.per_desde,
          perHasta:form.per_hasta
        };
      
      
      
      return axios.post(URL_API_GC + RUTAS_API.CUMPLIMIENTO_METAS.CONSULTAR_HISTORICOS_METAS,item);
    },

    ConsultaHistoricosReporte(tipoReporte, tipoMeta,idPeriodo,IdEjecutivo,idMeta){
      
      var item={};
      
        var arrayListEje = [];
        var arrayListMetas = [];
        arrayListEje.push(IdEjecutivo)
        arrayListMetas.push(idMeta)
         item = {
          tipoReporte:tipoReporte,
          idsMetas:arrayListMetas,
          idsEjecutivos:arrayListEje,
          tipoMeta:tipoMeta,
          perDesde:idPeriodo,
          perHasta:idPeriodo
        };
      
      
      
      return axios.post(URL_API_GC + RUTAS_API.CUMPLIMIENTO_METAS.CONSULTAR_HISTORICOS_METAS,item);
    },
  
}