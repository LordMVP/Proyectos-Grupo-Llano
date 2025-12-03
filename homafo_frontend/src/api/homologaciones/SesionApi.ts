import { ApiDefaultService } from '../common/ApiDefaultService';

export default class SesionApi extends ApiDefaultService
{
    registrar(datos)
    {
        return this.instance.post('homologacion/sesion',datos);
    }
}