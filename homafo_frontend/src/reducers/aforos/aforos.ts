import initialState from '../initialState';
import * as types from '../../actions/actionTypes'


export default  function (state = initialState.aforos, action) {
    switch (action.type) {

        case types.LOAD_AFOROS_RESULT:
            return  action.payload  

        case types.CLEAR_AFOROS_RESULT:
            return [] 
     


        default: return state;
        
    }
}