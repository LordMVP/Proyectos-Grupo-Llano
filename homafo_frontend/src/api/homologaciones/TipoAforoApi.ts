import { ApiDefaultService } from '../common/ApiDefaultService';
import { PageableRequest } from "../../models/dto/Pagination";
import TipoAforoDTO from "../../models/dto/TipoAforoDTO";

export default class TipoAforoApi extends ApiDefaultService {
    public apiUrl = "api/tiposaforo";
        
    save(item: TipoAforoDTO) {
        console.log(item);
        if (item.tafoIderegistro != null) {            
            return this.instance.put(this.apiUrl + '/dto/' + item.tafoIderegistro, item)
        } else {
            return this.instance.post(this.apiUrl + '/dto', item)
        }
    }
    getPage(pageable: PageableRequest | null) {
        return this.instance.get(this.apiUrl + '/dto' , { params: pageable });
    }
    
    listaTafoGeneral()
    {
        return this.instance.get(this.apiUrl + '/dto');
    }

    fechaFinalAforo(tafoIderegistro,rureIderegistro,fechaInicial)
    {
        return this.instance.get(this.apiUrl + '/fechaFinalAforo/'+tafoIderegistro+'/'+rureIderegistro+'/'+fechaInicial);
    }
}