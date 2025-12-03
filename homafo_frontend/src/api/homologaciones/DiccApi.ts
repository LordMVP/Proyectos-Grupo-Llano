import { ApiDefaultService } from '../common/ApiDefaultService';

export default class DiccApi extends ApiDefaultService {
    public apiUrl = "api/importacion/suggest/diccionario";    
    
    
    getTableName(tabla) {        
        return this.instance.post(this.apiUrl + '/'+tabla);
    }
    getColumnName(tabla,columna) {        
        return this.instance.post(this.apiUrl + '/'+tabla+'/'+columna);
    }
    
    
}