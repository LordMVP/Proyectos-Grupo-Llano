
import * as types from './actionTypes'
import * as user from '../api/User'
import { success, error } from 'react-notification-system-redux'
import { user_regisaforado_success, user_regisaforado_error } from '../config/NotificationsConfig'

export const saveUsuariosAforados = (data) =>{  
    return (dispatch) => {
      return user.saveUsuariosAforados(data).then(res => {
          dispatch(success(user_regisaforado_success));
      }).catch(err => {
         dispatch(error(user_regisaforado_error));
      });
    };
  }
  


export const login = (data, cb) => {
    return dispatch => {
        return user.login(data)
            .then(async data => {                             
                cb(data)                                                
                dispatch(setAuthenticated())
            })
            .catch(err => {                
                console.log(err)
                if (err.response && err.response.status === 401)
                    cb({ error: "El número de documento o la contraseña no corresponden a un usuario registrado." })
                else
                    cb({ error: "error de servidor" })


            });
    };

}


export const logout = data => {
    return dispatch => {
        return user.logout()
            .then(data => {
                dispatch(clearAuthenticated())
            })
            .catch(err => {
                console.log("error login")
                console.log(err)
            });
    };

}

export const setAuthenticated = () => {
    return { type: types.SET_AUTHENTICATED }
}
export const clearAuthenticated = () => {
    return { type: types.CLEAR_AUTHENTICATED }
}