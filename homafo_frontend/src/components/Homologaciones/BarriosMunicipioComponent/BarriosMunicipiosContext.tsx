import React, {createContext, useReducer} from 'react';

const initialState = {};
const context = createContext(initialState);
const { Provider } = context;

const reducer = (state,action) => {
    switch(action.type){
        case 'BARRIO_MUNICIPIO': { return [...state,action.payload];};
        default:
            return state;        
    }
}

const BarrioMunicipioProvider = ({children}) => {
    const [state, dispatch] = useReducer(reducer,initialState);
    return <Provider value={[state, dispatch]}>{children}</Provider>;
}

export default {context,BarrioMunicipioProvider};