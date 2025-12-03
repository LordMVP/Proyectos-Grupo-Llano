
import * as types from '../actionTypes'
import { success, error } from 'react-notification-system-redux'
import { user_regisaforado_success, user_regisaforado_error } from '../../config/NotificationsConfig'
import * as API from '../../api/aforos/aforos'
import * as APIMULTI from '../../api/aforos/aforosMulti';

export const LoadAforos = (data, cb = null) => {

  return dispatch => {

    return API.GetAforosMain(data)

      .then(responseJSON => {

        dispatch(setAforosResult(responseJSON))
        cb && cb()
        //dispatch(success(user_regisaforado_success));
      }).catch(err => {
        //dispatch(error(user_regisaforado_error));
        cb && cb() 

      });


  };
}

export const LoadAforosMulti = (data, cb = null) => {

  return dispatch => {

    return APIMULTI.GetAforosMain(data)

      .then(responseJSON => {

        dispatch(setAforosResult(responseJSON))
        cb && cb()
        //dispatch(success(user_regisaforado_success));
      }).catch(err => {
        //dispatch(error(user_regisaforado_error));
        cb && cb() 

      });


  };
}


export const setAforosResult = data => {
  return { type: types.LOAD_AFOROS_RESULT, payload: data }
}
export const clearAforosResult = () => {
  return { type: types.CLEAR_AFOROS_RESULT }
}

