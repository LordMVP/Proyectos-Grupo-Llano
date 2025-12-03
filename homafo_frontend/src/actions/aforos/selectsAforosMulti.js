import * as API from '../../api/aforos/selectMultiusuario'
import * as actionsTypes from '../actionTypes'

export const loadTiposAforoMulti =()=>{

    return dispatch => {

        API.getTiposAforoMulti().then(x=>{
            dispatch(
                {
                    type: actionsTypes.LOAD_TIPOS_AFORO,
                    payload: x
                }
                )
            })

            }

}



  
export const loadBarrioMulti=(id)=>{
 
        return dispatch => {

        API.getBarrios(id).then(x=>{
            dispatch(
                {
                    type: actionsTypes.LOAD_BARRIO_AFORO__MULTI,
                    payload: x
                }
            )

        })
    }
}


export const loadConceptoAforo =(tipoaforo)=>{
    console.log("loadconcepto:::",tipoaforo)

        return dispatch => {

        API.getConceptoAforo (tipoaforo).then(x=>{
            dispatch(
                {
                    type: actionsTypes.LOAD_CONCEPTO_AFORO,
                    payload: x.data
                }
            )

        })
    }
}


export const loadMunicipioMulti =(idDepartamento)=>{

        return dispatch => {

        API.getMunicipios(idDepartamento).then(x=>{
            dispatch(
                {
                    type: actionsTypes.LOAD_MUNICIPIO_AFORO_MULTI,
                    payload: x.data
                }
            )

        })
    }
}


export const loadDepartamento =()=>{

    return dispatch => {

    API.getDepartamentos().then(x=>{
        dispatch(
            {
                type: actionsTypes.LOAD_DEPARTAMENTO_AFORO_MULTI,
                payload: x
            }
        )

    })
}
}

///news
export const loadEstado =()=>{

    return dispatch => {

    API.getEstados().then(x=>{
        dispatch(
            {
                type: actionsTypes.LOAD_ESTADO,
                payload: x
            }
        )

    })
}
}


export const loadTiposDistribucion =()=>{

    return dispatch => {

    API.geTiposDistribucion().then(x=>{
        dispatch(
            {
                type: actionsTypes.LOAD_TIPOS_DISTRIBUCION,
                payload: x.data
            }
        )

    })
}
}

export const loadTecnicoAforador =(id)=>{

    return dispatch => {
        
    API.getTecnicoAforador(id).then(x=>{
        dispatch(
            {
                type: actionsTypes.LOAD_TECNICO_AFORADOR,
                payload: x.data
            }
        )

    })
}
}


