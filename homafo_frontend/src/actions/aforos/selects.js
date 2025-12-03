import * as API from '../../api/aforos/select'
import * as actionsTypes from '../actionTypes'

export const loadTiposAforo =()=>{

    return dispatch => {

        API.getTiposAforo().then(x=>{
            dispatch(
                {
                    type: actionsTypes.LOAD_TIPOS_AFORO,
                    payload: x
                }
                )
            })

            }

}



export const loadFrecuenciaRecoleccion =()=>{

    return dispatch => {
    
        API.getFrecuenciaRecoleccion().then(x=>{
    
            dispatch(
                {
                    type: actionsTypes.LOAD_FRECUENCIA_RECOLECCION,
                    payload: x
                }
            )
        })
    
    }
    
}

  
export const loadBarrio=(id)=>{
 
        return dispatch => {

        API.getBarrios(id).then(x=>{
            dispatch(
                {
                    type: actionsTypes.LOAD_BARRIO,
                    payload: x
                }
            )

        }).catch(error => { return Promise.reject(error); });
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


export const loadMunicipio =()=>{

        return dispatch => {

        API.getMunicipios().then(x=>{
            dispatch(
                {
                    type: actionsTypes.LOAD_MUNICIPIO,
                    payload: !!x.data?x.data:[]
                }
            )

        })
    }
}



export const loadTipoGenerador =()=>{

    return dispatch => {

    API.getTipoGenerador().then(x=>{
        dispatch(
            {
                type: actionsTypes.LOAD_TIPO_GENERADOR,
                payload: x
            }
        )

    })
}
}

export const loadActividad =()=>{

    return dispatch => {

    API.getActividad().then(x=>{
        dispatch(
            {
                type: actionsTypes.LOAD_ACTIVIDAD,
                payload: x
            }
        )

    })
}
}

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

export const loadDepartamento =()=>{

    return dispatch => {

    API.getDepartamentos().then(x=>{
        dispatch(
            {
                type: actionsTypes.LOAD_DEPARTAMENTO,
                payload: x
            }
        )

    })
}
}


export const loadTipoUso =()=>{

    return dispatch => {

    API.getTipoUso().then(x=>{
        dispatch(
            {
                type: actionsTypes.LOAD_TIPO_USO,
                payload: x
            }
        )

    })
}
}

//falta
export const loadCiclo =()=>{

    return dispatch => {

    API.getCiclos().then(x=>{
        dispatch(
            {
                type: actionsTypes.LOAD_CICLO,
                payload: !!x?x:[]
            }
        )

    })
}
}
export const loadRuta =()=>{

    return dispatch => {

    API.getRutas().then(x=>{
        dispatch(
            {
                type: actionsTypes.LOAD_RUTA,
                payload: !!x?x:[]
            }
        )

    })
}
}

export const loadEstrato =()=>{

    return dispatch => {

    API.getEstratos().then(x=>{
        dispatch(
            {
                type: actionsTypes.LOAD_ESTRATO,
                payload: x.data
            }
        )

    })
}
}

export const loadUbicacion =()=>{

    return dispatch => {

    API.getUbicaciones().then(x=>{
        dispatch(
            {
                type: actionsTypes.LOAD_UBICACION,
                payload: x.data
            }
        )

    })
}
}

export const loadMacrorutasRecoleccion =()=>{

    return dispatch => {

    API.getUbicaciones().then(x=>{
        dispatch(
            {
                type: actionsTypes.LOAD_UBICACION,
                payload: x.data
            }
        )

    })
}
}

export const loadRutaMicroMacro = (barrio)=> {
    return dispatch => {

        API.getRutaMicroMacro(barrio).then(x=>{
            dispatch(
                {
                    type: actionsTypes.LOAD_RUTAMICROMACRO,
                    payload: !!x?x:[]
                }
            )
    
        })
    }
}


