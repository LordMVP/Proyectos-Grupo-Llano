import initialState from '../initialState';
import * as types from '../../actions/actionTypes'


export default  function (state = initialState.selects, action) {
    switch (action.type) {
        
        case types.LOAD_TIPOS_AFORO:
             
            return  { ...state, tiposAforo: action.payload   }

        case types.LOAD_FRECUENCIA_RECOLECCION:
             
            return  { ...state, frecuenciaRecoleccion: action.payload   }    
        
        case types.LOAD_BARRIO:
             
            return  { ...state, Barrio: action.payload   }  
              
        case types.LOAD_CONCEPTO_AFORO:
             
            return  { ...state, conceptoAforo: action.payload   }    

        case types.LOAD_TECNICO_AFORADOR:
             
            return  { ...state, tecnicoAforador: action.payload   }    
        
        case types.LOAD_MUNICIPIO:
             
            return  { ...state, Municipio: action.payload   } 

        case types.LOAD_TIPO_GENERADOR:
             
            return  { ...state, tipoGenerador: action.payload   }    
            
        case types.LOAD_ACTIVIDAD:
             
            return  { ...state, Actividad: action.payload   }    

        case types.LOAD_ESTADO:
             
            return  { ...state, Estado: action.payload   } 

        case types.LOAD_DEPARTAMENTO:
             
            return  { ...state, Departamento: action.payload   }    

        case types.LOAD_TIPO_USO:
             
            return  { ...state, tipoUso: action.payload   }    

        case types.LOAD_CICLO:
             
            return  { ...state, Ciclo: action.payload   }    

        case types.LOAD_RUTA:
             
            return  { ...state, Ruta: action.payload   }   

        case types.LOAD_ESTRATO:
             
            return  { ...state, Estrato: action.payload   }  

        case types.LOAD_UBICACION:
             
            return  { ...state, Ubicacion: action.payload   }
            
        case types.LOAD_RUTAMICROMACRO:
             
            return  { ...state, RutaMicroMacro: action.payload   }

     


        default: return state;
    }
}