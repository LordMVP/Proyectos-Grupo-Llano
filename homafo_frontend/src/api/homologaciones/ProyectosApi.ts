import { ApiDefaultService } from '../common/ApiDefaultService';
import { PageableRequest } from "../../models/dto/Pagination";
import ProyectoDTO from "../../models/dto/ProyectoDTO";

export default class    ProyectosApi extends ApiDefaultService {
    public apiUrl = "api/proyectos";    
        
    save(item: ProyectoDTO) {
        console.log(item);
        return this.instance.post(this.apiUrl + '/dto', item)
        /*
        if (item.rureIderegistro != null) {            
            return this.instance.put(this.apiUrl + '/dto/' + item.rureIderegistro, item)
        } else {
            return this.instance.post(this.apiUrl + '/dto', item)
        }*/
    }
    getPage(pageable: PageableRequest | null) {        
        return this.instance.get(this.apiUrl + '/dto/page/empresa' , { params: pageable });
    }
    
}