import { ApiDefaultService } from '../common/ApiDefaultService';
import { PageableRequest } from "../../models/dto/Pagination";
import BasicCompactDTO from "../../models/dto/BasicCompactDTO";
import UnidadDTO from "../../models/dto/UnidadDTO";
import PARAMETROS from '../../data/constantes';

export default class UnidadesApi extends ApiDefaultService {
    public apiUrl = "api/unidades";
    
    getNovedadesVisita(pageable: PageableRequest) {
        return this.instance.get(this.apiUrl + '/dto/' + PARAMETROS.CLASES_NOVEDADES.NOVEDADES_VISITA, { params: pageable });
    }
    save(item: BasicCompactDTO) {
        console.log(item);
        if (item.id != null) {
            console.log(item.id);
            return this.instance.put(this.apiUrl + '/dto/' + item.id, item)
        } else {
            return this.instance.post(this.apiUrl + '/dto/'+PARAMETROS.CLASES_NOVEDADES.NOVEDADES_VISITA, item)
        }
    }
    getByClass(clase: number,pageable?: PageableRequest) {
        const params = pageable? pageable : null;
        return this.instance.get(this.apiUrl + '/dto/' + clase, { params: params });
    }
    
    saveByClass(item: UnidadDTO, clase:number) {
        console.log(item);
        if (item.uniIderegistro != null) {
            return this.instance.put(this.apiUrl + '/dto/' + item.uniIderegistro, item)
        } else {
            return this.instance.post(this.apiUrl + '/dto/'+clase, item)
        }
    }
}