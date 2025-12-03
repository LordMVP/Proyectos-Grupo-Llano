
import * as types from '../actionTypes'
import { success, error } from 'react-notification-system-redux'
import { user_regisaforado_success, user_regisaforado_error } from '../../config/NotificationsConfig'
import * as API from '../../api/aforos/aforosHistoricos'

export const LoadAforosHistoricos = (data, cb = null) => {
  console.log("data main consulta ", data)

  return dispatch => {

    return API.GetAforosHistoricosMain(data)

      .then(responseJSON => {
        console.log("result search historicos online", responseJSON)

        dispatch(setAforosHistoricosResult(responseJSON))
        cb && cb()
        //dispatch(success(user_regisaforado_success));
      }).catch(err => {
        //dispatch(error(user_regisaforado_error));
        cb && cb() 

      });


  };
}


export const setAforosHistoricosResult = data => {
  return { type: types.LOAD_AFOROS_HISTORICOS_RESULT, payload: data }
}
export const clearAforosHistoricosResult = () => {
  return { type: types.CLEAR_AFOROS_HISTORICOS_RESULT }
}
