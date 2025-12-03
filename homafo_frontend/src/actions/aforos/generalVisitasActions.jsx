import * as types from '../actionTypes'
import { success, error } from 'react-notification-system-redux'
import { user_regisaforado_success, user_regisaforado_error } from '../../config/NotificationsConfig'
import * as API from '../../api/aforos/aforosVisitas'

export const loadAforosVisitas = (data, cb = null) => {

  return dispatch => {

    return API.GetAforosVisitasMain(data)

      ////////////   
      .then(responseJSON => {
        dispatch(setAforosVisitasResult(responseJSON))
        cb && cb()
        //dispatch(success(user_regisaforado_success));
      }).catch(err => {
        //dispatch(error(user_regisaforado_error));
        cb && cb() 

      });


  };
}


export const setAforosVisitasResult = data => {
  return { type: types.LOAD_AFOROS_VISITAS_RESULT, payload: data }
}


export const clearAforosVisitasResult = () => {
  return { type: types.CLEAR_AFOROS_VISITAS_RESULT }
}
