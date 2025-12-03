
import axios from 'axios'
import {authAxios} from './serversAxios'
import RUTAS_API from '../../data/rutasApi'

export function GetAforosVisitasMain(data) { 
        return authAxios({
            url: RUTAS_API.API.ENDPOINT+ RUTAS_API.AFOROS.VISITAS.CONSULTAR_PRINCIPAL, 
            method: 'GET',
            params:data,
            headers: { 'Content-Type': 'application/json' }
    
        })
            .then(x => x.data.data)
    
    }
export function GetAforoVisitasEdit(data) {

    
    return authAxios({
        url: RUTAS_API.API.ENDPOINT+ RUTAS_API.AFOROS.VISITAS.VISITAS_PENDIENTES ,
    
        method: 'POST',
        data

    })
        .then(x => x.data)

}

export const getAforoVisitasCanceladas =(data)=>{

    return authAxios({
         url:  RUTAS_API.API.ENDPOINT+ RUTAS_API.AFOROS.VISITAS.VISITAS_CANCELADAS ,
         method: 'POST' ,
         data                       
        }
        ).then(x => x.data).catch(error => { return Promise.reject(error); });
        
        
    }

export const getAforoVisitasTramitadas =(data)=>{

    return authAxios({
         url:  RUTAS_API.API.ENDPOINT+ RUTAS_API.AFOROS.VISITAS.VISITAS_TRAMITADAS ,
         method: 'POST' ,
         data                       
        }
        ).then(x => x.data).catch(error => { return Promise.reject(error); });
        
        
    }

export const getAforoVisitasPendientes =(data)=>{

        return authAxios({
             url:  RUTAS_API.API.ENDPOINT+ RUTAS_API.AFOROS.VISITAS.VISITAS_PENDIENTES ,
             method: 'POST' ,
             data                       
            }
            ).then(x => x.data).catch(error => { return Promise.reject(error); });
            
            
}
    
    
    
export function UpdateAforosVisitasEdit(data) {
        console.log("data to PUT aforoedit:", data)
        return authAxios({
        url:  RUTAS_API.API.ENDPOINT+ RUTAS_API.AFOROS.VISITAS.EDITAR_VISITAS ,
        method: 'PUT',
        data
        
    })
    // .then(x => x.data)
    
}


export const getGenerarVisitas =(data)=>{
    
    return authAxios({
        url:  RUTAS_API.API.ENDPOINT+ RUTAS_API.AFOROS.VISITAS.GENERAR_VISITAS ,
        method: 'PUT' , 
        data                      
    }
    ).then(x => x.data).catch(error => { return Promise.reject(error); });
    
    
}
export const getTipoRecipientesVisitas =()=>{
    
    return authAxios({
        url:  RUTAS_API.API.ENDPOINT+ RUTAS_API.AFOROS.SELECTS.TIPOS_RECIPIENTES ,
        method: 'GET' ,                       
    }
    ).then(x => x.data).catch(error => { return Promise.reject(error); });
    
    
    }
    export const getTiposAdjunto =()=>{
        
        return authAxios({
            url:  RUTAS_API.API.ENDPOINT+ RUTAS_API.AFOROS.SELECTS.TIPOS_ADJUNTOS ,
            method: 'GET' ,                       
        }
        ).then(x => x.data).catch(error => { return Promise.reject(error); });
        
        
    }
    export const getFotosVisitas =(idDetalle)=>{
        console.log("fotos---->id:",idDetalle)
        
        return authAxios({
            url:  RUTAS_API.API.ENDPOINT+ RUTAS_API.AFOROS.VISITAS.FOTOS_VISITAS+idDetalle ,
            method: 'GET' ,    
        }
        ).then(x => x.data).catch(error => { return Promise.reject(error); });
        
        
    }
    export const postArchivosVisitas =(data)=>{
        console.log("fdata post----->",data)
        return authAxios({
            url:  RUTAS_API.API.ENDPOINT+ RUTAS_API.AFOROS.VISITAS.SUBIR_ARCHIVOS ,
        method: 'POST' ,
        data,
        headers: {
            'content-type': 'multipart/form-data'
        }                       
    }
    ).then(x => x.data).catch(error => { return Promise.reject(error); });

    
}
