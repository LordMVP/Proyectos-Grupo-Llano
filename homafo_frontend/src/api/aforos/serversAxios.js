import axios from 'axios'

import { getToken } from '../../../src/utils/Utils'

const accessToken =getToken();
// const accessToken = localStorage.getItem('token')

// const apiAforosControllerServerURL ='http://190.14.232.146:8081/aforos/'
// const apiAforosContentStaticURL ='http://190.14.232.146:8081/aforos/api/contenidoEstatico/'

export const authAxios= axios.create({
    headers: {
        Authorization:`${accessToken}`
    }

})
