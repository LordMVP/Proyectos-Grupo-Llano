import axios from 'axios'
import utils from '../utils/Api'

export const login = data => {

    return Promise.resolve("")
    const url = `${process.env.REACT_APP_API_SERVER}/rugii/login`
    return axios(
        {
            method: 'post',
            url,
            data,
         
        }
    )
        .then((res) => utils.parseJSON(res))
        .then((res) => utils.getToken(res))

}
export const logout = () => {

    return new Promise((resolve, reject) => {
        setTimeout(function () {
            utils.logout();
            resolve({ success: true })
        }, 500);
    })
}

/**
 * Obtiene la informacion de un radicado.
 * @param {number} id numero de radicado o nit.
 * @return {Promise} informacion del radicado 
 */
export const getInfoSuscripcionById = id => {
    // const url = `${process.env.REACT_APP_COMPONENT_OIA}/suscripcion/${id}`

    return Promise.resolve({
        data:{            
            suscripcion:id,
            nombres:'joan david',
            apellidos:'zambrano lizarazo',
            direccion:'call1 22 3a3',
            fecha_registro: '05/03/2019',
            estado:1,
            observaciones:'Bien jugado',
            radicado_pqr:'54632',
            tipo_aforo:'1'
        }
    })
        // .then((res) => utils.checkStatus(res))
        .then((res) => utils.parseJSON(res))
}
/**
 * Obtiene la informacion de un radicado.
 * @param {number} id numero de radicado o nit.
 * @return {Promise} informacion del radicado 
 */
export const saveUsuariosAforados = data => {
    // const url = `${process.env.REACT_APP_COMPONENT_OIA}/suscripcion`

    return Promise.resolve({
        data:{            
           response:'success'
        }
    })
        .then((res) => utils.parseJSON(res))
}

// interface ISuscripcion {
//     suscripcion: number,
//     nombres: string,
//     apellidos: string,
//     direccion: string,
//     fecha_registro: string,
//     estado: number,
//     observaciones: string,
//     radicado_pqr: string,
//     tipo_aforo: number
// }