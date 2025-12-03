import { ApiDefaultService } from "../common/ApiDefaultService";
import RUTAS_API from "../../data/rutasApi";
import { AxiosResponse } from "axios";

export default class arcgisApi extends ApiDefaultService {
  public rutas: any = RUTAS_API.HOMOLOGACIONES.ARCGIS;

  getTokenMapa(): Promise<AxiosResponse<any>> {
    return this.instance.get(this.rutas.TOKEN);
  }

  postGeolocalizar(form: any): Promise<AxiosResponse<any>> {
    console.log(form);
    return this.instance.post(`${this.rutas.GEOLOCALIZAR}`, form);
  }
  postCaracteristicas(form: any): Promise<AxiosResponse<any>> {
    return this.instance.post(this.rutas.CARACTERISTICAS, form);
  }

  getCapas(): Promise<AxiosResponse<any>> {
    return this.instance.get(this.rutas.LISTA_CAPAS);
  }
}
