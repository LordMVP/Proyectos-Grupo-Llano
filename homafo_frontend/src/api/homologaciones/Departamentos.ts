import { ApiDefaultService } from '../common/ApiDefaultService';

export default class HomologacionApi extends ApiDefaultService
{

    listaDepartamentos () {
        return this.instance.get('api/departamentos/lista');
    }
}