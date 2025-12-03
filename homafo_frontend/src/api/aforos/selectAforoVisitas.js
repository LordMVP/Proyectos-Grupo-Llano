// import axios from 'axios'
// import {authAxios} from './serversAxios'
// // const apiURL = 'http://127.0.0.1:8000/aforos/'
// const apiURL = 'http://127.0.0.1:8000/api/contenidoEstatico/' 
// // const serverUrl = `${proccess.env.BASE_URL} `


// export const getTiposAforo =()=>{                        

//      return axios({
        
//           url:`${process.env.REACT_APP_BASE_URL}aforos/api/contenidoEstatico/tiposAforos`,
//          method: 'GET' ,                       
//      }).then(
//         x => x.data.data 
//     )
//     //  ).then(x => { console.log("api response create aforo:",x.data); return x.data; }
//     //  ).catch(error => { console.error("api error create aforo:",error); return Promise.reject(error.status); });
//     }




// export const getFrecuenciaRecoleccion =()=>{

//     return Promise.resolve({

//         success: true,
//         message: "null",
//         data:[{
//             "id": 1083,
//             "nombre": "L-M-J",
//             "descripcion": "rec"
//         },
//         {
//             "id": 1084,
//             "nombre": "M-J-S",
//             "descripcion": "rec"
//         },
//         {
//             "id": 1084,
//             "nombre": "L-M-V",
//             "descripcion": "rec"
//         },
//         {
//             "id": 1084,
//             "nombre": "L-S",
//             "descripcion": "rec"
//         },
        
//         ]
//     }

//     ).then(
//         x => x.data 
//         ).catch(error => { return Promise.reject(error); });

//     // return axios({
//     //     url:`${process.env.REACT_APP_BASE_URL}aforos/api/contenidoEstatico/frecuenciaRecoleccion/`+idTercero,
//     //     url: apiURL.concat('frecuenciarecoleccion'),
//     //     method: 'GET' ,                       
//     // }
//     // ).then(x => x.data)

// }


// export const getTecnicoAforador =(idTercero)=>{

//     return axios({
//         // url: `${proccess.env.BASE_URL} `,
//         url:`${process.env.REACT_APP_BASE_URL}aforos/api/contenidoEstatico/tecnicosAforadores/`,
//         method: 'GET' ,                       
//     }
//     ).then(x => x.data).catch(error => { return Promise.reject(error); });

// }


// export const getBarrios =(idMunicipio)=>{

//     return axios({
//         url: `${process.env.REACT_APP_BASE_URL}aforos/api/contenidoEstatico/barrios/`+idMunicipio,
//         method: 'GET' ,                       
//     }
//     ).then(x => x.data.data).catch(error => { return Promise.reject(error); });

// }

// // no id parameter searchMain
// export const getMunicipios =()=>{
    
//      return authAxios({
       
//          url: `${process.env.REACT_APP_BASE_URL}aforos/api/contenidoEstatico/municipios`,
//         //  url:apiURL.concat('municipios/').concat(id),
//          method: 'GET' ,                       
//      }
//      ).then(x => x.data).catch(error => { return Promise.reject(error); });

// }

// ////
// export const getTipoGenerador =()=>{

//     return axios({
//          url: `${process.env.REACT_APP_BASE_URL}aforos/api/contenidoEstatico/tiposGeneradores`,
//         // url:apiURL.concat('TiposGeneradores'),
//         method: 'GET' ,                       
//     }
//     ).then(x => x.data.data).catch(error => { return Promise.reject(error); });

// }


// export const getActividad =()=>{

//     return axios({
//         url:apiURL.concat('actividad'),
//         method: 'GET' ,                       
//     }
//     ).then(x => x.data).catch(error => { return Promise.reject(error); });

// }
// /////news

// export const getEstados =()=>{

//     return Promise.resolve({

//         success: true,
//         message: "null",
//         data:[{
//             "id": "01",
//             "object": "Activo",
//             "descripcion": "estado vigente"
//         },
//         {
//             "id": "02",
//             "object": "Inactivo",
//             "descripcion": "estado vencido"
//         }
        
//         ]
//     }

//     ).then(
//         x => x.data 
//     ).catch(error => { return Promise.reject(error); });
    
//     // return axios({
//     //     // url: `${proccess.env.BASE_URL} `,
//     //     url:apiURL.concat('estado'),
//     //     method: 'GET' ,                       
//     // }
//     // ).then(x => x.data)

// }

// export const getDepartamentos =()=>{

//     return axios({
//         // url: `${proccess.env.BASE_URL} `,
//         url: `${process.env.REACT_APP_BASE_URL}aforos/api/departamentos/lista`,
//         method: 'GET' ,                       
//     }
//     ).then(x => x.data).catch(error => { return Promise.reject(error); });

// }


// export const getTipoUso =()=>{

//      return axios({
//          url:  `${process.env.REACT_APP_BASE_URL}aforos/api/contenidoEstatico/tiposUsos`,
//         //  url:apiURL.concat('tipoUsos'),
//          method: 'GET' ,                       
//      }
//      ).then(x => x.data.data).catch(error => { return Promise.reject(error); });
// }
    


// export const getCiclos =()=>{

//     return axios({
//         url:  `${process.env.REACT_APP_BASE_URL}aforos/api/contenidoEstatico/ciclos`,
//         method: 'GET' ,                       
//     }
//     ).then(x => x.data.data).catch(error => { return Promise.reject(error); });

// }
// export const getRutas =()=>{

//     return axios({
//          url:  `${process.env.REACT_APP_BASE_URL}aforos/api/contenidoEstatico/rutas`,
//         //url:apiURL.concat('rutas'),
//         method: 'GET' ,                       
//     }
//     ).then(x => x.data.data).catch(error => { return Promise.reject(error); });

// }

// export const getEstratos =()=>{

//     return axios({
//          url:  `${process.env.REACT_APP_BASE_URL}aforos/api/contenidoEstatico/estratos`,
//         // url:apiURL.concat('rutas'),
//         method: 'GET' ,                       
//     }
//     ).then(x => x.data).catch(error => { return Promise.reject(error); });

// }

// export const getUbicaciones =()=>{

//     return axios({
//          url:  `${process.env.REACT_APP_BASE_URL}aforos/api/contenidoEstatico/ubicaciones`,
//         // url:apiURL.concat('rutas'),
//         method: 'GET' ,                       
//     }
//     ).then(x => x.data).catch(error => { return Promise.reject(error); });

// }

// export const getTercerNombres =(terceroNombre)=>{

//     return axios({
//          url:  `${process.env.REACT_APP_BASE_URL}aforos/api/contenidoEstatico/terceroNombreCompleto/`+terceroNombre,
//         // url:apiURL.concat('rutas'),
//         method: 'GET' ,                       
//     }
//     ).then(x => x.data).catch(error => { return Promise.reject(error); });

// }