import { ApiDefaultService } from '../common/ApiDefaultService';

export default class Tertercero extends ApiDefaultService
{
    
    public tercerosAforadores()
    {
        return this.instance.get('api/contenidoEstatico/tiposGeneradores');
    }

    public getAforadores()
    {
        return this.instance.get('api/contenidoEstatico/tecnicosAforadores');
    }
}