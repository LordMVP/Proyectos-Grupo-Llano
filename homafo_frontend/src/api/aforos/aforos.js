import axios from 'axios'
import {authAxios} from './serversAxios'
import RUTAS_API from "../../data/rutasApi";

export const CreateNewAforo = data => {

    return authAxios({
        url:  RUTAS_API.API.ENDPOINT+ RUTAS_API.AFOROS.NORMAL.CREAR_NUEVO_AFORO ,
        method: 'POST',
        data
    }
    )
     .then(response => { return response; }
    ).catch(error => {  return Promise.reject(error); });

}



export function GetNuevo(data) {

     const dataRequest = '?'+'suscripcion='+data.idSuscripcion+'&'+'codigoSub='+data.codigoSub+'&'+'radicadoPqrs='+data.radicadoPqrs
      return authAxios({
        
         url:  RUTAS_API.API.ENDPOINT+ RUTAS_API.AFOROS.NORMAL.BUSCAR_SUSCRIPCION+ dataRequest,   
         method: 'GET',   
     }
      )
         .then(x => x.data)

}

export function GetListNuevo(data) {

    const dataRequest = '?'+'complemento='+data.complemento+'&'+'barrio='+data.barrio
     return authAxios({
       
        url:  RUTAS_API.API.ENDPOINT+ RUTAS_API.AFOROS.NORMAL.BUSCAR_SUSCRIPCION_X_COMPLEMENTO+ dataRequest,   
        method: 'GET',   
    }
     )
        .then(x => x.data)

}


export function GetAforosMain(data) {
     return authAxios({
        
         url:RUTAS_API.API.ENDPOINT+ RUTAS_API.AFOROS.NORMAL.CONSULTAR_PRINCIPAL, 
         method: 'GET',
         params:data,
         headers: { 'Content-Type': 'application/json' }

     })
         .then(x => x.data.data)

}


export function UpdateAforosEdit(data) {
    console.log("data to PUT aforoedit:", data)
    return authAxios({
        url: RUTAS_API.API.ENDPOINT+ RUTAS_API.AFOROS.NORMAL.EDITAR_NUEVO_AFORO,
        method: 'PUT',
        data

    })
        // .then(x => x.data)

}

export function GetInfoBasicaAforosEdit(data) {

     return authAxios({
        
        url: RUTAS_API.API.ENDPOINT+ RUTAS_API.AFOROS.NORMAL.INFORMACION_GENERAL_EDITAR ,
         method: 'POST',
         data
     })
         .then(x => x.data)

}




export function GetAforosRealizadosEdit(dataRequest) {

    return authAxios({
         url:RUTAS_API.API.ENDPOINT+ RUTAS_API.AFOROS.NORMAL.REALIZADOS_PENDIENTES +'?numAforo='+dataRequest,

        method:'GET',

    })
     .then(x=>x.data)

}




export function GetAforoConsolidadoEdit(dataRequest) {
    console.log("data to edit:", dataRequest)

    return authAxios({
        
        url: RUTAS_API.API.ENDPOINT+ RUTAS_API.AFOROS.NORMAL.CONSOLIDADOS +'?numAforo='+dataRequest,

        method: 'GET',
        //method:'POST',
        //data

    })
        .then(x => x.data)

}

export function GetAforoRealizadosBusqueda(data) {
    const dataRequest = data.numAforo+'&tecnicoAforador=' + data.tecnicoAforador+ '&desde=' + data.desde+ '&hasta=' + data.hasta

    return authAxios({

        //url:RUTAS_API.API.ENDPOINT+ RUTAS_API.AFOROS.NORMAL.REALIZADOS_PENDIENTES_BUSQUEDA+'/?numAforo='+dataRequest,
        url:RUTAS_API.API.ENDPOINT+ RUTAS_API.AFOROS.NORMAL.REALIZADOS_PENDIENTES +'?numAforo='+dataRequest,

        method: 'GET',
        //method:'POST',
        //data

    })
        .then(x => x.data)

}
export function GetAforoConsolidadoBusqueda(data) {
    
    const dataRequest = data.numAforo+'&tipoAforo=' + data.tipoAforo+ '&desde=' + data.desde+ '&hasta=' + data.hasta
    console.log("data to edit:", dataRequest)

    return authAxios({
        url:RUTAS_API.API.ENDPOINT+ RUTAS_API.AFOROS.NORMAL.CONSOLIDADO_BUSQUEDA +'?numAforo='+dataRequest,

        method: 'GET',
        //method:'POST',
        //data

    })
        .then(x => x.data)

}

export function GetAforoPadre(data) {

    const dataRequest = '?'+'numAforoPadre='+data.numAforoPadre
     return authAxios({
       
        url:  RUTAS_API.API.ENDPOINT+ RUTAS_API.AFOROS.NORMAL.BUSCAR_AFORO_PADRE+ dataRequest,   
        method: 'GET',   
    }
     )
        .then(x => x.data)

}



