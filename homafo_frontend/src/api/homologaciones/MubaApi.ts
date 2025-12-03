import { ApiDefaultService } from '../common/ApiDefaultService';
import { PageableRequest } from "../../models/dto/Pagination";
import MubaDTO from "../../models/dto/MubaDTO";


export default class MubaApi extends ApiDefaultService {
    public apiUrl = "api/muba";    
    
    save(item: MubaDTO) {
        return this.instance.post(this.apiUrl + '/dto', item)
        /*
        if (item.rureIderegistro != null) {            
            retur
            n this.instance.put(this.apiUrl + '/dto/' + item.rureIderegistro, item)
        } else {
            return this.instance.post(this.apiUrl + '/dto', item)
        }*/
    }
    getPage(pageable: PageableRequest | null) {        
        return this.instance.get(this.apiUrl + '/dto/page' , { params: pageable });
    }
    getPageEmpresa(pageable: PageableRequest | null,empresa: number) {        
        return this.instance.get(this.apiUrl + '/dto/page/empresa/'+empresa , { params: pageable });
    }

    getByEmpresaMunicipioBarrio(municipio: number,barrio: number){
            return this.instance.get(this.apiUrl + '/dto/municipio/'+municipio+'/barrio/'+barrio);
    }

    
}