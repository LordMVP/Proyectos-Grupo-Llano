import initialState from '../initialState';
import * as types from '../../actions/actionTypes'


export default  function (state = initialState.selectsMulti, action) {  // edit selcts and createa selct in initial state if it necesary
    
    switch (action.type) {
        
        case types.LOAD_TIPOS_AFORO:
            
            return  { ...state, tiposAforoMulti: action.payload   }

        case types.LOAD_NOMBRES_AFORO_MULTI:
            
            return  { ...state, nombresMulti: action.payload   }  
        
        case types.LOAD_DEPARTAMENTO_AFORO_MULTI:
            
            return  { ...state, departamentosMulti: action.payload   }    
        case types.LOAD_MUNICIPIO_AFORO_MULTI:
        
            return  { ...state, municipiosMulti: action.payload   }    
        case types.LOAD_BARRIO_AFORO__MULTI:
            
            return  { ...state, barriosMulti: action.payload   }    
        case types.LOAD_TIPOS_DISTRIBUCION:
            
            return  { ...state, tiposDistribucion: action.payload   }    
        
        case types.LOAD_ESTADO:
            
            return  { ...state, Estado: action.payload   } 

        case types.LOAD_TECNICO_AFORADOR:
            
            return  { ...state, tecnicoAforador: action.payload   }    
    

        default: return state;
    }
}