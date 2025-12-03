import { ApiDefaultService } from "../common/ApiDefaultService";
import RUTAS_API from "../../data/rutasApi";
import { AxiosResponse } from "axios";

export default class tablasGestionService extends ApiDefaultService {
  public rutas: any = RUTAS_API.HOMOLOGACIONES.TABLAS_GESTION;

  getListaBarriosAseo(): Promise<AxiosResponse> {
    return this.instance.get(
      this.rutas.LOAD_LISTA_BARRIOS_ASEO
    );
  }

  getListaUnidadesEdit(): Promise<AxiosResponse> {
    return this.instance.get(
      this.rutas.LOAD_LISTA_UNIDADES_EDIT
    );
  }

  getListaActualizacionOthers(pg: number, form: any): Promise<AxiosResponse> {
    return this.instance.post(
      `${this.rutas.LISTAR_ACTUALIZACION_OTHERS}${pg}/10`,
      form
    );
  }

  getListaActualizacionPunto(pg: number): Promise<AxiosResponse> {
    return this.instance.post(
      `${this.rutas.LISTAR_ACTUALIZACION_PUNTO}${pg}/10`
    );
  }

  getListaActualizacionSincronizadoSuscripcion(id: number,pg: number): Promise<AxiosResponse> {
    return this.instance.post(
      `${this.rutas.LISTAR_ACTUALIZACION_SINCRONIZADO_SUSCRIPCION}${id}/${pg}/10`
    );
  }


  deleteActualizacion(id: number | string): Promise<AxiosResponse> {
    return this.instance.put(`${this.rutas.BORRAR_ACTUALIZACION}${id}`);
  }

  getBuscarActualizacion(id: number | string): Promise<AxiosResponse> {
    return this.instance.get(`${this.rutas.BUSCAR_ACTUALIZACION}${id}`);
  }

  updateActualizacion(form: any): Promise<AxiosResponse> {
    return this.instance.post(`${this.rutas.ACTUALIZAR_ACTUALIZACION}`,form);
  }

  postActualizacion(id: number | string): Promise<AxiosResponse> {
    return this.instance.post(`${this.rutas.APROBAR_ACTUALIZACION}${id}`);
  }
  getImagenesActualizacion(id: number | string): Promise<AxiosResponse> {
    return this.instance.get(`${this.rutas.IMAGENES_ACTUALIZACION}${id}`);
  }

  //novedad
  getListaNovedad(pg: number | string, form: any): Promise<AxiosResponse> {
    return this.instance.post(`${this.rutas.LISTAR_NOVEDADES}${pg}/10`, form);
  }

  deleteNovedad(id: number | string): Promise<AxiosResponse> {
    return this.instance.put(`${this.rutas.ELIMINAR_NOVEDAD}${id}`);
  }
  aprobarNovedad(id: number | string): Promise<AxiosResponse> {
    return this.instance.post(`${this.rutas.APROBAR_NOVEDAD}${id}`);
  }
  getImagenenNovedad(id: number | string): Promise<AxiosResponse> {
    return this.instance.get(`${this.rutas.IMAGENES_NOVEDAD}${id}`);
  }
}
