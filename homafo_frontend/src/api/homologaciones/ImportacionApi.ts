import ImportacionSuggestRequest from '../../models/dto/ImportacionSuggestRequest';
import { PageableRequest } from '../../models/dto/Pagination';
import { PiminsTabla } from '../../models/dto/Pimins';
import { ApiDefaultService } from '../common/ApiDefaultService';

export default class ImportacionApi extends ApiDefaultService {
  public apiUrl = "api/importacion";

  public processFile(formData: FormData) {
    return this.instance.post(this.apiUrl + '/procesar', formData, {
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
  }

  public obtenerPimp(pimp: number, pageable: PageableRequest) {
    return this.instance.get('api/pimins/proyecciones/' + pimp, { params: pageable });
  }

  public getPimps(pageable: PageableRequest) {
    return this.instance.get('api/pimp/', { params: pageable });
  }

  public updateTablePimins(tabla: PiminsTabla, piminsIderegistro: number) {
    return this.instance.post('api/pimins/proyecciones/actualizar', { tabla: tabla, piminsIderegistro: piminsIderegistro });
  }

  public procesarPimp(pimpIderegistro: number) {
    const formData = new FormData();
    formData.append("pimpIderegistro", pimpIderegistro+"");
    return this.instance.post('api/pimins/proyecciones/procesar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  public suggestSearch(request:ImportacionSuggestRequest){
    return this.instance.post('api/importacion/suggest/',request);
  }
   public validarProcesoImportacion() {
    return this.instance.get('api/importacion/validar-proceso-importacion');
  }
}