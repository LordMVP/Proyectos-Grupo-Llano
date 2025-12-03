import { ApiDefaultService } from '../common/ApiDefaultService';

export default class ConConcepto extends ApiDefaultService
{
    conceptosSuscripcionSesion(programa, usuario)
    {
    console.log(usuario);    
    return this.instance.get('api/conConcepto/busquedaUsuario/'+programa+'/'+0);
    }

}