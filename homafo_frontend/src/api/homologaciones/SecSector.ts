import { ApiDefaultService } from '../common/ApiDefaultService';
import { PageableRequest } from '../../models/dto/Pagination';

export default class SecSector extends ApiDefaultService {
        public apiUrl = "api/sector";

    listaSectores() {
        return this.instance.get('api/sector');
    }

    getPage(pageable: PageableRequest | null) {
        return this.instance.get(this.apiUrl+"/dto/page",{params:pageable});
    }
    getPageEmpresa(pageable: PageableRequest | null, empresa: number) {
        return this.instance.get(this.apiUrl+"/dto/page/empresa/"+empresa,{params:pageable});
    }

}