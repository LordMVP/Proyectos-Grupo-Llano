import { ApiDefaultService } from "../common/ApiDefaultService";
import RUTAS_API from "../../data/rutasApi";
import { AxiosResponse } from "axios";

export default class suscripcionTerceroApi extends ApiDefaultService {
  public rutas: any = RUTAS_API.HOMOLOGACIONES.TERCERO;
  public rutasPropiedades: any = RUTAS_API.HOMOLOGACIONES.TERCERO_PROPIEDAD;
  getSuscripcionTercero(data: {
    pag: number;
    body: any;
  }): Promise<AxiosResponse<any>> {
    const { pag, body } = data;
    return this.instance.post(
      `${this.rutas.BUSCAR_TERCERO}?page=${pag}&size=10`,
      body
    );
  }

  getSuscripcionTerceroClasificacion(): Promise<AxiosResponse<any>> {
    return this.instance.get(this.rutas.CLASIFICACION);
  }

  createSuscripcionTercero(form: any): Promise<AxiosResponse<any>> {
    return this.instance.post(this.rutas.CREAR_TERCERO, form);
  }
  actualizarSuscripcionTercero(data: {
    id: string;
    form: any;
  }): Promise<AxiosResponse<any>> {
    return this.instance.put(`${this.rutas.ACTUALIZAR}${data.id}`, data.form);
  }
  postCrearPropiedad(form: any): Promise<AxiosResponse<any>> {
    return this.instance.post(this.rutasPropiedades.CREAR_PROPIEDAD, form);
  }

  getBuscarPropiedadesPorTercero(
    id: string | number
  ): Promise<AxiosResponse<any>> {
    return this.instance.get(
      `${this.rutasPropiedades.BUSCAR_POR_TERCERO}${id}/propiedades`
    );
  }

  getBuscarPropiedadPorID(id: string | number): Promise<AxiosResponse<any>> {
    return this.instance.get(`${this.rutasPropiedades.BUSCAR_POR_ID}${id}`);
  }

  deletePropiedad(id: string | number): Promise<AxiosResponse<any>> {
    return this.instance.delete(
      `${this.rutasPropiedades.BORRAR_PROPIEDAD}${id}`
    );
  }

  putEditarPropiedad(data: {
    id: string | number;
    form: any;
  }): Promise<AxiosResponse<any>> {
    return this.instance.put(
      `${this.rutasPropiedades.EDITAR_PROPIEDAD}${data.id}`,
      data.form
    );
  }

  putCopiarPropiedad(data: {
    id: string | number;
    form: any;
  }): Promise<AxiosResponse<any>> {
    return this.instance.put(
      `${this.rutasPropiedades.COPIAR_PROPIEDAD}${data.id}`,
      data.form
    );
  }

  getTiposPropiedad(): Promise<AxiosResponse<any>> {
    return this.instance.get(this.rutasPropiedades.TIPOS_PROPIEDAD);
  }

  getComplementos(data: {
    idMunicipio: string | number;
    idBarrio: string | number;
  }): Promise<AxiosResponse<any>> {
    return this.instance.get(
      `${this.rutasPropiedades.COMPLEMENTOS}${data.idMunicipio}/barrios/${data.idBarrio}/complementos`
    );
  }

  getTiposClasificacionVivienda(): Promise<AxiosResponse<any>> {
    return this.instance.get(this.rutasPropiedades.CLASIFICACION_VIVIENDA);
  }
}
