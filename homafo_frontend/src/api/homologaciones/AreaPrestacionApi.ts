import { ApiDefaultService } from '../common/ApiDefaultService';
import { PageableRequest } from "../../models/dto/Pagination";


export default class AreaPrestacionApi extends ApiDefaultService {
    public apiUrl = "api/areaprestacion";    
       
    save(item: any) {
        console.log(item);
        if (item.rureIderegistro != null) {            
            return this.instance.put(this.apiUrl + '/dto/' + item.rureIderegistro, item)
        } else {
            return this.instance.post(this.apiUrl + '/dto', item)
        }
    }
    getPage(pageable: PageableRequest | null) {        
        return this.instance.get(this.apiUrl + '/dto/page' , { params: pageable });
    }

    
    
    
}