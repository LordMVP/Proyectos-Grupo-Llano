
import * as types from './actionTypes'
import { success, error } from 'react-notification-system-redux'
import { user_regisaforado_success, user_regisaforado_error } from '../config/NotificationsConfig'

export const getAforos = data =>{  
    return (dispatch) => {
      return new Promise(resolve => {

        setTimeout(()=>{
            resolve([
              {num_aforo:"12",
              actividad:"acti ",
              fecha_final:"12/12/12",
              tipo_generador:"tip",
              volumen_total:"300",
              tafna:"gaso",
              estado:"active"

            },
              {num_aforo:"124",
              actividad:"acti ",
              fecha_final:"12/12/12",
              tipo_generador:"tip",
              volumen_total:"300",
              tafna:"gaso",
              estado:"active"

            },
              {num_aforo:"132",
              actividad:"acti ",
              fecha_final:"12/12/12",
              tipo_generador:"tip",
              volumen_total:"300",
              tafna:"gaso",
              estado:"active"

            },
              
            ])
        },500)


      }).then( x =>{
        dispatch(setAforosResult(x))
          //dispatch(success(user_regisaforado_success));
      }).catch(err => {
         //dispatch(error(user_regisaforado_error));
      });
    };
  }
  





export const setAforosResult = data => {
    return { type: types.LOAD_AFOROS_RESULT, payload: data }
}
export const clearAforosResult = () => {
    return { type: types.CLEAR_AFOROS_RESULT }
}

