import jwt_decode from 'jwt-decode'
import cookie from 'react-cookies'
import { map } from 'lodash'

const utils = {

    checkStatus: response => {
        if (response.status >= 200 && response.status < 300) {
            return response;
        }
        const error = new Error(`HTTP Error`);
        error.status = response.statusText;
        error.response = response.data;
        throw error;
    },

    parseJSON: response => {
        return response.data;
    },
    getToken: (res) => {
        console.log("getToken:_:")
        console.log(res)
        let { result: { token } } = res

        let decoded_token = jwt_decode(token);

        cookie.save('bioagricolaSession', decoded_token, { path: '/', maxAge: 1000 })

        localStorage.setItem('jdzlToken', token);       

        // cookie.save('backofficeSession', decoded_token, { path: '/', maxAge: process.env.REACT_APP_COOKIE_MAX_AGE })

        return res
    }, 
    logout: () => {
        const cookies = cookie.loadAll()
        map(cookies, (value, DataSessionKey) => {

            cookie.remove(DataSessionKey, { path: '/' })
        })

        cookie.remove('llanogasSession', { path: '/', maxAge: 1000 })
        localStorage.removeItem('jdzlToken')
        localStorage.removeItem('nit')        
    },
};
export default utils