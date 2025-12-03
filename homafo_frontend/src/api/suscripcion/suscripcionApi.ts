import { ApiDefaultService } from "../common/ApiDefaultService";
import RUTAS_API from "../../data/rutasApi";
import { AxiosResponse } from "axios";
export default class suscripcionApi extends ApiDefaultService {
  public rutas: any = RUTAS_API.HOMOLOGACIONES.GENERAL;

  getCiudades(data: string): Promise<AxiosResponse<any>> {
    return this.instance.post(this.rutas.CIUDADES, { search: data });
  }
  getTipoIdentificacion(): Promise<AxiosResponse<any>> {
    return this.instance.get(this.rutas.TIPO_IDENTIFICACION);
  }

  getTipoPersona(): Promise<AxiosResponse<any>> {
    return this.instance.get(this.rutas.TIPO_PERSONA);
  }
  getMunicipios(): Promise<AxiosResponse<any>> {
    return this.instance.get(this.rutas.MUNICIPIOS);
  }
  getBarrios(id: string | number): Promise<AxiosResponse<any>> {
    return this.instance.get(`${this.rutas.BARRIOS}${id}/barrios`);
  }
}
