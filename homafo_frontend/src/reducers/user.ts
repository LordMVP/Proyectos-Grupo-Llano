import initialState from './initialState';
import * as types from '../actions/actionTypes'


export default function (state = initialState.user, action) {
    switch (action.type) {

        case types.LOAD_USER:
            console.log('\n LOAD_USER');
            return action.payload   

        case types.SET_AUTHENTICATED:
            console.log('\n SET_AUTHENTICATED');
            return {  ...state, authenticated: true }  
        case types.CLEAR_AUTHENTICATED:
            console.log('\n CLEAR_AUTHENTICATED');
            return {  ...state, authenticated: false } 


        default: return state;
    }
}