import PARAMETROS from "../data/constantes";
import CryptoJS from 'crypto-js';

export const getToken = () => {
    let token = localStorage.getItem('datos_prisma');
    if (token == null) {
      //window.location.href = '/login';
      return;
    }
    token = JSON.parse(token).token;
    token = CryptoJS.AES.decrypt(token, PARAMETROS.CLAVE_ENCRIPTACION).toString(CryptoJS.enc.Utf8);
    return token;
  }
export const getSesionInfo = () => {
  let token = getToken();
  var base64Url = token?.split('.')[1];
    var base64 = base64Url?.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64 as string).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}  

  export const setToken = (newToken:string) => {
    console.log(newToken);
    const newTokenEnc = CryptoJS.AES.encrypt(newToken,PARAMETROS.CLAVE_ENCRIPTACION).toString();
    console.log(newTokenEnc);
    let datos_prisma = localStorage.getItem('datos_prisma');
    if (datos_prisma == null) {
      const new_datos_prisma = {token:newTokenEnc};
      localStorage.setItem('datos_prisma',JSON.stringify(new_datos_prisma));
      console.log(JSON.stringify(new_datos_prisma));
      window.location.href = PARAMETROS.BASENAME;
      return;
    }else {
      console.log("Actualizando token");
      const upd_datos_prisma = JSON.parse(datos_prisma);
      upd_datos_prisma.token = newTokenEnc;
      localStorage.setItem('datos_prisma',JSON.stringify(upd_datos_prisma));
      console.log(JSON.stringify(upd_datos_prisma));
      window.location.href = PARAMETROS.BASENAME;
      return;
    }
  }
  