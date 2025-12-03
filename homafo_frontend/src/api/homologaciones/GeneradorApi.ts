import { ApiDefaultService } from '../common/ApiDefaultService';
import { PageableRequest } from "../../models/dto/Pagination";
import GeneradorDTO from "../../models/dto/GeneradorDTO";

export default class GeneradorApi extends ApiDefaultService {
    public apiUrl = "api/generadores";
       
    save(item: GeneradorDTO) {
        console.log(item);
        if (item.genIderegistro != null) {            
            return this.instance.put(this.apiUrl + '/dto/' + item.genIderegistro, item)
        } else {
            return this.instance.post(this.apiUrl + '/dto', item)
        }
    }
    getPage(pageable: PageableRequest) {
        return this.instance.get(this.apiUrl + '/dto' , { params: pageable });
    }
    
    
}