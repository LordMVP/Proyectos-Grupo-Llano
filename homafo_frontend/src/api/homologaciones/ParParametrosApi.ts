import { ApiDefaultService } from '../common/ApiDefaultService';

export default class ParparametrosApi extends ApiDefaultService
{
    listaParametros()
    {
        return this.instance.get('api/parametros/homologacion');
    }

    configuracionGeneral()
    {
        return this.instance.get('api/parametros/configuracion');
    }
}