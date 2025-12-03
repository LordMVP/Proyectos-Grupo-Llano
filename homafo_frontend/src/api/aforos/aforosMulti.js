import axios from 'axios'
import {authAxios} from './serversAxios'
import RUTAS_API from "../../data/rutasApi";

export const CreateAforoMulti = data => {


    return authAxios({

        //url: `${process.env.REACT_APP_BASE_URL}aforos/api/aforo/nuevo`,
        url:  RUTAS_API.API.ENDPOINT+ RUTAS_API.AFOROS.MULTIUSUARIO.NUEVO,
        method: 'POST',
        data
    }
    )
     .then(response => {  return response; }
    ).catch(error => {  return Promise.reject(error.status); });

}

export const UpdateAforosMulti = (data) => {
    return authAxios({
        url: RUTAS_API.API.ENDPOINT+RUTAS_API.AFOROS.MULTIUSUARIO.ACTUALIZAR,
        method: 'PUT',
        data

    })
    .then(response => {  return response; }
        ).catch(error => {  return Promise.reject(error.status); });

}

export function UpdateMultiAforosEdit(data) {
    console.log("data to PUT aforoedit:", data)
    return authAxios({
        url: RUTAS_API.API.ENDPOINT+ RUTAS_API.AFOROS.MULTIUSUARIO.EDITAR,
        method: 'PUT',
        data

    })
        // .then(x => x.data)

}


export function GetSuscripcion(id) {
    console.log("id suscripcion multi a buscar :", id)
    // const dataRequest = '?'+'suscripcion='+id+'&'+'codigoSub='+""+'&'+'radicadoPqrs='+""

    return Promise.resolve(
        {success: true,
            message:"ID encontrado Test ",
            totales: {
                numero_visitas: '12',
                volumen: '15',
                volumen_mes: '24'
            },
            cantidadSus: '2',
            porcentajeDistribuido: '100',
            susList:[{  factura:2,
                id: '3',
                participacionPorcentual: '50',
                codigoUsuario: '3331111',
                
            },{  factura:2,
                id: '3',
                participacionPorcentual: '50',
                codigoUsuario: '2221111',
                
            }],
            data: {idMultiusuario:"231231",idBarrio:11,estrato:"2",toneladas:"12",codigoUsuario:id.idSuscripcion,idSuscripcion:id.idSuscripcion}
    
}
        )

    // return authAxios({
    //     // url: `${process.env.REACT_APP_BASE_URL}aforos/api/aforo/editar`,
    //     url:  `${process.env.REACT_APP_BASE_URL}aforos/api/aforo/informacionGeneral/`+id,  //save all in update edite or by parts? id
    //     method: 'GET',
        

    // }).then(x => x.data).catch(error => { if(!error){return false}return Promise.reject(error); });

}



export function GetNuevoMulti(data) {
    console.log("data to edit:", data)

     const dataRequest = '?'+'suscripcion='+data.suscripcion+'&'+'codigoSub='+data.codigoSub+'&'+'radicadoPqrs='+data.radicadoPqrs
      return authAxios({
        url:  RUTAS_API.API.ENDPOINT+ RUTAS_API.AFOROS.MULTIUSUARIO.BUSCAR_SUSCRIPCION+ dataRequest,
        // url: `${process.env.REACT_APP_BASE_URL}aforos/api/aforo/buscarSuscripcion` + dataRequest,   
        // url: 'http://190.14.232.146:8081/aforos/api/aforo/buscarSuscripcion?codigoSub=0101800104002',   
        //  params,
         method: 'GET',
         
     }
      )
         .then(x => x.data)

}

////////
export function GetAforosMain(data) {
     return authAxios({
         url: RUTAS_API.API.ENDPOINT+RUTAS_API.AFOROS.MULTIUSUARIO.CONSULTAR_PRINCIPAL,
         method: 'GET',
         params:data,
         headers: { 'Content-Type': 'application/json' }
         
     })
         .then(x => x.data)

}


export function GetMultiAforoById(id) {
    return authAxios({
        url: RUTAS_API.API.ENDPOINT+RUTAS_API.AFOROS.MULTIUSUARIO.BUSCAR_BY_ID+id,
        method: 'GET'
    })
        .then(x => x.data)

}

export function GetMultiAforoByIdPadre(id) {
    return authAxios({
        url: RUTAS_API.API.ENDPOINT+RUTAS_API.AFOROS.MULTIUSUARIO.BUSCAR_BY_ID_PADRE+id,
        method: 'GET'
    })
        .then(x => x.data)

}


