import axios from 'axios';
import RUTAS_API from '../../global/rutas_api';
import { URL_API_GC } from '../../global/constantes';
import { NavItem } from 'react-bootstrap';


export default {
    
    listarDatosFiltros(){
        return axios.get(URL_API_GC + RUTAS_API.MAESTRO_GESTION.CONSULTA_DATOS_FILTROS);
    },

    guardarDatosMaestroGestion(formEdicionMG, formEdicionInfoBasicaMG, formEdicionInfoGestionMG, formEdicionInfoGestionVisitaMG){
        var itemMG = {
            filtro: formEdicionMG,
            informacionBasica: formEdicionInfoBasicaMG,
            informacionGestion: formEdicionInfoGestionMG,
            informacionGestionVisita: formEdicionInfoGestionVisitaMG
        };
        
       
        return axios.post(URL_API_GC + RUTAS_API.MAESTRO_GESTION.GUARDAR_MAESTRO_GESTION, itemMG);
    },

    buscarFiltro(id){
        return axios.get(URL_API_GC + RUTAS_API.MAESTRO_GESTION.BUSQUEDA_DATOS_FILTRO + "/" + id); 
    },

    datosGeneralesMaestroGestion(){
        return axios.get(URL_API_GC + RUTAS_API.MAESTRO_GESTION.DATOS_GENERALES);
    },

    listaCiudadesByDepartamento(formEdicionInfoBasicaMG){
        return axios.post(URL_API_GC + RUTAS_API.MAESTRO_GESTION.CIUDADES_POR_DEPARTAMENTO,formEdicionInfoBasicaMG);
    },

    listaBarriosByCiudades(formEdicionInfoBasicaMG){
        return axios.post(URL_API_GC + RUTAS_API.MAESTRO_GESTION.BARRIOS_POR_CIUDADES,formEdicionInfoBasicaMG);
    },

    listaEjecutivosByEstrategia(id){
        return axios.get(URL_API_GC + RUTAS_API.MAESTRO_GESTION.EJECUTIVOS_POR_ESTRATEGIA + "/" + id);
    },

    ejecutarFiltro(idFiltro, idvista){
        return axios.get(URL_API_GC + RUTAS_API.MAESTRO_GESTION.EJECUTAR_FILTRO + "/" + idFiltro + "/" + idvista); 
    },

    verDetalleCliente(id){
        return axios.get(URL_API_GC + RUTAS_API.MAESTRO_GESTION.LIST_MAESTRO_DETALLE + "/" + id); 
    },

    guardarAsignacionDistribucion(formAsignacion,seleccionados,accion){
      
        var itemAD = {
            checkAD1: formAsignacion.checkAD1!=undefined?formAsignacion.checkAD1:false,
            checkAD2: formAsignacion.checkAD2!=undefined?formAsignacion.checkAD2:false,
            checkAD3: formAsignacion.checkAD3!=undefined?formAsignacion.checkAD3:false,
            listIdEjecutivo: formAsignacion.ejecutivos!=undefined?formAsignacion.ejecutivos:[],
            listIdMaestroFactura: seleccionados,
            cantidadDias: formAsignacion.cantidadDias,
            accion:accion
        };
        
        return axios.post(URL_API_GC + RUTAS_API.MAESTRO_GESTION.ASIGNACION_DISTRIBUCION, itemAD);
    },

    ejecutarBusquedaTercero(condicion){
        //console.log(condicion);
        return axios.get(URL_API_GC + RUTAS_API.MAESTRO_GESTION.EJECUTAR_BUSQUEDA_TERCERO + "/" + condicion ); 
    },

    generarCartas(item,id){
        var itemMG = {
            listIdMaestroFactura: item,
            idCartaSeleccionada:id
        };
        return axios.post(URL_API_GC + RUTAS_API.MAESTRO_GESTION.GENERAR_CARTAS, itemMG,{ responseType: 'blob'} ); 
    },
    
    generarIvr(item){
        var itemMG = {
            listIdMaestroFactura: item
        };
        return axios.post(URL_API_GC + RUTAS_API.MAESTRO_GESTION.GENERAR_IVR, itemMG ); 
    },

    generarExcel(idFiltro,idVista){
        var itemMG = {
            idFiltro: idFiltro,
            tipoVista:idVista
        };
        return axios.post(URL_API_GC + RUTAS_API.MAESTRO_GESTION.GENERAR_EXCEL, itemMG,{ responseType: 'blob'} ); 
    },

    generarExcelIVR(itemMG){
        return axios.post(URL_API_GC + RUTAS_API.MAESTRO_GESTION.GENERAR_EXCELIVR, itemMG,{ responseType: 'blob'} ); 
    },
}