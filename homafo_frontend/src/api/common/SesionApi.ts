import RUTAS_API from '../../data/rutasApi';
import { ApiDefaultService } from '../common/ApiDefaultService';

export default class SesionApi extends ApiDefaultService {
   
    getMenu(){
        return this.instance.post(RUTAS_API.API.ENDPOINT+RUTAS_API.MENU.OBTENER_MENU);
    }

    getSesion(){
        return this.instance.post(RUTAS_API.API.ENDPOINT+RUTAS_API.SESION.VALIDAR_SESION);
    }

    loadPermisos(programa:number){
        return this.instance.post(RUTAS_API.SESION.LOAD_PERMISOS+'/'+programa);
      }
    
}