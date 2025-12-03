import axios from "axios";
import RUTAS_API from "../../data/rutasApi";

// const API_URL = "http://localhost:8080/";


class AuthService {
  private instance;
  
  constructor(){
    this.instance = axios.create({ baseURL: RUTAS_API.API.ENDPOINT });
  }

  

  login(username, password,idEmpresa) {
    return this.instance
      .post(RUTAS_API.LOGIN.INICIO_SESION, {
        username,
        password,
        idEmpresa
      })
      .then(response => {
          console.log(response.headers);
        if (response.headers.authorization) {
          const token  = response.headers.authorization;
          localStorage.setItem("token", token);
        }
        return response;
      });
  }

  logout() {
    localStorage.removeItem("token");
  }

  

  getCurrentUser() {
    return localStorage.getItem('token');
  }

  getEmpresasLogin(){
    return this.instance.post(RUTAS_API.LOGIN.OBTENER_EMPRESAS,{});
  }
}

export default new AuthService();