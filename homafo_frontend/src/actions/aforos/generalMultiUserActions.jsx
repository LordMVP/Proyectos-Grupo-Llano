import * as types from '../actionTypes'
import { success, error } from 'react-notification-system-redux'
import { user_regisaforado_success, user_regisaforado_error } from '../../config/NotificationsConfig'
import * as API from '../../api/aforos/aforosMulti'

export const loadAforosMulti = (data, cb = null) => {
  console.log("filter main multi consulta ", data)

  return dispatch => {

    return API.GetAforosMain(data)

      .then(responseJSON => {
        console.log("result api search online::", responseJSON)

        dispatch(setAforosMultiResult(responseJSON))
        cb && cb()
        //dispatch(success(user_regisaforado_success));
      }).catch(err => {
        //dispatch(error(user_regisaforado_error));
        cb && cb() 

      });


  };
}


export const setAforosMultiResult = data => {
  return { type: types.LOAD_AFOROSMULTI_RESULT, payload: data }
}
export const clearAforosMultiResult = () => {
  return { type: types.CLEAR_AFOROSMULTI_RESULT }
}

