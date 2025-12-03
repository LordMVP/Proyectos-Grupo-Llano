import initialState from '../initialState';
import * as types from '../../actions/actionTypes'


export default  function (state = initialState.aforosMulti, action) {
    switch (action.type) {

        case types.LOAD_AFOROSMULTI_RESULT:
            
            return  action.payload  

        case types.CLEAR_AFOROSMULTI_RESULT:
            
            return [] 
        case types.LOAD_NUEVO_SUSCRIPCIONES_MULTI:
            return  action.payload
     


        default: return state;
        
    }
}