export function GetBaseAforosEdit(data) {
      return authAxios({
        url: `${process.env.REACT_APP_BASE_URL}aforos/api/aforo/informacionGeneral/` + data,   
         method: 'GET',

     })
    //     .then(x => x.data)

}


export function GetInfoBasicaAforosEdit(data) {

     return authAxios({
        //url: `${process.env.REACT_APP_BASE_URL}aforos/api/aforo/informacionGeneral/` + data,
        url: RUTAS_API.API.ENDPOINT+ RUTAS_API.AFOROS.NORMAL.INFORMACION_GENERAL_EDITAR ,
         method: 'POST',
         data

     })
        .then(x => x.data)

}

//////////////////////edit tables

const dataRealizados = {
    total: " 6",
    data: [
        {
            id: 1,
            numero_visita: ' 16',
            fecha_visita: ' 12/03/2020',
            dia: ' Jueves',
            aforador: ' 12356',
            semana: ' 15',
            volumen_total: ' 1'
        },
        {
            id: 2,
            numero_visita: ' 5',
            fecha_visita: ' 13/06/2020',
            dia: ' Martes',
            aforador: ' 12356',
            semana: ' 12',
            volumen_total: ' 2'
        },
        {
            id: 3,
            numero_visita: ' 3',
            fecha_visita: ' 02/09/2020',
            dia: ' Lunes',
            aforador: ' 12356',
            semana: ' 16',
            volumen_total: ' 3'
        }
    ]
}
export function GetAforosRealizadosEdit(data) {


    // const dataRequest = '?' + 'num_aforo=' + data


    return Promise.resolve(dataRealizados)
    // return authAxios({
    //      url:"http://127.0.0.1:8000/v1/aforonormal/aforosrealizado/"+dataRequest,

    //     method:'GET',
    //     //method:'POST',
    //     //data

    // })
    // .then(x=>x.data)

}


export function GetDetalleRealiz(id) {

    // return authAxios({
    //     url: "http://127.0.0.1:8000/v1/aforonormal/infobasicedit/" + id,

    //     method: 'GET',

    // })
    //     .then(x => x.data)


    return Promise.resolve(
        {
            totales: {
                recipiente: "#12",
                equivalencia: "#15",
                total: "#24"
            },
            observaciones: 'observaciones aforos test',
            data: [
                {
                    tipo_recipiente: 'typeR',
                    dimensiones: 'dim1',
                    cantidad_recipientes: 'cant3',
                    equivalencia: 'equivalenciatest',
                    total: 'N',

                },
                {
                    tipo_recipiente: 'typereci',
                    dimensiones: 'dim4',
                    cantidad_recipientes: 'cant1',
                    equivalencia: 'equivaltest',
                    total: 'N'
                },
            ]

        }
    )
}


const dataPendientes = {
        success: true,
        message: "null",
        data:[{
            id_aforo: " 12356",
            fecha_programacion: "9-12-2019",
            tecnico_aforador: " 12",
    
        },
        {
            id_aforo: " 1256",
            fecha_programacion: "12-06-2020",
            tecnico_aforador: " 12",
        }
        
        ]
    }


export function GetAforoPendientesEdit(data) {

    return Promise.resolve(dataPendientes).then(x => x.data)
    // console.log("data to edit:", data)

    // const dataRequest = '?' + 'num_aforo=' + data


    // return authAxios({
    //     url: "http://127.0.0.1:8000/v1/aforonormal/aforosrealizado/" + dataRequest,

    //     method: 'GET',
    //     //method:'POST',
    //     //data

    // })
    //     .then(x => x.data)

}

