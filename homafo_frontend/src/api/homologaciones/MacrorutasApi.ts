import axios from 'axios';
import { ApiDefaultService } from '../common/ApiDefaultService';
import { PageableRequest } from "../../models/dto/Pagination";
import MacrorutaDTO from "../../models/dto/MacrotutaDTO";


export default class MacrorutasApi extends ApiDefaultService {
    public apiUrl = "api/macrorutas";    
    public source = axios.CancelToken.source();
    
    save(item: MacrorutaDTO) {
        console.log(item);
        return this.instance.post(this.apiUrl + '/dto', item)
        /*
        if (item.rureIderegistro != null) {            
            return this.instance.put(this.apiUrl + '/dto/' + item.rureIderegistro, item)
        } else {
            return this.instance.post(this.apiUrl + '/dto', item)
        }*/
    }
    getPage(pageable: PageableRequest | null ) {       
        
        return this.instance.get(this.apiUrl + '/dto/page' , {cancelToken: this.source.token, params: pageable });
    }

    getByMacroruta(id:number){
        
        return this.instance.get(this.apiUrl + '/dto/macroruta/'+id,{ cancelToken: this.source.token });
    }
    
    
}