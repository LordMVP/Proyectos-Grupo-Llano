import axios from 'axios'
import RUTAS_API from '../../data/rutasApi'
import {authAxios} from './serversAxios'


export const getTiposAforo =()=>{  

     return authAxios({
        
          url:RUTAS_API.API.ENDPOINT+RUTAS_API.AFOROS.SELECTS.TIPOS_AFOROS,
         method: 'GET' ,                       
     }).then(
        x => x.data.data 
    )
    //  ).then(x => { console.log("api response create aforo:",x.data); return x.data; }
    //  ).catch(error => { console.error("api error create aforo:",error); return Promise.reject(error.status); });
    }




export const getFrecuenciaRecoleccion =(idTercero)=>{

    return authAxios({
        url: RUTAS_API.API.ENDPOINT+ RUTAS_API.AFOROS.SELECTS.FRECUENCIA_RECOLECCION+idTercero,
        method: 'GET' ,                       
    }
    ).then(x => x.data)

}


export const getTecnicoAforador =(idTercero)=>{

    return authAxios({
        url:RUTAS_API.API.ENDPOINT+ RUTAS_API.AFOROS.SELECTS.TECNICOS_AFORADORES,
        method: 'GET' ,                       
    }
    ).then(x => x.data).catch(error => { return Promise.reject(error); });

}


export const getConceptoAforo =(id_tipoaforo)=>{

    return authAxios({
       
        url:RUTAS_API.API.ENDPOINT+ RUTAS_API.AFOROS.SELECTS.CONCEPTOS_AFORO, //idTercero
        method: 'GET' ,                       
    }
    ).then(x => x.data).catch(error => { return Promise.reject(error); });

}


export const getBarrios =(idMunicipio)=>{

    return authAxios({
        url: RUTAS_API.API.ENDPOINT+ RUTAS_API.AFOROS.SELECTS.BARRIOS +idMunicipio,
        method: 'GET' ,                       
    }
    ).then(x => x.data.data).catch(error => { return Promise.reject(error); });

    
}

// no id parameter searchMain
export const getMunicipios =()=>{
    
     return authAxios({
       
         url: RUTAS_API.API.ENDPOINT+ RUTAS_API.AFOROS.SELECTS.MUNICIPIOS,
         method: 'GET' ,                       
     }
     ).then(x => x.data).catch(error => { return Promise.reject(error); });

}

////
export const getTipoGenerador =()=>{

    return authAxios({
         url: RUTAS_API.API.ENDPOINT+ RUTAS_API.AFOROS.SELECTS.TIPOS_GENERADORES,
         method: 'GET' ,                       
        }
        ).then(x => x.data.data).catch(error => { return Promise.reject(error); });
        
    }
    

    export const getActividad =()=>{
        
        return authAxios({
        url:RUTAS_API.API.ENDPOINT+ RUTAS_API.AFOROS.SELECTS.ACTIVIDADES,
        method: 'GET' ,                       
    }
    ).then(x => x.data.data).catch(error => { return Promise.reject(error); });

}

export const getEstados =()=>{
// UNIQUE API HARCODED 
    return Promise.resolve({

        success: true,
        message: "null",
        data:[
        {
            "id": "Inactivo",
            "object": "Inactivo",
            "descripcion": "estado vencido"
        },
        {
            "id": "Pre-Liquidacion",
            "object": "Pre-Liquidacion",
            "descripcion": "estado en pre-liquidacion"
        },
        {
            "id": "En Proceso",
            "object": "En Proceso",
            "descripcion": "estado en proceso de aforo"
        },
        
        ]
    }

    ).then(
        x => x.data 
    ).catch(error => { return Promise.reject(error); });
    
    // return authAxios({
    //     // url: `${proccess.env.BASE_URL} `,
    //     method: 'GET' ,                       
    // }
    // ).then(x => x.data)

}

export const getDepartamentos =()=>{

    return authAxios({
        url: RUTAS_API.API.ENDPOINT+ RUTAS_API.AFOROS.SELECTS.DEPARTAMENTOS,
        method: 'GET' ,                       
    }
    ).then(x => x.data).catch(error => { return Promise.reject(error); });

}


export const getTipoUso =()=>{

     return authAxios({
         url:  RUTAS_API.API.ENDPOINT+ RUTAS_API.AFOROS.SELECTS.TIPOS_USOS ,
         method: 'GET' ,                       
     }
     ).then(x => x.data.data).catch(error => { return Promise.reject(error); });
}
    


export const getCiclos =()=>{

    return authAxios({
        url: RUTAS_API.API.ENDPOINT+ RUTAS_API.AFOROS.SELECTS.CICLOS ,
        method: 'GET' ,                       
    }
    ).then(x => x.data.data).catch(error => { return Promise.reject(error); });

}
export const getRutas =()=>{

    return authAxios({
         url:  RUTAS_API.API.ENDPOINT+ RUTAS_API.AFOROS.SELECTS.RUTAS ,
        method: 'GET' ,                       
    }
    ).then(x => x.data.data).catch(error => { return Promise.reject(error); });

}

export const getEstratos =()=>{

    return authAxios({
         url:  RUTAS_API.API.ENDPOINT+ RUTAS_API.AFOROS.SELECTS.ESTRATOS ,
        method: 'GET' ,                       
    }
    ).then(x => x.data).catch(error => { return Promise.reject(error); });

}

export const getUbicaciones =()=>{

    return authAxios({
         url:  RUTAS_API.API.ENDPOINT+ RUTAS_API.AFOROS.SELECTS.UBICACIONES ,
        method: 'GET' ,                       
    }
    ).then(x => x.data).catch(error => { return Promise.reject(error); });

}

export const getTercerNombres =(terceroNombre)=>{

    return authAxios({
         url: RUTAS_API.API.ENDPOINT+ RUTAS_API.AFOROS.SELECTS.NOMBRES_TERCERO +terceroNombre,
        method: 'GET' ,                       
    }
    ).then(x => x.data).catch(error => { return Promise.reject(error); });

    
}

export const getMacroRutasRecoleccion =()=>{

    return authAxios({
        url: RUTAS_API.API.ENDPOINT+ RUTAS_API.AFOROS.SELECTS.MACRORUTA_RECOLECCION ,
        method: 'GET' ,                       
    }
    ).then(x => x.data.data).catch(error => { return Promise.reject(error); });

}

export const getClaseSusAforo =()=>{  

    return authAxios({
       
         url:RUTAS_API.API.ENDPOINT+RUTAS_API.AFOROS.SELECTS.TIPOS_CLASE_AFOROS,
        method: 'GET' ,                       
    }).then(
       x => x.data.data 
   )
   //  ).then(x => { console.log("api response create aforo:",x.data); return x.data; }
   //  ).catch(error => { console.error("api error create aforo:",error); return Promise.reject(error.status); });
   }

export const getRutaMicroMacro = (barrio)=>{
    return authAxios({
        url:RUTAS_API.API.ENDPOINT+RUTAS_API.AFOROS.SELECTS.RUTAS_RECOLECCION_MICRO_MACRO + barrio,
        method: 'GET',
    }).then(x => x.data).catch(error => { return Promise.reject(error); });
    
}