export function GetAforoConsolidadoEdit(data) {
    
    return Promise.resolve(
        {
            totales: {
                numeroVisitas: '12',
                volumen: '15',
                volumenMedio: '24'
            },
            factor_produccion: '0,23',
            tipo: 'GRAN PRODUCTOR',
            tafna: '5,6',
            data: [
                {
                    mes: 'Febrero',
                    numeroVisitas: '8',
                    volumen: '12,7',
                    volumenMedio: '1.4',
                    toneladas:"23"
                    
                },
                {
                    mes: 'Febrero',
                    numeroVisitas: '8',
                    volumen: '12,7',
                    volumenMedio: '1.4',
                    toneladas:"23"
                },
            ]
            
        }
        )
        // console.log("data to edit:", data)
        
        // const dataRequest = '?' + 'num_aforo=' + data
        
        
        // return authAxios({
            //    url:`${process.env.REACT_APP_BASE_URL}aforos/api/aforo/consolidadoAforo?numAforo=`+dataRequest,
            
            //     method: 'GET',
            //     //method:'POST',
            //     //data
            
            // })
            //     .then(x => x.data)
            
        }
        
        
        
        export function GetDetallesUsuario(data) {
            
            return Promise.resolve(
                {
                    totales: {
                        numero_visitas: '12',
                        volumen: '15',
                        volumen_mes: '24'
                    },
                    factor_produccion: '0,23',
                    tipo: 'GRAN PRODUCTOR',
                    tafna: '5,6',
                    data: [
                        {
                            codigo: '123123',
                            nombre: 'Febrero',
                            direccion: '8',
                            empresa: 'FALABELLA',
                            tipoUso: '8',
                            participacion: '8',
                            toneladas: '8',
                    estado: 'Activo'
                    
                },
                {
                    codigo: '123123',
                    nombre: 'az',
                    direccion: 'cll8',
                    empresa: 'Unico',
                    tipoUso: '8',
                    participacion: '8',
                    toneladas: '8',
                    estado: 'Inactivo'
                },
            ]
            
        }
        )
        // console.log("data to edit:", data)
        
        // const dataRequest = '?' + 'num_aforo=' + data
        
        
        // return authAxios({
            //     url: "http://127.0.0.1:8000/v1/aforonormal/aforosrealizado/" + dataRequest,
            
            //     method: 'GET',
            //     //method:'POST',
            //     //data
            
            // })
            //     .then(x => x.data)
            
        }
        
        export function GetRegistrosVisitas(data) {
            
            return Promise.resolve(
                {
                    totales: {
                        numero_visitas: '12',
                        volumen: '15',
                        volumen_mes: '24'
                    },
                    factor_produccion: '0,23',
                    tipo: 'GRAN PRODUCTOR',
                    tafna: '5,6',
                    data: [
                        {  id:2,
                            numeroVisitas: '3',
                            fechaVisita: '12-06-2012',
                            dia: 'Febrero',
                            aforador: 'Febrero',
                            semana: 'Febrero',
                            volumenTotal: '8',
                            PesoToneladas: '12,7',
                            
                        },
                        {   id:3,
                            numeroVisitas: '6',
                            fechaVisita: '12-07-2020',
                            dia: 'Febrero',
                            aforador: 'Febrero',
                            semana: 'Febrero',
                            volumenTotal: '8',
                    PesoToneladas: '12,7',
                },
            ]
            
        }
        )
        // console.log("data to edit:", data)
        
        // const dataRequest = '?' + 'num_aforo=' + data
        
        
        // return authAxios({
            //     url: "http://127.0.0.1:8000/v1/aforonormal/aforosrealizado/" + dataRequest,
            
            //     method: 'GET',
            //     //method:'POST',
            //     //data
            
            // })
            //     .then(x => x.data)
            
        }
        
    export function GetExtraordinarioData(data) {

        return Promise.resolve(
            {
                success:true,
                message:"Ok",
                data:{
                    idMultiusuario:"1122idmulti",
                    tipoDistribucion:"porcentual",
                    descripcion:"descripcion extraordina",
                    radicadoPqrs:"-",
                    barrio:"Estero",    /// id barrio  default value typehead
                    direccion:"calle x",
                    codigoComplementos:"codcomplem x",
                    nombreComplementos:"nomb complem x",
                    fechaRegistro:"",                   ////////////registro primera vez o fechadel extraordinario a crear? o fecha inicio
                    vigenciaDesde:"2012-07-03",
                    vigenciaHasta:"2013-08-03",
                    estado:"Inactivo",
                    factor:"0.4",
                    observaciones:"observac extra",
                    
                    susList:[
                            {factura:"17922112",codigoUsuario:"codusu1",idSuscripcion:"idsus111",segmento:"seg11",tipoUso:"tipous1111",participacionPorcentual:"30%",toneladas:"11",estrato:"3"},
                            {factura:"2256222",codigoUsuario:"codusu2",idSuscripcion:"idsus222",segmento:"seg11",tipoUso:"tipous222",participacionPorcentual:"70%",toneladas:"2",estrato:"3"},

                            ],






} //end data




}

                
        )
        
        
            // return authAxios({
            //     url:`${process.env.REACT_APP_BASE_URL}aforos/api/extraordinariomulti`,
        
            //     method: 'GET',
            //     //method:'POST',
            //     //data
        
            // }).then(x => x.data)
        
        }