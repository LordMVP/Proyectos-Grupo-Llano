import { ApiDefaultService } from '../common/ApiDefaultService';

export default class ParparametrosAforoApi extends ApiDefaultService
{
    listaParametros()
    {        
        return this.instance.get('api/parametros/aforos');
    }
}