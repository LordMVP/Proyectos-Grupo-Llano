import { ApiDefaultService } from "../common/ApiDefaultService";
import RUTAS_API from "../../data/rutasApi";
import { AxiosResponse } from "axios";

export default class suscripcionSuscriptorApi extends ApiDefaultService {
  public rutas: any = RUTAS_API.HOMOLOGACIONES.SUSCRIPCION;

  getConvenios(): Promise<AxiosResponse<any>> {
    return this.instance.get(this.rutas.CONVENIOS);
  }
  postCrearSuscriptor(data: any): Promise<AxiosResponse<any>> {
    return this.instance.post(this.rutas.CREAR_SUSCRIPTOR, data);
  }
  postCrearSuscripcion(data: any): Promise<AxiosResponse<any>> {
    return this.instance.post(this.rutas.CREAR_SUSCRIPCION, data);
  }

  putEditarSuscripcion(
    id: number | string,
    body: any
  ): Promise<AxiosResponse<any>> {
    return this.instance.put(`${this.rutas.EDITAR_SUSCRIPCION}${id}`, body);
  }

  getBuscarSuscripcionId(id: string | number): Promise<AxiosResponse<any>> {
    return this.instance.get(`${this.rutas.BUSCAR_ID}${id}`);
  }

  getDetalleSuscripcion(id: string | number): Promise<AxiosResponse<any>> {
    return this.instance.get(
      `${this.rutas.DETALLES}${id}/detalles-suscripcion`
    );
  }
  getPropiedades(id: string | number): Promise<AxiosResponse<any>> {
    return this.instance.get(`${this.rutas.PROPIEDADES}${id}/propiedades`);
  }

  getSuscripcionesByIDTercero(
    id: string | number
  ): Promise<AxiosResponse<any>> {
    return this.instance.get(`${this.rutas.BUSCAR_TERCERO}${id}/suscripciones`);
  }
  postFiltrarSuscripciones(body: any): Promise<AxiosResponse<any>> {
    return this.instance.post(this.rutas.FILTRO, body);
  }

  getEstadosSuscripcion(): Promise<AxiosResponse<any>> {
    return this.instance.get(this.rutas.ESTADOS);
  }
  getEstratos(): Promise<AxiosResponse<any>> {
    return this.instance.get(this.rutas.ESTRATOS);
  }
  getTiposUsos(): Promise<AxiosResponse<any>> {
    return this.instance.get(this.rutas.TIPOS_USOS);
  }

  getliquidaciones(): Promise<AxiosResponse<any>> {
    return this.instance.get(this.rutas.LIQUIDACIONES);
  }
  getCiclos(): Promise<AxiosResponse<any>> {
    return this.instance.get(`${this.rutas.CICLOS}`);
  }

  getRutas(idmun: string | number, idBar): Promise<AxiosResponse<any>> {
    return this.instance.get(`${this.rutas.RUTAS}${idmun}/${idBar}`);
  }

  getRutasAprovechamiento(tipoEstructura: string | number): Promise<AxiosResponse<any>> {
    return this.instance.get(`api/rutRuta/rutasTipo/${tipoEstructura}`);
  }

  getMacroRuta(): Promise<AxiosResponse<any>> {
    return this.instance.get(this.rutas.MACRORUTA);
  }

  getMacroRutaById(id: string | number): Promise<AxiosResponse<any>> {
    return this.instance.get(`${this.rutas.MACRORUTA_BY_ID}${id}/microrutas`);
  }

  getHorarioByMacroRuta(id: string | number): Promise<AxiosResponse<any>> {
    return this.instance.get(`${this.rutas.HORARIOS_RUTAS}${id}/horarios`);
  }
  getHorarioByRutas(id: string | number): Promise<AxiosResponse<any>> {
    return this.instance.get(`${this.rutas.HORARIOS_RUTAS}${id}/horarios`);
  }

  getActividadEconomica(): Promise<AxiosResponse<any>> {
    return this.instance.get(this.rutas.ACTIVIDAD_ECONOMICA);
  }

  getTiposSuscripcion(
    idMun: string | number,
    idCon: string | number
  ): Promise<AxiosResponse<any>> {
    return this.instance.get(
      `${this.rutas.TIPOS}${idMun}/convenio/${idCon}/tiposuscripcion`
    );
  }

  getConceptosLiquidacion(programa:string | number): Promise<AxiosResponse<any>> {
    return this.instance.get(`${this.rutas.CONCEPTOS}/${programa}`);
  }
  getEmpresas(): Promise<AxiosResponse<any>> {
    return this.instance.get(this.rutas.EMPRESAS);
  }
}
