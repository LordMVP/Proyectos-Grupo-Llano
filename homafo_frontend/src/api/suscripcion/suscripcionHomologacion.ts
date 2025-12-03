import { ApiDefaultService } from "../common/ApiDefaultService";
import RUTAS_API from "../../data/rutasApi";
import { AxiosResponse } from "axios";

export default class suscripcionHomologacion extends ApiDefaultService {
  public rutas: any = RUTAS_API.HOMOLOGACIONES.HOMOLOGACION;

  postBuscar(data: any): Promise<AxiosResponse<any>> {
    return this.instance.post(this.rutas.FILTRO, data);
  }
  postBuscarHomologacion(data: any): Promise<AxiosResponse<any>> {
    return this.instance.post(this.rutas.BUSCAR, data);
  }
  getDetalleSuscripcion(id: string | number): Promise<AxiosResponse<any>> {
    return this.instance.get(`${this.rutas.DETALLE}${id}/detalles-suscripcion`);
  }

  getConvenios(): Promise<AxiosResponse<any>> {
    return this.instance.get(this.rutas.CONVENIOS);
  }

  getEmpresasConvenios(id: string | number): Promise<AxiosResponse<any>> {
    return this.instance.get(`${this.rutas.EMPRESAS_CONVENIOS}${id}/empresas`);
  }

  getConveniosEmpresas(id: string | number): Promise<AxiosResponse<any>> {
    return this.instance.get(`${this.rutas.CONVENIOS_EMPRESAS}${id}/convenios`);
  }

  getCiclos(id: string | number): Promise<AxiosResponse<any>> {
    return this.instance.get(`${this.rutas.CICLOS}${id}`);
  }

  postCrear(data: any): Promise<AxiosResponse<any>> {
    return this.instance.post(this.rutas.CREAR, data);
  }
  putActualizar(data: any): Promise<AxiosResponse<any>> {
    return this.instance.put(this.rutas.ACTUALIZAR, data);
  }
  getDsusHomologacion(id: string | number): Promise<AxiosResponse<any>> {
    return this.instance.get(
      `${this.rutas.DTOS_HOMOLOGACION_SUSCRIPCION}${id}`
    );
  }

  getEmpresas(): Promise<AxiosResponse<any>> {
    return this.instance.get(`${this.rutas.EMPRESAS}`);
  }

  getEmpresasAlternaHologable(): Promise<AxiosResponse<any>> {
    return this.instance.get(`${this.rutas.EMPRESAS_HOMOLOGABLES}`);
  }
  getSuscripcionesHomologaciones(
    id: number,
    idEmp: number
  ): Promise<AxiosResponse<any>> {
    return this.instance.get(
      this.rutas.SUSCRIPCIONES + id + "/suscripciones/" + idEmp
    );
  }

  getUnitsContactThird(): Promise<AxiosResponse<any>> {
    return this.instance.get(`${this.rutas.UNIDADES}`);
  }
}
