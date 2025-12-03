import axios from 'axios'
import RUTAS_API from '../../data/rutasApi'
import {authAxios} from './serversAxios'


export const getTiposAforoMulti =()=>{                        

     return authAxios({
        url: RUTAS_API.API.ENDPOINT+ RUTAS_API.AFOROS.SELECTS.TIPOS_AFOROS_MULTI,
         method: 'GET' ,                       
     }).then(
        x => x.data.data 
    ).catch(error => { if(!error){return false}return Promise.reject(error); });
    }




export const getConceptoAforo =(idTipoAforo)=>{

    return authAxios({
        // url: `${proccess.env.BASE_URL} `,
        url: RUTAS_API.API.ENDPOINT+ RUTAS_API.AFOROS.SELECTS.CONCEPTOS_AFORO, //idTipoAforo
        method: 'GET' ,                       
    }
    ).then(x => x.data)

}


export const getBarrios =(idMunicipio)=>{

    return authAxios({
        url: RUTAS_API.API.ENDPOINT+ RUTAS_API.AFOROS.SELECTS.BARRIOS+idMunicipio,
        method: 'GET' ,                       
    }
    ).then(x => x.data.data)
    
}


export const getMunicipios =(idDepartamento)=>{
    console.log("municipios:dpt to find:",idDepartamento)
    return authAxios({
        
        url: RUTAS_API.API.ENDPOINT+ RUTAS_API.AFOROS.SELECTS.MUNICIPIOS, //+idMunicipio,
        method: 'GET' ,                       
    }
    ).then(x => x.data)
    
}


export const getDepartamentos =()=>{  // (idMunicipio)=>{
    
    return authAxios({
        url: RUTAS_API.API.ENDPOINT+ RUTAS_API.AFOROS.SELECTS.DEPARTAMENTOS, //+idMunicipio,
        method: 'GET' ,                       
    }
    ).then(x => x.data)

}


export const getNombresMulti =(terceroNombre)=>{

    return authAxios({
         url:  RUTAS_API.API.ENDPOINT+ RUTAS_API.AFOROS.SELECTS.NOMBRES_TERCERO_MULTI+terceroNombre,
        method: 'GET' ,                       
    }
    ).then(x => x.data).catch(error => { if(!error){return false}return Promise.reject(error); });

}
export const geTiposDistribucion =()=>{

    return authAxios({

         url:  RUTAS_API.API.ENDPOINT+ RUTAS_API.AFOROS.SELECTS.TIPOS_DISTRIBUCION,
        method: 'GET' ,                       
    }
    ).then(x => x.data).catch(error => { if(!error){return false}return Promise.reject(error); });

}


export const getEstados =()=>{

    return Promise.resolve({

        success: true,
        message: "null",
        data:[{
            "id": "01",
            "object": "Activo",
            "descripcion": "estado vigente"
        },
        {
            "id": "02",
            "object": "Inactivo",
            "descripcion": "estado vencido"
        }
        
        ]
    }

    ).then(
        x => x.data 
    ).catch(error => { return Promise.reject(error); })
    
    // return authAxios({
    //     // url: `${proccess.env.BASE_URL} `,
    //     url:apiURL.concat('estado'),
    //     method: 'GET' ,                       
    // }
    // ).then(x => x.data)

}

export const getTecnicoAforador =(idTercero)=>{

    return authAxios({
        url:RUTAS_API.API.ENDPOINT+ RUTAS_API.AFOROS.SELECTS.TECNICOS_AFORADORES,
        method: 'GET' ,                       
    }
    ).then(x => x.data).catch(error => { return Promise.reject(error); });

}