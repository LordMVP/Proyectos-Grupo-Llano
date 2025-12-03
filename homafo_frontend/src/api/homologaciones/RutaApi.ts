import { ApiDefaultService } from '../common/ApiDefaultService';
import { PageableRequest } from "../../models/dto/Pagination";


export default class RutaApi extends ApiDefaultService {
    public apiUrl = "api/rutRuta";    
        
    save(item: any) {
        console.log(item);
        if (item.genIderegistro != null) {            
            return this.instance.put(this.apiUrl + '/dto/' + item.genIderegistro, item)
        } else {
            return this.instance.post(this.apiUrl + '/dto', item)
        }
    }
    getById(id:number){
        return this.instance.get(this.apiUrl+"/dto/"+id);
    }
    getPage(pageable: PageableRequest) {
        return this.instance.get(this.apiUrl + '/dto/macrorutas' , { params: pageable });
    }

    getPageByType(pageable: PageableRequest | null,tipoRuta : number){
        return this.instance.get(this.apiUrl + '/dto/tipo/'+tipoRuta,{params: pageable});
    }
    
    
}