import { ApiDefaultService } from '../common/ApiDefaultService';
import { PageableRequest } from "../../models/dto/Pagination";
import BarrioDTO from "../../models/dto/BarrioDTO";

export default class BarriosApi extends ApiDefaultService {
    public apiUrl = "api/barrios";    
    
    save(item: BarrioDTO) {
        console.log(item);
        return this.instance.post(this.apiUrl + '/dto', item)        
    }
    getPage(pageable: PageableRequest | null) {        
        return this.instance.get(this.apiUrl + '/dto/page' , { params: pageable });
    }
    getPageEmpresa(pageable: PageableRequest | null,empresa: number) {        
        return this.instance.get(this.apiUrl + '/dto/page/empresa/'+empresa , { params: pageable });
    }
    getPageSearch(pageable: PageableRequest | null,search:string){
        return this.instance.post(this.apiUrl + '/dto/page/search/'+search ,null, { params: pageable });
    }

    getListByMicroRuta(microRuta: number){
        return this.instance.get(this.apiUrl + '/microruta/'+microRuta);
    }
    
}